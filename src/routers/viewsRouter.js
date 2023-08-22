const { Router } = require('express');
const ProductManagerMongo = require('../dao/ProductManagerMongo');
const CartsManagerMongo = require('../dao/CartsManagerMongo');
const UserModel = require('../dao/models/userModel');

const productManager = new ProductManagerMongo();
const cartManager = new CartsManagerMongo();
const viewsRouter = new Router();


// Middleware de sesión
const sessionMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirige si no hay sesión de usuario
    }
    return next();
};

// Ruta para registrar un nuevo usuario
viewsRouter.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new UserModel({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.atus(500).json({ error: 'Error interno del servidor' });
    }

});

viewsRouter.get('/register', sessionMiddleware, (req, res) => {
    return res.render('register');
});

// Ruta para el inicio de sesión
viewsRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user || !user.validPassword(password)) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        req.session.user = user;
        res.json({ message: 'Inicio de sesión exitoso', user });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


viewsRouter.get('/login', (req, res) => {

    return res.render('login');
});

// Ruta para cerrar sesión
viewsRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);

            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json({ message: 'Cierre de sesión exitoso' });
})
}
);



viewsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        const limit = req.query.limit

        if (products.length === 0) {
            return res.render('home', { title: 'Home', style: 'styles.css', noProducts: true });
        }

        if (limit) {
            const productosLimitados = products.slice(0, parseInt(limit))
            return res.render('home', { title: 'Home', style: 'styles.css', products: productosLimitados });
        }

        return res.render('home', { title: 'Home', style: 'styles.css', products: products });
    } catch (error) {
        return res.redirect('/error?message=Error al obtener los productos');
    }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        const limit = req.query.limit

        if (products.length === 0) {
            return res.render('realTimeProducts', { title: 'Real Time Products', style: 'styles.css', noProducts: true });
        }

        if (limit) {
            const productosLimitados = products.slice(0, parseInt(limit))
            return res.render('realTimeProducts', { title: 'Real Time Products', style: 'styles.css', products: productosLimitados });
        }

        return res.render('realTimeProducts', { title: 'Real Time Products', style: 'styles.css', products: products });
    } catch (error) {
        return res.redirect('/error?message=Error al obtener los productos');
    }
});

// Definimos la ruta /products solo una vez
viewsRouter.get('/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('products/allProducts', { products, cartId: 'your_cart_id' });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos', message: error.message });
    }
});

viewsRouter.get('/chat', async (req, res) => {
    try {
        //en esta instancia no se pasan los mensajes para evitar que se puedan visualizar antes de identificarse
        return res.render('chat', { title: 'Chat', style: 'styles.css' });
    } catch (error) {
        console.log(error)
    }
});

viewsRouter.get('/error', (req, res) => {
    const errorMessage = req.query.message || 'Ha ocurrido un error';
    res.render('error', { title: 'Error', errorMessage: errorMessage });
});

viewsRouter.get('/products/:cartId/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        // Primero, verifica si el carrito con el cartId existe.
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            return res.redirect('/error?message=Carrito no encontrado');
        }

        // Una vez que tienes el carrito, busca el producto por su productId.
        const product = cart.products.find(p => p.product === productId);

        if (!product) {
            return res.redirect('/error?message=Producto no encontrado en el carrito');
        }

        // Ahora, tienes el carrito y el producto. Puedes mostrarlos en la vista.
        res.render('products/product Details', { product, cartId });
    } catch (error) {
        res.redirect('/error?message=Error al obtener los detalles del producto');
    }
});


viewsRouter.get('/carts/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await cartManager.getCartById(cartId);
        res.render('carts/cartDetails', { cart });
    } catch (error) {
        res.redirect('/error?message=Error al obtener los detalles del carrito');
    }
});

// Ruta para agregar un producto al carrito
viewsRouter.post('/add-to-cart/:cartId/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        // Lógica para agregar el producto al carrito
        await cartManager.addProductToCart(cartId, productId);

        // Redirige de vuelta a la página de productos
        res.redirect('/products');
    } catch (error) {
        res.redirect('/error?message=Error al agregar el producto al carrito');
    }
});
viewsRouter.get('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productManager.getProductById(productId);
        res.render('products/productDetails', { product });

    } catch (error) {
        res.redirect('/error?message=Error al obtener los detalles del producto');
    }
});
// Ruta para manejar errores
viewsRouter.get('/error', (req, res) => {
    const errorMessage = req.query.message || 'Ha ocurrido un error';
    res.render('error', { title: 'Error', errorMessage: errorMessage });
});





module.exports = viewsRouter;


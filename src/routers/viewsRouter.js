const { Router } = require('express');
const passport = require('passport');
const userModel = require('../dao/UserManagerMongo');
const ProductManagerMongo = require('../dao/ProductManagerMongo');
const io = require('../utils/io'); // Asegúrate de que la ruta sea correcta

const viewsRouter = new Router();
const productManager = new ProductManagerMongo(io); // Asegúrate de que 'io' esté disponible

// Middleware de sesión
function sessionMiddleware(req, res, next) {
    if (req.session.user) {
        console.log('req.session.user');
        return res.redirect('/login');
    }
    return next();
}
viewsRouter.get('/github', passport.authenticate('github'));
viewsRouter.get('/github-callback', passport.authenticate('github', {
    successRedirect: '/profile', // Redirige a la página de perfil después de la autorización exitosa
    failureRedirect: '/login', // Redirige a la página de inicio de sesión en caso de error
}));


viewsRouter.get('/register', sessionMiddleware, (req, res) => {
    console.log('register');
    return res.render('register');
});

viewsRouter.get('/login', sessionMiddleware, (req, res) => {
     console.log(req.flash('error'))
    const error = req.flash('error')[0]
    console.log({ error })
    return res.render('login', { 
      error,
      hasError: error !== undefined
    })
  });

viewsRouter.get('/api/sessions/recovery-password', sessionMiddleware, (req, res) => {
    return res.render('recovery-password');
});


viewsRouter.get('/profile', (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const user = req.session.user;

    // Renderizar la página de perfil estándar para todos los usuarios
    return res.render('profile', { user });
});

viewsRouter.get('/allproducts', async (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // Verificar si el usuario es un administrador
    if (req.session.user.isAdmin) {
        // Si es un administrador, mostrar la página "allproducts"
        const io = req.app.get('io');
        const productManager = new ProductManagerMongo(io);

        try {
            // Obtener la lista de productos utilizando productManager
            const products = await productManager.getProducts();
            return res.render('products/allproducts', { products, user: req.session.user });
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return res.redirect('/error?message=Error al obtener los productos');
        }
    } else {
        // Si no es un administrador, redirigirlo a su página de perfil
        return res.redirect('/profile');
    }
});


viewsRouter.get('/home', async (req, res) => {
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

viewsRouter.get('/realtimeproducts', async (req, res, next) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        // Si el usuario no está autenticado o no es un administrador, redirigirlo o mostrar un mensaje de error.
        return res.redirect('/login'); // Cambia la redirección según tus necesidades.
    }

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
        // En esta instancia no se pasan los mensajes para evitar que se puedan visualizar antes de identificarse
        return res.render('chat', { title: 'Chat', style: 'styles.css' });
    } catch (error) {
        console.log(error)
    }
});

viewsRouter.get('/error', (req, res) => {
    const errorMessage = req.query.message || 'Ha ocurrido un error';
    res.render('error', { title: 'Error', errorMessage: errorMessage });
});

viewsRouter.get('/addToCart/:cartId/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        // Lógica para agregar el producto al carrito
        await cartManager.addProductToCart(cartId, productId);

        // Obtén el producto que se agregó al carrito
        const addedProduct = await productManager.getProductById(productId);

        // Renderiza una vista que muestre la confirmación de que el producto se ha agregado al carrito
        res.render('cart/addedToCart', { addedProduct });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: 'Error al agregar el producto al carrito' });
    }
});

viewsRouter.get('/products/:cartId/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        // Primero, verifica si el carrito con el cartId existe.
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            return res.render('error', { title: 'Error', errorMessage: 'Carrito no encontrado' });
        }

        // Una vez que tienes el carrito, busca el producto por su productId.
        const product = cart.products.find(p => p.product === productId);

        if (!product) {
            return res.render('error', { title: 'Error', errorMessage: 'Producto no encontrado en el carrito' });
        }

        // Ahora, tienes el carrito y el producto. Puedes mostrarlos en la vista.
        res.render('products/productDetails', { product, cartId });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: 'Error al obtener los detalles del producto' });
    }
});

viewsRouter.get('/carts/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await cartManager.getCartById(cartId);
        res.render('/carts/cartDetails', { cart });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: 'Error al obtener los detalles del carrito' });
    }
});

// Ruta para agregar un producto al carrito
viewsRouter.post('/addToCart/:cartId/:productId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        // Lógica para agregar el producto al carrito
        await cartManager.addProductToCart(cartId, productId);

        // Renderiza la página de productos (o la que corresponda)
        res.redirect('/products');
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: 'Error al agregar el producto al carrito' });
    }
});

viewsRouter.get('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productManager.getProductById(productId);
        res.render('products/productDetails', { product });
    } catch (error) {
        res.render('error', { title: 'Error', errorMessage: 'Error al obtener los detalles del producto' });
    }
});

// Ruta para manejar errores
viewsRouter.get('/error', (req, res) => {
    const errorMessage = req.query.message || 'Ha ocurrido un error';
    res.render('error', { title: 'Error', errorMessage: errorMessage });
});

module.exports = viewsRouter;



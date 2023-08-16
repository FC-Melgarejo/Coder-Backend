const { Router } = require('express');
const ProductManagerMongo = require('../dao/ProductManagerMongo');
const CartsManagerMongo = require('../dao/CartsManagerMongo'); 
const productManager = new ProductManagerMongo();
const cartManager = new CartsManagerMongo(); 
const viewsRouter = new Router();

viewsRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = req.query.limit;

        if (products.length === 0) {
            return res.render('home', { title: 'Home', style: 'styles.css', noProducts: true });
        }

        if (limit) {
            const productosLimitados = products.slice(0, parseInt(limit));
            return res.render('home', { title: 'Home', style: 'styles.css', products: productosLimitados });
        }

        return res.render('home', { title: 'Home', style: 'styles.css', products });
    } catch (error) {
        return res.redirect('/error?message=Error al obtener los productos');
    }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = req.query.limit;

        if (products.length === 0) {
            return res.render('realtimeProducts', { title: 'Real Time Products', style: 'styles.css', noProducts: true });
        }

        if (limit) {
            const productosLimitados = products.slice(0, parseInt(limit));
            return res.render('realtimeProducts', { title: 'Real Time Products', style: 'styles.css', products: productosLimitados });
        }

        return res.render('realtimeProducts', { title: 'Real Time Products', style: 'styles.css', products });
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
        console.log(error);
    }
});

viewsRouter.get('/error', (req, res) => {
    const errorMessage = req.query.message || 'Ha ocurrido un error';
    res.render('error', { title: 'Error', errorMessage });
});

viewsRouter.get('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productManager.getProductById(productId);
        res.render('products/productDetails', { product, cartId: 'your_cart_id' });
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

module.exports = viewsRouter;

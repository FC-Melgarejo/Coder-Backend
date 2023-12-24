const express = require('express');
const cacheController = require('express-cache-controller');
const CartsController = require('../controllers/cartController');
const UserMiddleware = require('../middleware/userMiddleware');

const cartsController = new CartsController();
const userMiddleware = new UserMiddleware();
const router = express.Router();

// Use cache middleware to set cache headers
router.use(cacheController({
  maxAge: 3600, // Cache for 1 hour (in seconds)
  mustRevalidate: true,
  private: true,
}));
// Define tus rutas usando los métodos del CartsController y renderiza las vistas
router.get('/carts', userMiddleware.isAuth, cartsController.getCarts.bind(cartsController));
router.get('/carts/:cid', userMiddleware.isAuth, cartsController.getCartById.bind(cartsController));
router.post('/carts', userMiddleware.isAuth, cartsController.createCart.bind(cartsController));
router.post('/carts/:cid/products/:pid', userMiddleware.isAuth, cartsController.addProductToCart.bind(cartsController));
router.put('/carts/:cid', userMiddleware.isAuth, cartsController.updateCart.bind(cartsController));
router.put('/carts/:cid/products/:pid', userMiddleware.isAuth, cartsController.updateProductQuantity.bind(cartsController));
router.delete('/carts/:cid/products/:pid', userMiddleware.isAuth, cartsController.removeProductFromCart.bind(cartsController));
router.delete('/carts/:cid', userMiddleware.isAuth, cartsController.clearCart.bind(cartsController));
router.post('/carts/:cid/purchase', userMiddleware.isAuth, userMiddleware.hasRole('admin', 'user'), cartsController.purchaseCart.bind(cartsController));

// Elimina la siguiente línea, ya que es redundante
// router.post('/carts/:cid/purchase', userMiddleware.isAuth, userMiddleware.hasRole('admin', 'user'), cartsController.purchaseCart.bind(cartsController));

module.exports = router;


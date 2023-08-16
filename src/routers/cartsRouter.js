const { Router } = require('express')
const CartManagerMongo = require('../dao/CartsManagerMongo');
/* const cartManager = new CartManager('./src/carrito.json') */
//const CartManager = new  CartManager()//
const cartsRouter = Router()


cartsRouter.post('/create', async (req, res) => {
    try {
        const newCart = await CartManager.createCart();
        return res.status(201).json({ status: 'success', message: 'Carrito creado exitosamente', cart: newCart });
    } catch (error) {

        return res.status(500).json({ error: 'Error al crear el carrito', message: error.message });
    }
});



cartsRouter.get('/:cid', async (req, res) => {
    const cid = req.params.cid
    try {
        const cart = await CartManager.getCartById(cid)
        return res.status(200).json({ status: 'success', payload: cart })
    } catch (error) {
        const commonErrorMessage = 'Error al obtener el carrito'
        if (error.message = 'No se encuentra el carrito') {
            return res.status(404).json({ error: commonErrorMessage, message: error.message });
        }
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
})


cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try {
        await CartManager.addProductToCart(cid, pid)
        return res.status(201).json({ status: 'success', message: 'Se ha guardado el producto en el carrito exitosamente' })
    } catch (error) {
        const commonErrorMessage = 'Error al guardar el producto en el carrito'
        if (error.message === 'Producto no encontrado en el inventario') {
            return res.status(404).json({ error: 'Producto no encontrado', message: 'El producto que intentas agregar no existe en el inventario' });
        }
        if (error.message === 'No se encuentra el carrito') {
            return res.status(404).json({ error: 'Producto no encontrado', message: 'El producto que intentas agregar no existe en el inventario' });
        }
        return res.status(500).json({ error: commonErrorMessage, message: error.message });
    }
})

// DELETE api/carts/:cid/products/:pid

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        await CartManager.removeProductFromCart(cartId, productId);
        return res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        return res.status(500).json({ error: 'Error al eliminar el producto del carrito', message: error.message });
    }
});



// PUT api/carts/:cid
cartsRouter.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body.products;
    try {
        await CartManager.updateCartProducts(cartId, updatedProducts);
        return res.status(200).json({ status: 'success', message: 'Carrito actualizado exitosamente' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error al actualizar el carrito', message: error.message });
    }
});

// PUT api/carts/:cid/products/:pid

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;



    try {
        await CartManager.updateCartItemQuantity(cartId, productId, newQuantity);
        return res.status(200).json({ status: 'success', message: 'Cantidad del producto en el carrito actualizada' });
    }

    catch (error) {
        return res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito', message: error.message });
    }
});

// DELETE api/carts/:cid

cartsRouter.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    try {
        await CartManager.clearCart(cartId);
        return res.status(200).json({ status: 'success', message: 'Carrito vaciado exitosamente' });
    }

    catch (error) {
        return res.status(500).json({ error: 'Error al vaciar el carrito', message: error.message });
    }
});

module.exports = cartsRouter


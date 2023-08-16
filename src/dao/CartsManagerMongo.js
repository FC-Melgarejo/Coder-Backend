const Cart = require('./models/cartModel');
const Producto = require('./models/productModel');

class CartManagerMongo {

    async createCart() {
        try {
            const collection = this.db.collection('carts');
            const newCart = {
                id: (await collection.countDocuments()) + 1,
                products: [],
            };

            await collection.insertOne(newCart);

            return newCart;
        } catch (error) {
            console.log('No se agregó al carrito');
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productoExistente = cart.products.find(product => product.product.toString() === productId);
            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                cart.products.push({
                    producto: productId,
                    cantidad: 1
                });
            }

            await cart.save();

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(producto => producto.producto.toString() !== productId);
            await cart.save();

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateCartProducts(cartId, updatedProducts) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productosParaAgregar = updatedProducts.map(productId => ({
                producto: productId,
                cantidad: 1
            }));

            cart.products = productosParaAgregar;
            await cart.save();

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateCartItemQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const indiceProducto = cart.products.findIndex(producto => producto.producto.toString() === productId);
            if (indiceProducto !== -1) {
                cart.products[indiceProducto].cantidad = newQuantity;
                await cart.save();
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            
            cart.products = [];
            await cart.save();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartManagerMongo;







const cartModel = require('../dao/models/cartModel');

class CartRepository {
    constructor() {
        this.model = cartModel;
    }

    async getAllCarts() {
        try {
            const carts = await this.model.find();
            return carts.map(cart => cart.toObject());
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await this.model.findById(id);
            if (!cart) {
                throw new Error('No se encuentra el carrito');
            }
            return cart.toObject();
        } catch (error) {
            throw error;
        }
    }

    async createCart() {
        try {
            const newCart = await this.model.create({ products: [] });
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('No se encuentra el carrito');
            }

            
            const product = await productRepository.getProductById(productId);

            if (!product) {
                throw new Error('Producto no encontrado en el inventario');
            }

            const existingProductInCart = cart.products.findIndex(p => p.product.toString() === productId);
            const productToAdd = {
                product: productId,
                quantity: 1
            };

            if (existingProductInCart !== -1) {
                cart.products[existingProductInCart].quantity++;
            } else {
                cart.products.push(productToAdd);
            }

            cart.markModified('products');
            await cart.save();
        } catch (error) {
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('No se encuentra el carrito');
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }

            cart.products.splice(productIndex, 1);
            await cart.save();
        } catch (error) {
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await this.model.findById(cartId);
            if (!cart) {
                throw new Error('No se encuentra el carrito');
            }

            cart.products = [];
            await cart.save();
        } catch (error) {
            throw error;
        }
    }
    async update(cart) {
        try {
            const updatedCart = await cart.save();
            return updatedCart.toObject();
        } catch (error) {
            throw error;
        }
    }
    
}

module.exports = CartRepository;
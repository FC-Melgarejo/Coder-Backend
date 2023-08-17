const cartModel = require('./models/cartModel')
const productModel = require('./models/productModel')

class CartManagerMongo {
    constructor() {
        this.model = cartModel
    }

    async getCarts() {
        try {
            const carts = await this.model.find()

            return carts.map(p => p.toObject())
        } catch (error) {
            throw error
        }
    }

    async getCartById(id) {
        try {
            const cart = await this.model.findById(id)
            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }
            return  cart.toObject()
        } catch (error) {
            throw error
        }
    }

    async addCart() {
        try {
            const newCart = await this.model.create({ product: [] })
            return newCart
        } catch (error) {
            throw error
        }
    }

    async addProductToCart(cid, pid) {
        
        try {
            const cart = await this.model.findById(cid)
        
            const product = await productModel.findById(pid)

            if (!cart) {
                throw new Error('No se encuentra el carrito')
            }

            if (!product) {
                throw new Error('Producto no encontrado en el inventario')
            }

            const existingProductInCart = cart.products.findIndex((p) => p.product === pid);
            const productToAdd = {
                product: product.id,
                quantity: 1
            };

            (existingProductInCart !== -1)
                ? cart.products[existingProductInCart].quantity++
                : cart.products.push(productToAdd);

            cart.markModified('products')
            cart.save()
        } catch (error) {
            throw error
        }
    }
}

module.exports = CartManagerMongo







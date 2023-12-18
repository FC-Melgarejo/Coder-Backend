const Cart = require('../dao/models/cartModel');

class CartDao {
  async findById(cartId) {
    return await Cart.findById(cartId).populate('products.product');
  }

  async createCart() {
    return await Cart.create({});
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    cart.products.push({ product: productId });
    return await cart.save();
  }

  async updateCartProducts(cartId, newProducts) {
    const cart = await Cart.findById(cartId);
    cart.products = newProducts;
    return await cart.save();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    const product = cart.products.find(item => item.product.toString() === productId);
    
    if (product) {
      product.quantity = quantity;
      return await cart.save();
    }

    throw new Error('Product not found in the cart');
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter(item => item.product.toString() !== productId);
    return await cart.save();
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    cart.products = [];
    return await cart.save();
  }
}

module.exports = CartDao;

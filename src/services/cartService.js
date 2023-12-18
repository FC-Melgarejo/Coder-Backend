const cartRepository = require('../repositories/cartRepository');
const ticketService = require('./ticketService');

async function purchase(cartId) {
  const cart = await cartRepository.findById(cartId);

  const purchasedProducts = [];
  const failedProducts = [];

  for (const item of cart.products) {
    const product = item.productId;
    const quantityInCart = item.quantity;

    if (product.stock >= quantityInCart) {
      // Resta el stock del producto
      product.stock -= quantityInCart;
      purchasedProducts.push({
        productId: product._id,
        quantity: quantityInCart,
      });
    } else {
      // Agrega el producto a la lista de fallos
      failedProducts.push(product._id);
    }
  }

  // Crea el ticket
  const ticket = await ticketService.createTicket({
    code: generateUniqueCode(),
    amount: calculateTotalAmount(purchasedProducts),
    purchaser: cart.userId,
    products: purchasedProducts,
  });

  // Actualiza el carrito con los productos que no se pudieron comprar
  cart.products = cart.products.filter(item => failedProducts.includes(item.productId.toString()));
  await cartRepository.update(cart);

  return { ticket, failedProducts };
}

function generateUniqueCode() {
  // Lógica para generar códigos únicos
}

function calculateTotalAmount(products) {
  // Lógica para calcular el monto total de la compra
}

module.exports = {
  purchase,
};

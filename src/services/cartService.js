const cartRepository = require('../repos/cartRepository');
const ticketService = require('./tiketService');
const ProductsRepository = require('../repos/productsRepository');
const { v4: uuidv4 } = require('uuid'); 

const productsRepository = new ProductsRepository();


async function purchase(cartId) {
  const cart = await cartRepository.findById(cartId);

  const purchasedProducts = [];
  const failedProducts = [];

  for (const item of cart.products) {
    try {
      const product = await productsRepository.getOne(item.product._id);
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
    } catch (error) {
      // Manejo de errores al obtener información del producto
      console.error(`Error al obtener información del producto: ${error.message}`);
      failedProducts.push(item.product._id);
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
  return uuidv4();
}

function calculateTotalAmount(products) {
  return products.reduce((total, product) => {
    return total + (product.quantity * product.price); 
  }, 0);
}


module.exports = {
  purchase,
};

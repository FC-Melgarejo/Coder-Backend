const moment = require('moment');
const ProductManagerMongo = require('../dao/ProductManagerMongo');
const MessageManagerMongo = require('../dao/MessageManagerMongo');
const CartManagerMongo = require("../dao/CartsManagerMongo");

const handleSocketConnection = (io) => {
  const productManagerMongo = new ProductManagerMongo(io);
  const messageManagerMongo = new MessageManagerMongo(io);

  io.on('connection', socket => {
    console.log('Nuevo cliente conectado', socket.id)

    socket.on('addProduct', async productData => {
      const product = JSON.parse(productData);
      
      try {
        await productManagerMongo.addProduct(product);
        console.log(product);
        socket.emit('notification', 'El producto fue agregado con éxito');
      } catch (error) {
        socket.emit('notification', error.message)
      }
    });

    socket.on('updateProduct', async (productId, data) => {
      try {
        await productManagerMongo.updateProduct(productId, data);
        socket.emit('notification', 'El producto fue actualizado exitósamente');
      } catch (error) {
        socket.emit('notification', error.message);
      }
    });

    socket.on('deleteProduct', async productId => {
      try {
        await productManagerMongo.deleteProduct(productId);
        socket.emit('notification', 'El producto fue borrado con éxito');
      } catch (error) {
        socket.emit('notification', error.message)
      }
    });
    // Manejo de sockets para el carrito
    socket.on('addProductToCart', async (productToCart) => {
      const { cid, pid } = productToCart;
      try {
        await CartManagerMongo.addProductToCart(cid, pid);
        console.log('Producto agregado al carrito correctamente');
        socket.emit('productAddedToCart', 'Producto agregado al carrito');
      } catch (error) {
        console.log('Error al agregar el producto al carrito:', error.message);
        socket.emit('productAddError', 'Error al agregar el producto al carrito');
      }
    });

    socket.on('joinChat', async (newUser) => {
      try {
        socket.broadcast.emit('notification', `El usuario ${newUser} se unió al chat`);

        const messages = await messageManagerMongo.getMessages();

        const formattedMessages = messages.map((message) => ({
          ...message,
          formattedTimestamp: moment(message.timestamp).format('MMMM Do YYYY, h:mm:ss a'),
        }));

        socket.emit('printPreviousMessages', formattedMessages);
      } catch (error) {
        socket.emit('notification', error.message);
      }
    });

    socket.on('newMessage', async ({ user, message }) => {
      try {
        const newMessage = await messageManagerMongo.addMessage(user, message);
        socket.broadcast.emit('notification', `Hay un nuevo mensaje de ${user}`);

        io.emit('printNewMessage', {
          user: newMessage.user,
          content: newMessage.content,
          timestamp: moment(newMessage.timestamp).format('MMMM Do YYYY, h:mm:ss a'),
        });

      } catch (error) {
        socket.emit('notification', error.message);
      }
    });

  })
}

module.exports = handleSocketConnection
const socket = io(); // Configura la conexión con Socket.IO
let cartId; // Almacena el ID del carrito del cliente

socket.on("cartId", (receivedCartId) => {
  cartId = receivedCartId;
  console.log(`ID del carrito asignado: ${cartId}`);
});

// Resto del código para manejar la interacción del cliente...

// En tus eventos de agregar productos al carrito, puedes usar el ID del carrito asignado automáticamente
addToCartButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    if (!cartId) {
      console.error("ID del carrito no disponible");
      return;
    }

    const productId = button.getAttribute("data-productid");

    const productToCart = {
      cid: cartId,
      pid: productId,
    };

    socket.emit("addProductToCart", productToCart);
  });
});

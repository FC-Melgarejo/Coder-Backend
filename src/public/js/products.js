// Archivo: public/js/products.js
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.addToCartBtn');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.getAttribute('data-product-id');
      // Realiza una solicitud POST al servidor para agregar el producto al carrito
      try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity: 1 }) // Cambia la cantidad según tus necesidades
        });

        if (response.ok) {
          // Producto agregado al carrito exitosamente
          // Puedes mostrar una notificación o actualizar la vista del carrito si es necesario
        } else {
          console.error('Error al agregar al carrito:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error al enviar la solicitud:', error);
      }
    });
  });
});

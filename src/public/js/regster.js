// Manejar el envío del formulario
document.querySelector('.registration-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Evitar el envío del formulario por defecto

  // Obtener datos del formulario
  const formData = {
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('lastname').value,
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    isAdmin: document.getElementById('admin').value === 'true', // Convierte el valor a booleano
  };

  // Realizar la solicitud POST al servidor
  fetch('/api/sessions/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then(response => {
      if (response.ok) {
        // Redirige al usuario a la página de inicio de sesión
        window.location.href = '/login';
      } else {
        // Maneja errores
        return response.json();
      }
    })
    .then(data => {
      // Maneja el JSON de error si es necesario
      console.error(data.error);
    })
    .catch(error => {
      console.error('Error al procesar la solicitud:', error);
    });
});


  
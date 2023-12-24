document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
  
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const formData = new FormData(loginForm);
      const response = await fetch('/api/sessions/login', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
  
      if (result.status === 'success') {
        // Redirige al usuario a la página deseada después del inicio de sesión
        window.location.href = '/allproducts';
      } else {
        // Maneja errores si es necesario
        console.error(result.error);
      }
    });
  });
  


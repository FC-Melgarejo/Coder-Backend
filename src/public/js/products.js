console.log('Hola')

const nameInput = document.getElementById('nameInput')
const codeInput = document.getElementById('codeInput')
const stockInput = document.getElementById('stockInput')
const priceInput = document.getElementById('priceInput')
const productForm = document.getElementById('productForm')
const sendButton = document.getElementById('sendButton')


productForm.addEventListener('submit', e => {
  e.preventDefault()

  const title = nameInput.value
  const code = codeInput.value
  const stock = stockInput.value
  const price = priceInput.value
  console.log({ title, code, stock, price })

  fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify({ title, code, stock, price }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => console.log(data))
})

const deleteProduct = id => {
  console.log(id)

  fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(response => response.json())
  .then(data => console.log(data))
}

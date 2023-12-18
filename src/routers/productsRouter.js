const {Router} = require('express')
const ProductService = require('../services/productService')
// const productsRouter = Router()
const ProductController = require('../controllers/productsController')

const productRouterFn = () => {
  const productsRouter = Router()
  const productService = new ProductService()
  const productController = new ProductController(productService)

  productsRouter.get('/', productController.getAll.bind(productController))
  
  productsRouter.get('/:pid', productController.getById.bind(productController))
  
  productsRouter.post('/', productController.create.bind(productController))
  
  productsRouter.put('/:pid', productController.update.bind(productController))
  
  productsRouter.delete('/:pid', productController.delete.bind(productController))

  return productsRouter

}

module.exports = productRouterFn




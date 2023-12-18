const productsDAOFactory = require('../factory/productSDAOFactory')
const ProductsDTO = require('../DTO/productsDTO')


class ProductsRepository {
  constructor () {
    this.dao = productsDAOFactory(process.env.STORAGE)
  }

  getAll () {
    return this.dao.getAll()
      .then(products => products.map(product => new ProductsDTO(product)))
  }

  create (data) {
    return this.dao.create(data)
  }

  getOne (id) {
    return this.model.findById(id)
      .then(product => {
        if (!product) {
          throw new Error('Producto no encontrado')
        }

        return product
      })
  }

  update (id, data) {
    return this.model.findByIdAndUpdate(id, { $set: data })
      .then(product => {
        if (!product) {
          throw new Error('Producto no encontrado')
        }

        return product
      })
  }

  delete (id) {
    return this.model.findByIdAndDelete(id)
      .then(product => {
        if (!product) {
          throw new Error('Producto no encontrado')
        }

        return product
      })
  }
}

module.exports = ProductsRepository

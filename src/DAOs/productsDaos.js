const productModel = require('../dao/models/productModel')


class ProductsDAOMongo {
  constructor () {
    this.model = productModel
  }

  getAll () {
    return this.model.find()
  }

  create (data) {
    return this.model.create(data)
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

module.exports = ProductsDAOMongo
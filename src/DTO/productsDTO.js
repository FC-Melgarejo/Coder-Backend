class ProductsDTO {
    constructor (product) {
      this.id = product._id || product.id
      this.title = product.title
      this.price = product.price
      this.code = product.code
    }
  }
  
  module.exports = ProductsDTO
const ProductsDAOMongo = require('../DAOs/productsDaos')
const productModel = require('../dao/models/productModel')
const ProductsRepository = require('../repos/productsRepository')
const { sendMail } = require('../utils/mailing')

class ProductService {
    constructor() {
      this.repository = new ProductsRepository()
      // this.repository = productModel
    }

    async getAllProducts() {
        const products = await this.repository.getAll()

        return products
    }

    async getProductById(id) {
        return this.repository.findById(id)
    }

    async addProduct(body) {
        return this.repository.create({
            code: body.code,
            stock: body.stock,
            title: body.title,
            price: body.price
        }).then(product => {
          console.log({ product })
          sendMail('Nuevo producto agregado', JSON.stringify(product))
          return product
        })
    }

    async updateProduct(id, body) {
        const product = await this.getProductById(id)

        if (!product) {
            throw new Error('Producto no existe')
        }

        const productUpdated = {
            _id: product._id,
            code: body.code || product.code,
            stock: body.stock || product.stock,
            title: body.title || product.title,
            price: body.price || product.email
        }

        await this.repository.updateOne({ _id: id }, productUpdated)

        return productUpdated
    }

    async deleteProduct(id) {
        const product = await this.repository.findById(id)

        if (!product) {
            throw new Error('Producto no existe')
        }

        await this.repository.deleteOne({ _id: id })

        return true
    }

}

module.exports = ProductService
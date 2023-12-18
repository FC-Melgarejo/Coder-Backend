class ProductController {
    constructor (service) {
      this.service = service
    }
  
    async getAll(req, res) {
      const products = await this.service.getAllProducts()
      
      res.json(products);
    }
  
    async getById(req, res) {
      const pid = req.params.pid
      const product= await this.service.getProductById(pid)
      return res.json(product)
    }
  
    async create(req, res) {
      const body = req.body
  
      const product = await this.service.addProduct(body)
  
      return res.status(201).json(product)
    }
  
    async update (req, res) {
      const pid = req.params.pid
      const body = req.body
      const product = await this.service.updateProduct(pid, body)
  
      return res.json(product)
    }
  
    async delete (req, res) {
      const pid = req.params.pid
  
      try {
          const product = await this.service.deleteProduct(pid)
      
          return res.json(product)
  
      } catch (e) {
          return res.status(404).json({
              message: e.message
          })
      }
    }
  
  }
  
  module.exports = ProductController
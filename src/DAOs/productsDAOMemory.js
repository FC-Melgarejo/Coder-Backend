class ProductsDAOMemory {
  constructor() {
    this.products = [
      {
        title: "Pelota de futbol",
        price: 100,
        id: 1,
      },
      {
        title: "Raqueta de tenis",
        price: 100,
        id: 2,
      },
      {
        title: "Bicicleta de Montaña",
        price: 100,
        id: 3,
      },
    ];
  }

  getAll() {
    return Promise.resolve(this.products);
  }
}

module.exports = ProductsDAOMemory;

const fs = require('fs').promises;

class ProductsManager {
  constructor(path) {
    this.path = path;
  }

  // Leer productos de un archivo
  async readProducts() {
    try {
      const products = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(products);
    } catch (error) {
      console.error('Error reading products file:', error);
      return [];
    }
  }

  // Guardar productos en un archivo
  async saveProducts(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  }

  // Generar un nuevo ID para un producto
  async generateId() {
    const products = await this.readProducts();
    const maxId = Math.max(...products.map(p => p.id), 0);
    return maxId + 1;
  }
}

module.exports = ProductsManager;

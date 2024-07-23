const fs = require('fs').promises;

class CartsManager {
  constructor(path) {
    this.path = path;
  }

  // Leer carritos de un archivo
  async readCarts() {
    try {
      const carts = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(carts);
    } catch (error) {
      console.error('Error reading carts file:', error);
      return [];
    }
  }

  // Guardar carritos en un archivo
  async saveCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.error('Error saving carts:', error);
    }
  }

  // Generar un nuevo ID para un carrito
  async generateId() {
    const carts = await this.readCarts();
    const maxId = Math.max(...carts.map(c => c.id), 0);
    return maxId + 1;
  }
}

module.exports = CartsManager;

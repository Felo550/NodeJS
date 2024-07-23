const express = require('express');
const router = express.Router();
const CartsManager = require('../utils/CartsManager');

// Crear instancia de CartsManager
const cartsManager = new CartsManager('./data/carts.json');

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = { id: await cartsManager.generateId(), products: [] };
  const carts = await cartsManager.readCarts();
  carts.push(newCart);
  await cartsManager.saveCarts(carts);
  res.status(201).json(newCart);
});

// Ruta para obtener los productos de un carrito por ID
router.get('/:cid', async (req, res) => {
  const carts = await cartsManager.readCarts();
  const cart = carts.find(c => c.id === parseInt(req.params.cid));
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// Ruta para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const carts = await cartsManager.readCarts();
  const cartIndex = carts.findIndex(c => c.id === parseInt(req.params.cid));
  if (cartIndex === -1) {
    return res.status(404).json({ error: 'Cart not found' });
  }
  const cart = carts[cartIndex];
  const productIndex = cart.products.findIndex(p => p.id === parseInt(req.params.pid));
  if (productIndex !== -1) {
    // Incrementar cantidad si el producto ya existe en el carrito
    cart.products[productIndex].quantity += 1;
  } else {
    // Agregar nuevo producto al carrito
    cart.products.push({ id: parseInt(req.params.pid), quantity: 1 });
  }
  carts[cartIndex] = cart;
  await cartsManager.saveCarts(carts);
  res.status(200).json(cart);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const ProductsManager = require('../utils/ProductsManager');

// Crear instancia de ProductsManager
const productsManager = new ProductsManager('./data/products.json');

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  const products = await productsManager.readProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// Ruta para obtener un producto por ID
router.get('/:pid', async (req, res) => {
  const products = await productsManager.readProducts();
  const product = products.find(p => p.id === parseInt(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Ruta para crear un nuevo producto
router.post('/', async (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'All fields except thumbnails are required' });
  }
  const newProduct = { id: await productsManager.generateId(), title, description, code, price, status, stock, category, thumbnails };
  const products = await productsManager.readProducts();
  products.push(newProduct);
  await productsManager.saveProducts(products);
  res.status(201).json(newProduct);
});

// Ruta para actualizar un producto
router.put('/:pid', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  const products = await productsManager.readProducts();
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.pid));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const updatedProduct = {
    ...products[productIndex],
    title: title || products[productIndex].title,
    description: description || products[productIndex].description,
    code: code || products[productIndex].code,
    price: price || products[productIndex].price,
    status: status !== undefined ? status : products[productIndex].status,
    stock: stock || products[productIndex].stock,
    category: category || products[productIndex].category,
    thumbnails: thumbnails || products[productIndex].thumbnails
  };
  products[productIndex] = updatedProduct;
  await productsManager.saveProducts(products);
  res.json(updatedProduct);
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
  const products = await productsManager.readProducts();
  const newProducts = products.filter(p => p.id !== parseInt(req.params.pid));
  if (products.length === newProducts.length) {
    return res.status(404).json({ error: 'Product not found' });
  }
  await productsManager.saveProducts(newProducts);
  res.status(204).end();
});

module.exports = router;

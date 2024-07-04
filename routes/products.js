const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './data/products.json';

const readProducts = () => JSON.parse(fs.readFileSync(path, 'utf-8'));
const saveProducts = (products) => fs.writeFileSync(path, JSON.stringify(products, null, 2));
const generateId = () => Math.max(...readProducts().map(p => p.id)) + 1;

router.get('/', (req, res) => {
    const products = readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

router.get('/:pid', (req, res) => {
    const product = readProducts().find(p => p.id === parseInt(req.params.pid));
    product ? res.json(product) : res.status(404).json({ error: 'Product not found' });
});

router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'All fields except thumbnails are required' });
    }
    const newProduct = { id: generateId(), title, description, code, price, status, stock, category, thumbnails };
    const products = readProducts();
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(pid));
    if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });
    const updatedProduct = { ...products[productIndex], ...req.body, id: parseInt(pid) };
    products[productIndex] = updatedProduct;
    saveProducts(products);
    res.json(updatedProduct);
});

router.delete('/:pid', (req, res) => {
    const products = readProducts();
    const newProducts = products.filter(p => p.id !== parseInt(req.params.pid));
    products.length === newProducts.length ? res.status(404).json({ error: 'Product not found' }) : saveProducts(newProducts);
    res.status(204).send();
});

module.exports = router;

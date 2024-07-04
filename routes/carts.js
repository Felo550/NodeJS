const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './data/carts.json';

const readCarts = () => JSON.parse(fs.readFileSync(path, 'utf-8'));
const saveCarts = (carts) => fs.writeFileSync(path, JSON.stringify(carts, null, 2));
const generateId = () => Math.max(...readCarts().map(c => c.id)) + 1;

router.post('/', (req, res) => {
    const newCart = { id: generateId(), products: [] };
    const carts = readCarts();
    carts.push(newCart);
    saveCarts(carts);
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const cart = readCarts().find(c => c.id === parseInt(req.params.cid));
    cart ? res.json(cart.products) : res.status(404).json({ error: 'Cart not found' });
});

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = readCarts();
    const cartIndex = carts.findIndex(c => c.id === parseInt(cid));
    if (cartIndex === -1) return res.status(404).json({ error: 'Cart not found' });
    const productIndex = carts[cartIndex].products.findIndex(p => p.product === parseInt(pid));
    productIndex === -1 ? carts[cartIndex].products.push({ product: parseInt(pid), quantity: 1 }) : carts[cartIndex].products[productIndex].quantity += 1;
    saveCarts(carts);
    res.status(201).json(carts[cartIndex]);
});

module.exports = router;

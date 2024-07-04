const express = require('express');
const router = express.Router();

// Importar routers
const productsRouter = require('../routes/products');
const cartsRouter = require('../routes/carts');

// Definir rutas
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);

module.exports = router;

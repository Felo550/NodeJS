const express = require('express');
const productsRouter = require('../routes/products'); // Ruta de productos
const cartsRouter = require('../routes/carts'); // Ruta de carritos

const app = express();
const port = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Añadido para manejar datos de formularios

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;

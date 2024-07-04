const express = require('express');
const app = express();
const port = 8080;

// Middlewares
app.use(express.json());

// Importar routers
const productRouter = require('./api/app');
const cartRouter = require('./api/app');

// Usar routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

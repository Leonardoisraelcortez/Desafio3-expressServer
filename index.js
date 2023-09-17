import Express from "express";
import productManager from "./productmanager.js"

const app = Express();
const port = 8080;

app.use(Express.json());

productManager.initialize();

app.get('/products', (req, res) => {
const { limit } = req.query;
const products = productManager.getProducts(limit);
res.json(products);
});

app.get('/products/:id', (req, res) => {
const { id } = req.params;
const product = productManager.getProductById(+id);
if (product) {
    res.json(product);
} else {
    res.status(404).json({ error: 'Producto no encontrado' });
}
});

app.listen(port, () => {
console.log(`Servidor Express escuchando en el puerto ${port}`);
});



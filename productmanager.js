import fs from "fs";

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.nextId = 1;
    }

    async initialize() {
        try {
            const data = await fs.promises.readFile(this.path, { encoding: "utf-8" });
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                this.nextId = Math.max(...this.products.map((product) => product.id)) + 1;
            }
        } catch (error) {
            console.error("Error al leer el archivo de productos:", error);
        }
    }

    async saveToFile() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            await fs.writeFile(this.path, data);
        } catch (error) {
            console.error("Error al guardar en el archivo de productos:", error);
        }
    }

    addProduct(product) {
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock
        ) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        if (
            this.products.some(
                (existingProduct) => existingProduct.code === product.code
            )
        ) {
            console.error("Ya existe un producto con el mismo código");
            return;
        }

        product.id = this.nextId++;
        this.products.push(product);
        this.saveToFile();
    }

    getProducts(limit) {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            console.error("Producto no encontrado");
            return null;
        }
        return product;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) {
            console.error("Producto no encontrado");
            return;
        }
        updatedProduct.id = id;
        this.products[index] = updatedProduct;
        this.saveToFile();
    }

    deleteProduct(id) {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) {
            console.error("Producto no encontrado");
            return;
        }

        this.products.splice(index, 1);
        this.saveToFile();
    }
}

const productManager = new ProductManager("./productos.json");
export default productManager;
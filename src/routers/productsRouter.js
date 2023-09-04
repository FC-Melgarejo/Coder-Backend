const { Server } = require("socket.io");
const io = require("../server"); 
const { Router } = require('express');

const ProductManagerMongo = require('../dao/ProductManagerMongo');
// En tus rutas donde creas una instancia de ProductManagerMongo
const productManager = new ProductManagerMongo(io);


const productsRouter = new Router();


// Ruta para obtener todos los productos
productsRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || null;
        const query = req.query.query || '';
        const category = req.query.category || '';
        const availability = req.query.availability || '';

        const filter = {};
        if (category) filter.category = category;
        if (availability) filter.availability = availability;
        if (query) {
            filter.$or = [{ category }, { availability }];
        }

        const products = await productManager.getProducts(filter, sort, limit, page);

        const totalProducts = await productManager.countProducts(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = page < totalPages ? page + 1 : null;

        const paginationLinks = (baseURL, params) =>
            Object.keys(params)
                .filter(key => params[key] !== undefined)
                .map(key => `${key}=${params[key]}`)
                .length > 0
                ? `${baseURL}?${Object.keys(params)
                    .filter(key => params[key] !== undefined)
                    .map(key => `${key}=${params[key]}`)
                    .join('&')}`
                : null;

        const response = {
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage: prevPage !== null,
            hasNextPage: nextPage !== null,
            prevLink: paginationLinks('/products', {
                limit,
                page: prevPage,
                sort,
                query,
                category,
                availability,
            }),
            nextLink: paginationLinks('/products', {
                limit,
                page: nextPage,
                sort,
                query,
                category,
                availability,
            }),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});
// Ruta para agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
    try {
        const newProductData = req.body;
        await productManager.addProduct(newProductData);
        res.status(201).json({ status: 'success', message: 'Producto agregado exitosamente' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Ruta para actualizar un producto existente por su ID
productsRouter.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const updatedProductData = req.body;

    try {
        await productManager.updateProduct(pid, updatedProductData);
        res.status(200).json({ status: 'success', message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Ruta para eliminar un producto por su ID
productsRouter.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;

    try {
        await productManager.deleteProduct(pid);
        res.status(200).json({ status: 'success', message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});




module.exports = productsRouter;




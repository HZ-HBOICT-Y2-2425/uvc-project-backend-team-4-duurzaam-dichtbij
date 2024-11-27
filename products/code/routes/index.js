import express from 'express';
import { createProducts, responseProduct, responseProducts, updateProduct, deleteProduct } from '../controllers/ProductController.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('The products microservice is running');
});

router.post('/products', createProducts);
router.get('/products', responseProducts);
router.get('/products/:param', responseProduct);
router.put('/products/:param', updateProduct);
router.delete('/products/:param', deleteProduct);

export default router;
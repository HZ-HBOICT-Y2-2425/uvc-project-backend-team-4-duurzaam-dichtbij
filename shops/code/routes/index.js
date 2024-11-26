import express from 'express';
import { createShop, deleteShop, responseShop, responseShops, updateShop } from '../controllers/shopController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/winkels', checkName, responseShops);
router.post('/winkels', checkName, createShop);
router.get('/winkels/:param', checkName, responseShop);
router.put('/winkels/:id', checkName, updateShop);
router.delete('/winkels/:id', checkName, deleteShop);

export default router;

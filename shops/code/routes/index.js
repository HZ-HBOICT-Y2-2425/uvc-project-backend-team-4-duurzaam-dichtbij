import express from 'express';
import { createShop, deleteShop, responseShop, responseShops, updateShop } from '../controllers/shopController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/shops', checkName, responseShops);
router.post('/shops', checkName, createShop);
router.get('/shops/:param', checkName, responseShop);
router.put('/shops/:id', checkName, updateShop);
router.delete('/shops/:id', checkName, deleteShop);

export default router;

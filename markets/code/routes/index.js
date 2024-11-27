import express from 'express';
import { createMarket, responseMarkets, responseMarket, updateMarket, deleteMarket } from '../controllers/marketController.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('The markets microservice is running');
});

router.post('/markets', createMarket);
router.get('/markets', responseMarkets);
router.get('/market/:param', responseMarket);
router.put('/market/:id', updateMarket);
router.delete('/market/:id', deleteMarket);

export default router;
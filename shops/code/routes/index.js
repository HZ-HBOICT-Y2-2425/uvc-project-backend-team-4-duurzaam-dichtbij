import express from 'express';
import { createShop, deleteShop, responseShop, responseShops, updateShop } from '../controllers/shopController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/shops', checkName, responseShops);
router.post('/shops', checkName, createShop);
router.get('/uploads/:filename', (req, res, next) => {
  const filename = req.params.filename;
  const filepath = path.join(_dirname, '../uploads', filename);

  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.sendFile(filepath);
  });
});
router.get('/shop/:param', checkName, responseShop);
router.put('/shop/:id', checkName, updateShop);
router.delete('/shop/:id', checkName, deleteShop);

export default router;

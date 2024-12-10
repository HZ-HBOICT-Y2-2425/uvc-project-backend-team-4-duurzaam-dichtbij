import express from 'express';
import '../controllers/eventController.js';
import { createEvent, deleteEvent, responseEvent, responseEvents, updateEvent } from '../controllers/eventController.js';
const router = express.Router();

// routes
router.get('/', (req, res, next) => {
  res.json('The events microservice is running');
});

router.post('/events', createEvent);
router.get('/events', responseEvents);
router.get('/event/:param', responseEvent);
router.put('/event/:id', updateEvent);
router.delete('/event/:id', deleteEvent);

export default router;
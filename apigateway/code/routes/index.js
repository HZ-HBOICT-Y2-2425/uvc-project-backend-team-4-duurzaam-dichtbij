import express from 'express';
import recipesRouter from './recipes.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for each microservice
const microserviceProxy = createProxyMiddleware({
  target: 'http://microservice:3011',
  changeOrigin: true
});

router.use('/microservice', microserviceProxy);
router.use('/recipes', recipesRouter);

export default router;
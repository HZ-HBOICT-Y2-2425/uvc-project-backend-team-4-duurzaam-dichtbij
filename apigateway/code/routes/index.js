import express from 'express';
import recipesRouter from './recipe.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for each microservice
const microserviceProxy = createProxyMiddleware({
  target: 'http://microservice:3011',
  changeOrigin: true
});
const productsProxy = createProxyMiddleware({
  target: 'http://products:3013',
  changeOrigin: true
});

router.use('/microservice', microserviceProxy);
router.use('/recipes', recipesRouter);
router.use('/products', productsProxy);
export default router;
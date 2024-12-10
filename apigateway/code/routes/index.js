import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for each microservice
const microserviceProxy = createProxyMiddleware({
  target: 'http://microservice:3011',
  changeOrigin: true,
  on: {
    proxyReq: fixRequestBody,
  },
});
const marketsProxy = createProxyMiddleware({
  target: 'http://markets:3012',
  changeOrigin: true,
  on: {
    proxyReq: fixRequestBody,
  },
});
const productsProxy = createProxyMiddleware({
  target: 'http://products:3013',
  changeOrigin: true,
  on: {
    proxyReq: fixRequestBody,
  },
});
const shopsProxy = createProxyMiddleware({
  target: 'http://shops:3014',
  changeOrigin: true,
  on: {
    proxyReq: fixRequestBody,
  },
});
const recipesProxy = createProxyMiddleware({
  target: 'http://recipes:3015',
  changeOrigin: true,
  on: {
    proxyReq: fixRequestBody,
  },
});
const eventsProxy = createProxyMiddleware({
  target: 'http://events:3016',
  changeOrigin: true,
  on: {
    proxyReq: fixRequestBody,
  },
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/microservice', cors(), microserviceProxy);
router.use('/shops', cors(), shopsProxy);
router.use('/recipes', cors(), recipesProxy);
router.use('/products', cors(), productsProxy);
router.use('/markets', cors(), marketsProxy);
router.use('/events', cors(), eventsProxy);
export default router;
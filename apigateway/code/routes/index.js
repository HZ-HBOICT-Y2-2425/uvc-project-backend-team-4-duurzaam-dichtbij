import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for each microservice
const microserviceProxy = createProxyMiddleware({
  target: 'http://microservice:3011',
  changeOrigin: true
});

const shopsProxy = createProxyMiddleware({
  target: 'http://shops:3012',
  changeOrigin: true
});

router.use('/microservice', microserviceProxy);
router.use('/winkels', shopsProxy);

export default router;

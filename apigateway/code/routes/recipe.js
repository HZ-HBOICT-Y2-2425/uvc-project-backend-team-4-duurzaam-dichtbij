import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const router = express.Router();

router.use(
  '/recipes',
  createProxyMiddleware({
    target: 'http://microservice:3011', 
    changeOrigin: true,
  })
);

export default router;
import express from 'express';
import cors from 'cors';
import recipesRouter from './recipe.js';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// Define allowed origins
const allowedOrigins = ['http://localhost:5173']; // Replace with your frontend's domain

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    console.log(origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],   // Allowed headers
  credentials: true,                                   // Allow cookies and credentials
};

// create a proxy for each microservice
const microserviceProxy = createProxyMiddleware({
  target: 'http://microservice:3011',
  changeOrigin: true
});
const productsProxy = createProxyMiddleware({
  target: 'http://products:3013',
  changeOrigin: true
});
const marketsProxy = createProxyMiddleware({
  target: 'http://markets:3012',
  changeOrigin: true
});

const shopsProxy = createProxyMiddleware({
  target: 'http://shops:3012',
  changeOrigin: true
});

router.use('/microservice', microserviceProxy);
router.use('/shops', shopsProxy);
// Use CORS middleware
router.use(cors(corsOptions));


router.use('/microservice', microserviceProxy);
router.use('/recipes', recipesRouter);
router.use('/products', productsProxy);
router.use('/markets', marketsProxy);
export default router;
// start.js setup from learnnode.com by Wes Bos
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });
import indexRouter from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();
export { app, server };

// Swagger configuratie
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Events Microservice API',
      version: '1.0.0',
      description: 'API-documentatie voor de Events Microservice',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3016}`, // Dynamisch aanpassen aan de poort
      },
    ],
  },
  apis: ['./routes/*.js','../../markets/code/routes/*.js','../../products/code/routes/*.js','../../shops/code/routes/*.js','../../microservice/code/routes/*.js'], // Locatie waar de Swagger comments worden geplaatst
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRouter);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Poort instellen en server starten
app.set('port', process.env.PORT || 3016);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
  console.log(`📄 Swagger Docs → http://localhost:${server.address().port}/api-docs`);
});

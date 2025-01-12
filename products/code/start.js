import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'; // Importeer de cors module
dotenv.config({ path: 'variables.env' });
import indexRouter from './routes/index.js';

const app = express();

// Stel CORS in om aanvragen van een andere origin toe te staan
app.use(cors({
  origin: 'http://localhost:5173',  // Je frontend poort
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // De HTTP-methoden die je toestaat
  allowedHeaders: ['Content-Type', 'Authorization'],  // De headers die je toestaat
}));

// Ondersteuning voor JSON en URL-gecodeerde bodies, voornamelijk gebruikt voor post- en updateverzoeken
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Voeg je route toe
app.use('/', indexRouter);

app.set('port', process.env.PORT || 3011);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
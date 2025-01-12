import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import indexRouter from './routes/index.js';  // Zorg ervoor dat dit je juiste router is

dotenv.config({ path: 'variables.env' });

const app = express();


app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));  
app.use('/', indexRouter);  

app.set('port', process.env.PORT || 3011);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

// Enable CORS middleware for managing Cross-Origin Resource Sharing
app.use(cors());

// Log requests to the console. Necessary for debugging
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.json());

// Setup a generic welcome message for the '/' route
app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to Shopmate'
}));

app.use('/', routes);

// Return an error 404 for non-existent routes
app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

const port = process.env.PORT || 4000;

app.listen(port);

export default app;

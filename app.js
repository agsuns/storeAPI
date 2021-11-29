require('dotenv').config();
const express = require('express');
const app = express();
const dbConnect = require('./db/connect');
const PORT = process.env.PORT || 5003;
require('express-async-errors');
const productsRouter = require('./routes/products');

const notFoundMiddleware = require('./middleware/routeNotFound');
const errorHandlerMiddleware = require('./middleware/errorHandler');

//middleware
app.use(express.json());

//routes

//products routes
app.use('/api/v1/products', productsRouter);

//error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await dbConnect(process.env.MONGO_URI);
    console.log('Server has been connected to db!');
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (e) {
    console.log("Couldn't connect to db");
  }
};

start();

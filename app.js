const connectDB = require('./db/connect');
const handleErrorMiddleware = require('./middlewares/handleErrorMiddleware');

const express = require('express');
const router = require('./routes/routes');
const notFound = require('./middlewares/notFound');

const app = express();
const cors = require('cors');

const port = process.env.PORT||5000;
require('dotenv').config();

//middlewares
app.use(express.json())
app.use(cors()); // Enable CORS for all routes and origins

//routes
app.use('/api/v1/products',router)
app.use(notFound)
app.use(handleErrorMiddleware)

const start = async()=>{
    try{
      connectDB(process.env.MONGO_URI);
      app.listen(port,()=>{
        console.log(`server is running on port ${port}...`)
      })
    }catch(err){
      console.log(err);
    }
}

start();
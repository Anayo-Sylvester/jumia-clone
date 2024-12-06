const connectDB = require('./db/connect');
const handleErrorMiddleware = require('./middlewares/handleErrors');

const express = require('express');

const productsRoutes = require('./routes/products');
const authRoutes = require('./routes/Auth');
const cartRoutes = require('./routes/Cart')
const orderRoutes = require('./routes/Order')
const notFound = require('./middlewares/notFound');
const Authenticator = require('./middlewares/Authenticator')

// security middleware
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const {rateLimit} = require('express-rate-limit');

const port = process.env.PORT||5000;
require('dotenv').config();

//middlewares
app.use(cors()); // Enable CORS for all routes and origins
app.use(helmet());
app.use(rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
)

app.use(express.json())


//routes
app.use('/',(req,res)=>{
  res.send('jumia clone api')
})
app.use('/api/v1/products',productsRoutes);
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/cart',Authenticator,cartRoutes);
app.use('/api/v1/order',Authenticator,orderRoutes);

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
const express = require('express')
const productRouter = require('./api/routers/products')
const ordersRouter = require('./api/routers/orders')
const morgan = require('morgan')
const bodyParser =  require('body-parser')
const mongoose = require('mongoose')
const env = require('dotenv').config()

const app = express();

//connection line to mongodb

mongoose.connect(`mongodb+srv://Sunnat:${process.env.MONGODB_PASSWORD}@cluster0.xcdqp.mongodb.net/?retryWrites=true&w=majority`)

//express USE statements
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With-Methods, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header(
            "Access-Control-Allow-Headers","PUT, PATCH, GET, DELETE")
        return res.status(200).json({});
    }
    next();
    })

//ROUTERS
app.use('/products', productRouter)
app.use('/orders', ordersRouter)

app.use((req, res, next)=>{
        const error = new Error('not found')
        error.status = 404;
        next(error)
})


app.use((error, req, res, next)=>{

    res.status(error.status || 500)
    res.json({
        error :{
        message : error.message
        }
    })
})


module.exports = app
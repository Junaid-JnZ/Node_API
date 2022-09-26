const express = require('express')
const app = express();
const morgan = require('morgan')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/NODE_Api');

const productRoute = require('./api/routes/products')
const categoryRoute = require('./api/routes/categories')
const parentCategoryRoute = require('./api/routes/parentCategories')
const bodyParser = require('body-parser')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))
//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization,Origin');

    if (req.method === 'option') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();

});
//routes handle request
app.use('/products', productRoute)
app.use('/categories', categoryRoute)
app.use('/parentCategories', parentCategoryRoute)
//errors
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error:
            { message: error.message }
    });
});
module.exports = app;
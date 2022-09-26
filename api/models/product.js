const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    category: {type: mongoose.Schema.ObjectId, ref: "Category" , require: true},
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, require: true},
    flag:{type: Boolean},
    productImage:{type: String, required:true},
    
});

module.exports = mongoose.model('Product', productSchema)
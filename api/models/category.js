const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    parentCategory: {type: mongoose.Schema.ObjectId, ref: 'ParentCategory', require: true},
    name: {type: String, required: true},
});

module.exports = mongoose.model('Category', categorySchema)
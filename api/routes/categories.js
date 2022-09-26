const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const mongoose = require('mongoose');
const parentCategory = require('../models/parentCategory')

router.get("/", (req, res, next) => {
    Category.find()
        .select("name _id parentCategory")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                category: docs.map(doc => {
                    return {
                        _id: doc._id,
                        response: {
                            name: doc.name,
                            parentCategory: doc.parentCategory,
                        },
                        request: {
                            type: "GET",
                            url: `http://localhost:3000/categories/${doc._id}`
                        }
                    };
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res) => {

    //     parentCategory.findById(req.body.parentCategoryId)
    //         .then(parentCategory => {
    //             if (!parentCategory) {
    //                 return res.status(404).json({
    //                     message: "parentCategory not found"
    //                 })
    //             }
    const category = new Category({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        parentCategory: req.body.parentCategoryId
    });
    category.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created product successfully",
                createdCategory: {
                    _id: result._id,
                    response: {
                        name: result.name,
                        parentCategory: result.parentCategory,
                    },
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})


router.get("/:categoryId", (req, res, next) => {
    const id = req.params.categoryId;
    Category.findById(id)
        .select('name parentCategory _id ')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    category: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/categories'
                    }
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});
router.patch('/:categoryId', (req, res) => {
    res.status(200).json({
        message: "category updated"
    })
})
router.delete("/:categoryId", (req, res, next) => {
    const id = req.params.categoryId;
    Category.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'category deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/categories',
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
module.exports = router
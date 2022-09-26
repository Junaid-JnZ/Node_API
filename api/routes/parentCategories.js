const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ParentCategory = require("../models/parentCategory");

router.get("/", (req, res, next) => {
    ParentCategory.find()
        .select("name _id")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                parentCategories: docs.map(doc => {
                    return {
                        name: doc.name,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/parentCategories/" + doc._id
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

router.post("/", (req, res) => {
    const parentCategory = new ParentCategory({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
    });
    parentCategory
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created parentCategory successfully",
                createdparentCategory: {
                    name: result.name,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/parentCategories/" + result._id
                    }
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

router.get("/:parentCategoriesId", (req, res, next) => {
    const id = req.params.parentCategoriesId;
    ParentCategory.findById(id)
        .select('name _id ')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    parentCategory: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/parentCategories'
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

router.patch("/:parentCategoriesId", (req, res, next) => {
    const id = req.params.parentCategoriesId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    ParentCategory.updateMany({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'parentCategory updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/parentCategories/' + id
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

router.delete("/:parentCategoriesId", (req, res, next) => {
    const id = req.params.parentCategoriesId;
    ParentCategory.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'parentCategory deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/parentCategories',
                    body: { name: 'String', price: 'Number' }
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

module.exports = router;
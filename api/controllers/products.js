const mongoose = require('mongoose')
const Product = require('../models/products')



exports.product_getAll = (req, res) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs
            }
            res.status(400).json(response)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

}

exports.get_product_byId = (req, res, next) => {
    const id = req.params.product_id
    Product.findById(id)
        .select("name price _id ")
        .exec()
        .then(doc => {
            if (doc) {
                res.status(400).json(doc)
            } else {
                res.status(404).json({
                    message: 'Not fountd anything. i think that the id is invalid'
                })
            }

        }).catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })

}

exports.product_post = (req, res, next) => {
    // console.log("request :", req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        // productImage : req.file.path       
    })
    product.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: "created a new product",
                product: product,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/'
                }
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })
}

exports.Product_delete = (req, res) => {
    const id = req.params.product_id
    Product.findByIdAndDelete(id)
        .exec()
        .then(doc => {
            res.status(200).json({
                message: "this object was deleted",
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http:/localhost:3000/' + id,
                    body: {
                        name: String,
                        price: Number
                    }
                }

            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            })
        })
}

exports.Product_update =  async (req, res)=>{
    const  id =  req.params.product_id
    const {
        name,
        price
    } = req.body
   const updateProduct =  await Product.findByIdAndUpdate(id, {
        name,
        price
    })
    res.status(200).json({
        message : 'the product was updated',
        updateProduct
    })
}
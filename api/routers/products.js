const { Router} = require('express');
const router = Router();
const mongoose = require('mongoose')
const multer =  require('multer');
const path = require('path')


const storage =  multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.dirname('/uploads'))
    },
    filename : function (req, file, cb){
        cb(null, new Date().toISOString() + file.originalname)
    }

});

const fileFilter = (req, file,  cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype ==='image/png'){
        cb(null, true)
    }else {
        cb(null, false)
    }
}

const upload = multer({storage : storage ,  limits : {
    fileSize : 1024 * 1024 * 5
}})

const Product = require('../models/products')

//get all product


router.get('/', (req, res) => {
    Product.find()
    .select("name price _id")
        .exec()
        .then(docs =>{
            const response = {
                count : docs.length,
                products : docs
            }
            res.status(400).json(response)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });

})

// find  and get by id
router.get('/:product_id', (req, res, next) => {
    const id = req.params.product_id

    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("from database :", doc)
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

})

// to create new product 
router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log("request :", req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    })
    product.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: "created a new product",
                product: product,
                request:{
                    type : 'POST',
                    url : 'http://localhost:3000/products/'
                }
            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err  
            })

        })
})

//delete product by id 

router.delete('/:product_id', (req, res)=>{
    const  id =  req.params.product_id
    Product.findByIdAndDelete(id)
    .exec()
    .then(doc =>{
        res.status(200).json({
            message : "this object was deleted",
            product: doc,
            request : {
            type : 'GET',
            url : 'http:/localhost:3000/' + id,
            body  : {name : String, price : Number}
            }

        }).catch(err =>{ res.status(500).json({ error : err})})
    })
})

//update  product by id 
router.patch('/:product_id', async (req, res)=>{
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
})

module.exports = router
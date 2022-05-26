const {  Router} = require('express');
const router = Router();
const mongoose = require('mongoose') 


const Order = require('../models/orders')
const Product = require('../models/products')

//get all orders
router.get('/', (req, res, next) => {
    Order.find()
        .select("productId quantity _id")
        .populate('product', 'name price')
        .exec()
        .then(results => {
            res.status(400).json({
                count: results.length,
                orders: results.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/api/orders/" + doc._id
                        }
                    }
                })
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

//  add new order
router.post('/',  (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "product not found"
                })
            }
            console.log(product)
            const order = new Order({
                 _id: mongoose.Types.ObjectId(),
                 quantity: req.body.quantity,
                 product: req.body.productId

            })
            return order.save()
        })
        .then(result => {
            res.status(201).json({
                message: "created orders",
                order: result,
                request: {
                    type: 'POST',
                    url: "http://localhost:3000/api/orders/" + result._id
                }
            })
        }).catch(err => {
            res.status(500).json({
                error: err
            })

        })
})



//get order by id

router.get('/:orderId', (req, res, next) => {
      Order.findById(req.params.orderId)
      .populate('product', 'name price')
      .exec()
      .then (result =>{ 
          if(!result) {
              return res.status(404).json({
                  message : "order not found"
              })
          }
          res.status(200).json({
              order : result,
              request : { 
                    type: 'POST',
                     url: "http://localhost:3000/api/orders/" + result._id

              }
          })
      }).catch( err =>{
          res.status(500).json({
              error : err
          })
      })
})


// delete by id
router.delete('/:orderId', (req, res, next) => {
   Order.findByIdAndDelete(req.params.orderId)
   .then( result =>
       res.status(200).json({
           message : " Order(s) deleted",
           deleted_order : result,
           request :  {
               type : "DELETE",
               url : "http://localhost:3000/api/orders" + result._id,
               body :{ productId : "ID", quantity : "Number"}

           }

       })
   )
   .catch( err =>{
    res.status(500).json({
        error : err
    })
})
})


module.exports = router
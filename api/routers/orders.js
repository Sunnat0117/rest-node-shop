const {  Router} = require('express');
const router = Router();
const checkAuth = require('../middleware/chesk-auth')

const order_controller = require('../controllers/orders')

//get all orders
router.get('/', checkAuth, order_controller.orders_all_get)

//  add new order
router.post('/', checkAuth, order_controller.order_post)

//get order by id
router.get('/:orderId', order_controller.order_get_byId)

// delete by id
router.delete('/:orderId', checkAuth ,  order_controller.order_delete )


module.exports = router
const { Router} = require('express');
const router = Router();
const multer =  require('multer');

const checkAuth = require('../middleware/chesk-auth')
const Product_controller = require('../controllers/products')


const storage =  multer.diskStorage({
    destination : function(req, file, cb){
        cb(null,  ('./uploads/'))

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
},
fileFilter : fileFilter
})


//get all product
router.get('/', Product_controller.product_getAll)

// find  and get by id
router.get('/:product_id', Product_controller.get_product_byId )

// to create new product 
router.post('/', checkAuth, Product_controller.product_post)

//delete product by id 
router.delete('/:product_id', checkAuth, Product_controller.Product_delete)

//update  product by id 
router.patch('/:product_id', checkAuth, Product_controller.Product_update)

module.exports = router
const { Router} = require('express');
const router = Router();

const User_controller = require('../controllers/user')
const checkAuth = require('../middleware/chesk-auth')


//get all users
router.get('/', User_controller.user_getAll)

// singup method
router.post('/signup', User_controller.user_signup)

//login by token
router.post('/login', User_controller.user_login)

//delete user by id
router.delete('/:userId', checkAuth, User_controller.user_delete )



module.exports = router
const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middlewares/authMiddleware')
const roleMiddleware = require('./middlewares/roleMiddleware')

router.post('/reg',[
  check('username', 'User can`t be empty').notEmpty(),
  check('password', 'Password must be greater than 5 and less than 10 characters').isLength({min: 5, max: 10}),
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)

module.exports = router
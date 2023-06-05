const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('./config')

const generateToken = (id, roles) => {
  const payload = {
    id, roles
  }
  return jwt.sign(payload, secret, {expiresIn: '24h'})
}
class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({message: 'Registration error', errors})
      }
      const {username, password} = req.body
      const candidate = await User.findOne({username})
      if (candidate) {
        return res.status(400).json({message: 'Такой пользователь уже существует'})
      }
      const hashPass = bcrypt.hashSync(password, 7)
      const userRole = await Role.findOne({value: "USER"})
      const user = new User({username, password: hashPass, roles: [userRole.value]})
      await user.save()
      return res.json({message: 'User was created'})

    }
    catch (e) {
      console.log(e)
      res.status(400).json({message: 'reg error'})
    }
  }
  async login(req, res) {
    try {
      const {username, password} = req.body
      const user = await User.findOne({username})
      if (!user) {
        return res.status(400).json({message: `User ${username} not find`})
      }
      const validPass = bcrypt.compareSync(password, user.password)
      if (!validPass) {
        return res.status(400).json({message: `Password error`})
      }
      const token = generateToken(user._id, user.roles)

      return res.json({token})
    }
    catch (e) {
      console.log(e)
      res.status(400).json({message: 'login error'})
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find()
      res.json(users)
    }
    catch (e) {

    }
  }
}

module.exports = new AuthController()
const express = require('express')
const bcrypt = require('bcryptjs')
const Users = require('./usersModel')
const jwt = require('jsonwebtoken')
const {restrict} = require('./usersMiddleware.js')

const router = express.Router()

router.get('/users', restrict(), async (req, res, next) => {
    try {
        console.log(req.cookies)
        res.json(await Users.find())
    } catch (err) {
        next(err)
    }
})

router.post('/register', async(req, res, next) => {
    try {
        const {username, password, department} = req.body
        const user = await Users.findBy({username}).first()
        if (user) {
            return res.status(409).json({message: "Username Taken"})
        }
        const newUser = await Users.add({username, password: await bcrypt.hash(password, 10), department})
        res.status(201).json(newUser)
    } catch(err) {
        next(err)
    }
})

router.post('/login', async(req, res, next) => {
    try {
        const {username, password} = req.body
        const user = await Users.findBy({username}).first()
        if (!user) {
            return res.status(401).json({message: "Invalid Credentials"})
        }
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!passwordValid){
            return res.status(401).json({
				message: "Invalid Credentials",
			})
        }
        const token = jwt.sign({userID: user.id, department: user.department}, process.env.JWT_SECRET)
        res.cookie('token', token)

		res.json({message: `Welcome ${user.username}!`, token})
    } catch(err) {
        next(err)
    }
})

module.exports = router
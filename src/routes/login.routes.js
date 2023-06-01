const { Router } = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const { login } = require('./../utils/index')
require('dotenv').config()

function generateAccessToken(message) {
    return jwt.sign(message, process.env.JWT_SECRET)
}

router.post("/login", async (req, res) => {
    try {
        if(req.body?.did && req.body?.signature) {
            if(req.session?.message) {
                console.log(req.body.did)
                console.log(req.body.signature)
                console.log(req.session.message)
                var auth = await login(req.body.did, req.session.message, req.body.signature)
                if(!auth) {
                    res.status(200).json({
                        token: generateAccessToken(req.session.message)
                    })
                } else {
                    res.sendStatus(401)
                }
            } else {
                res.sendStatus(409)
            }
        } else {
            res.sendStatus(400)
        }
    } catch(error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router
const { Router } = require('express')
const router = Router()
const {generateString} = require('../utils')



router.get("/auth", async(req, res) => {
    try {
        var message = await generateString(32)

        req.session.message = message
        res.status(200).json({
            message: message
        })
    } catch(error) {
        res.status(500).json(error)
    }
})

module.exports = router
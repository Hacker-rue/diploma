const { Router } = require('express')
const router = Router()
const { getDid } = require('./../utils/index')

router.post("/getDID", async (req, res) => {
    try {
        if(req.body?.publicKey) {
            var did = await getDid(req.body.publicKey)
            res.status(200).json({
                did: did
            })
        } else {
            res.status(400)
        }
    } catch(error) {
        console.log(error)
        res.status(500).json(error)
    }
})

module.exports = router
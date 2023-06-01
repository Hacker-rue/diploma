const { Router } = require('express')
const router = Router()
const { createNewDidDocumentJson } = require('everscale-did-sdk-radiance')
const { DidStorageContract } = require('everscale-did-sdk-radiance/src/contract-package/DidStorageContract')



router.post("/registrationDID", (req, res) => {
    try {
        if(req.body?.publicKey) {
            var didDocument = createNewDidDocumentJson({
                publicKey: req.body.publicKey
            })

            
            res.status(200).json({
                recipient: "0:ccf14291c229a5a9ade448c3376ff3225dc7ab59d6c516504b19a891bfe47b5a",
                amount: "500000000",
                bounce: true,
                payload: {
                    abi: JSON.stringify(DidStorageContract.abi),
                    method: "addDid",
                    params: {
                        pubKey: "0x" + req.body.publicKey,
                        didDocument: JSON.stringify(didDocument)
                    }
                }
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
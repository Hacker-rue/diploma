const { randomBytes } = require('crypto')
const SDK = require('everscale-did-sdk-radiance')
const { TonClient } = require('@eversdk/core')

module.exports = {
    generateString: async (size) => {
        return randomBytes(size).toString('hex')
    },
    
    login: (did, value, signature) => {
        return new Promise(async (resolve, reject) => {
            try {
                let document = await SDK.resolveDIDDocument({did: did});
                let check = 
                await verifyMessage(value, signature, document.didDocument.verificationMethod.publicKeyMultibase);
                resolve(check);
            } catch (error) {
                reject(error);
            }
        })
    },

    getDid: async (publicKey) => {
        try {
            var did = SDK.getDidFromMethod({
                pubKey: publicKey
            })
    
            var didDocument = await SDK.resolveDIDDocument({
                did: did
            })
    
            if(didDocument == null) {
                return
            }
            return didDocument.didDocument.id
        } catch(error) {
            throw error
        }
        
    }
}
    
async function verifyMessage(value, signature, pubKey) {
    try {
        return (await TonClient.default.crypto.nacl_sign_detached_verify({
            public: pubKey,
            signature: signature,
            unsigned: (await TonClient.default.crypto.sha256({data: value})).hash
        })).succeeded
    } catch (error) {
        return error;
    }
}
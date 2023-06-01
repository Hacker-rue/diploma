import {
    ProviderRpcClient
} from 'https://cdn.jsdelivr.net/npm/everscale-inpage-provider@0.3.61/+esm'
import { connect, sendMessage, signData, disconnect } from "http://127.0.0.1:3000/src/everRpcProvider.js"
import { checkDID, getDIDDocument } from "http://127.0.0.1:3000/src/didClient.js"

const ever = new ProviderRpcClient()

document.getElementById("Connect").onclick=async () => {
    try {
        var accountInteraction = await connect()
        var did = await checkDID(accountInteraction.publicKey)
        if(!(did.status == 200)) {
            console.log(did.status)
        }
        if(did.did == null) {
            var didPayload = await getDIDDocument(accountInteraction.publicKey)
            await sendMessage(didPayload)
        }
        console.log(did)

        setTimeout(async () => {
            var did = await checkDID(accountInteraction.publicKey)
            if(!(did.status == 200)) {
                console.log(did.status)
            }
            var res = await fetch("http://127.0.0.1:3000/auth")
            if(!res.ok) {
                return
            }
            var { message } = await res.json()
            console.log(message)
            var signature = await signData(accountInteraction.publicKey, message)
            console.log(signature)
            console.log(message)
            res = await fetch("http://127.0.0.1:3000/login", {
                method: "POST",
                body: JSON.stringify({
                    did: did.did,
                    signature: signature
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(res.ok) {
                const { token } = await res.json()
                document.cookie = `token=${token}`
                console.log(document.cookie)
                document.location.href = "http://127.0.0.1:3000/main"
            } else {
                console.log(res.status)
            }
        }, 5000)
        
    } catch(error) {
        console.log(error)
    }
}
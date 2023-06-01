import { ProviderRpcClient } from "https://cdn.jsdelivr.net/npm/everscale-inpage-provider@0.3.61/+esm"
// import { ProviderRpcClient } from "everscale-inpage-provider"
const ever = new ProviderRpcClient()

export async function connect() {
    if(!(await ever.hasProvider())) {
        throw Error("Extension is not installed")
    }
    var ProviderState = await ever.getProviderState()
    if(!(ProviderState.networkId == 42)) {
        throw Error("Incorrect network type")
    }

    const { accountInteraction } = await ever.requestPermissions({
        permissions: ["basic", "accountInteraction"]
    })

    if(accountInteraction == null) {
        throw Error("Insufficient permissions")
    }

    return accountInteraction
}

export async function sendMessage(message) {
    var ProviderState = await ever.getProviderState()
    const { transaction } = await ever.sendMessage({
        sender: ProviderState.permissions.accountInteraction.address,
        recipient: message.recipient,
        amount: message.amount,
        bounce: message.bounce,
        payload: message.payload
    })
    
    console.log(transaction)
}

export async function signData(publicKey, data) {
    var signature = await ever.signData({
        publicKey: publicKey,
        data: data
    })
    return signature.signatureHex
}

export async function disconnect() {
    await ever.disconnect()
}

export async function checkDID(publicKey) {
    try {
        var result = await fetch("http://127.0.0.1:3000/getDID", {
            method: "POST",
            body: JSON.stringify({
                publicKey: publicKey
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(result.ok) {
            var did = (await result.json()).did
            return {
                did: did,
                status: result.status
            }
        }
    } catch(error) {
        throw error
    }
}

export async function getDIDDocument(publicKey) {
    var res = await fetch("http://127.0.0.1:3000/registrationDID", {
        method: "POST",
        body: JSON.stringify({
            publicKey: publicKey
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if(res.ok) {
        var message = await res.json()
        return message
    } else {
        throw Error(`${res.status}`)
    }
}
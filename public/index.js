import {
    ProviderRpcClient
} from 'https://cdn.jsdelivr.net/npm/everscale-inpage-provider@0.3.61/+esm'
import { sendMessage, disconnect } from "http://127.0.0.1:3000/src/everRpcProvider.js"
import { checkDID, getDIDDocument } from "http://127.0.0.1:3000/src/didClient.js"

const ever = new ProviderRpcClient()

document.getElementById("exit").onclick=async () => {
    document.cookie = "token=;max-age=-1"
    disconnect()
    document.location.href = "http://127.0.0.1:3000"
}
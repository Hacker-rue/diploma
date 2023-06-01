const express = require('express')
const session = require('express-session')
const redisStorage = require('connect-redis')(session)
const redis = require('redis')
const clientSession = redis.createClient({legacyMode: true})
require('dotenv').config()
const { libNode } = require('@eversdk/lib-node')
const { initSettings } = require('everscale-did-sdk-radiance')
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log(authHeader)
    const token = authHeader
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.JWT_SECRET, (err, message) => {
        console.log(err)
        console.log(message)
        console.log(req.session.message)
        if (err) return res.sendStatus(403)
        if(req.session.message != message) {
            res.sendStatus(403)
        }
        next()
    })
}

const app = express()
app.use(express.json({extended: true}))
app.use(
    session({
        store: new redisStorage({
            url: "127.0.0.0:6379",
            client: clientSession,
            ttl: process.env.SESSION_LIFETIME * 1000 * 60
        }),
        secret: 'diploma',
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: process.env.SESSION_LIFETIME * 1000 * 60
        }
    })
)


app.use(require('./src/routes/auth.routes'))
app.use(require('./src/routes/login.routes'))
app.use(require('./src/routes/getDID.routes'))
app.use(require('./src/routes/regDID.routes'))
app.use(express.static(__dirname + "/public"))
app.post("/", authenticateToken, (req, res) => {
    console.log("test")
    res.sendStatus(200)
})
app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/public/html/content.html")
})
app.get("/main", async (req, res) => {
    res.sendFile(__dirname + "/public/html/index.html")
})

app.listen(process.env.PORT, `${process.env.HOST}`, async (req, res) => {
    await clientSession.connect()
    initSettings({
        network: "devNet",
        lib: libNode
    })
    console.log(`Server started: http://${process.env.HOST}:${process.env.PORT}`)
})
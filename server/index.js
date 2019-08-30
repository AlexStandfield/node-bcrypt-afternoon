require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const cors = require('cors')

const PORT = 4000

// controllers
const authCtrl = require('../controllers/authController')
const trsureCtrl = require('../controllers/treasureController')

// Middleware
const auth = require('./middleware/authMiddleware')

// env Variables
const {
    CONNECTION_STRING,
    SESSION_SECRET
} = process.env

// App Instance
const app = express()

// Connect Database
massive(CONNECTION_STRING)
    .then(db => {
        app.set('db', db)
        console.log('Database Connected 🤯')
    })
    .catch(error => {
        console.log(error)
    })

// TLM
app.use(express.json())
app.use(cors())
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', trsureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly , trsureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, trsureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, trsureCtrl.getAllTreasure)

app.listen(PORT, () => console.log('Server is Running 🤗'))
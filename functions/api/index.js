const { functions } = require('../util/firebase')
const auth = require('../util/auth')
const app = require('express')()
const cors = require('cors')({ origin: true })
require('dotenv').config()

app.use(cors)

const { getAvailability } = require('./availability')

app.get('/availability', auth, getAvailability)

exports.api = functions.https.onRequest(app)

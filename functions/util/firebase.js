const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: `https://workspace-247959.firebaseio.com`
})

const db = admin.firestore()
db.settings({ ignoreUndefinedProperties: true })

module.exports = { admin, db, functions }

const { functions } = require('../util/firebase')

exports.dev = functions.https.onRequest((req, res) => {
  const firebase = require('firebase')

  const firebaseConfig = {
    apiKey: 'AIzaSyDKCFtrFDH6jXLiWqj8kVZnZysM9l1LyB4',
    authDomain: 'workspace-247959.firebaseapp.com',
    projectId: 'workspace-247959',
    storageBucket: 'workspace-247959.appspot.com',
    messagingSenderId: '132078026079',
    appId: '1:132078026079:web:0e518653f2b312f1d64aea',
    measurementId: 'G-GX2226CW29'
  }

  firebase.initializeApp(firebaseConfig)

  firebase.auth().useEmulator('http://localhost:9099/')

  firebase
    .auth()
    .signInAnonymously()
    .then(data => data.user.getIdToken())
    .then(token => res.json({ token }))
    .catch(err => console.log(err.message))
})

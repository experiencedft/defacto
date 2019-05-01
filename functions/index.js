const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//When a new item is pushed to queue, add the timestamp
exports.addTimestampUrl = functions.database.ref('/queue/{pushId}')
    .onCreate( (snapshot, context) => {
        const id = context.params.pushId;
        let newVal = snapshot.val();
        newVal.timestamp = admin.database.ServerValue.TIMESTAMP;
        return snapshot.ref.set(newVal);
    });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();



//When a user signs up, add the UID to the database
exports.addAccount = functions.auth.user().onCreate((user) => {
    const id = user.uid;
    const email = user.email;
    console.log(id);
    return admin.database().ref("/users/"+id).set({"email": email, "uid": id}); 
});

//When a new item is pushed to queue, add the timestamp
//Also distribute it to a subset of users that are notified
exports.addTimestampUrl = functions.database.ref('/queue/{pushId}')
    .onCreate( (snapshot, context) => {
        const id = context.params.pushId;
        let newVal = snapshot.val();
        newVal.timestamp = admin.database.ServerValue.TIMESTAMP;
        return snapshot.ref.set(newVal);
    });

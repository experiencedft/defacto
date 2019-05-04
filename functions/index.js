const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const helper = require('./utils');

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
    .onCreate( (snapshot) => {
        timestamp = admin.database.ServerValue.TIMESTAMP;
        return snapshot.ref.update({"timestamp": timestamp});
    });

exports.pushToUserQueue = functions.database.ref('/queue/{pushId}')
    .onCreate( (snapshot) => {
        let val = snapshot.val();
        let url = val.url;
        // Get object containing all users profiles
        let usersObject = admin.database().ref("/users/");
        usersObject.once("value", function(usersdb) {
            let users = usersdb.val();
            let keys = Object.keys(users);
            //Order users list randomly and store in selected user array
            keys = helper.shuffleArray(keys);
            return admin.database().ref("/users/"+keys[0]+"/userQueue").push(url);
        });
        return Promise.resolve("Empty Promise");
    });

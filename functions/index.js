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
    .onCreate( (snapshot, context) => {
        let val = snapshot.val();
        let url = val.url;
        let queueID = context.params.pushId;
        // Get object containing all users profiles
        let usersObject = admin.database().ref("/users/");
        //Read only once to avoid perpetual callback call
        usersObject.once("value", function(usersdb) {
            //Turn the db tree into a JS object
            let users = usersdb.val();
            //Get the array of keys of the users object
            let keys = Object.keys(users);
            //Order users list randomly and store in selected user array
            keys = helper.shuffleArray(keys);
            return admin.database().ref("/users/"+keys[0]+"/userQueue").push({"url": url, "queueID": queueID});
        });
        return Promise.resolve("Empty Promise");
    });

exports.scheduledFunction = functions.pubsub.schedule("every 6 hours").onRun((context) => {
    console.log("This is executed first");
    currentTime = Date.now();
    console.log("Current time is "+currentTime);
    let dbRead = admin.database().ref("/queue/");
    //Read queue
    dbRead.once('value', function (dbSnapshot) {
        console.log("Reading queue...");
        let queue = dbSnapshot.val();
        Object.keys(queue).forEach((id) => {
            console.log("Reading queue element "+id);
            //If an item in queue is older than 48 hours (in ms)
            if (queue[id].timestamp < currentTime - 172800000) {
                console.log(id + " element is too old");
                let usersDb = admin.database().ref("/users/");
                //Read users list
                usersDb.once('value', function(usersSnapshot) {
                    console.log("Reading user list");
                    let users = usersSnapshot.val();
                    //For each user, check every element in its queue
                    Object.keys(users).forEach((uid)=> {
                        console.log("Reading user " + uid);
                        let userQueue = users[uid].userQueue;
                        Object.keys(userQueue).forEach((userQueueID) => {
                            if (userQueue[userQueueID].queueID == id) {
                                console.log("Delete the element that is too old from user queue");
                                admin.database().ref("/users/"+uid+"/userQueue/"+userQueueID).remove().then(() => {console.log("Remove success")});
                                admin.database().ref("/queue/"+id).remove().then(() => {console.log("Remove success")});
                                //Add URL to a list of assessed URLs
                            }
                        });
                    });
                    return Promise.resolve("Empty Promise");
                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                  });
            }
        });
        return Promise.resolve("Empty Promise");
    });
    console.log("This is executed second");
    return Promise.resolve("Empty Promise");
});
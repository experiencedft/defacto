var config = {
    apiKey: "AIzaSyBiWzrlcwxigAnXrapXNX2pIp3yj5WFTG4",
    authDomain: "defacto-654d7.firebaseapp.com",
    databaseURL: "https://defacto-654d7.firebaseio.com",
    projectId: "defacto-654d7",
    storageBucket: "defacto-654d7.appspot.com",
    messagingSenderId: "633832248132"
  };

firebase.initializeApp(config);
var database = firebase.database();

let userID = "";

//Helper function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//Global listener for all popup messages
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
  
      if (message.type == "loginAttempt") {

        //If the user logs in using the login button
        /* console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension"); */
        firebase.auth().signInWithEmailAndPassword(message.email, message.password).catch(function(error) {
            //TODO: add error message if wrong email/password
        });
  
      } else if (message.type == "signUpAttempt") {

        firebase.auth().createUserWithEmailAndPassword(message.email, message.password).catch(function(error) {
            //TODO: add error if there is a sign-up issue (email already used for example...)
        });

      } else if (message.type == "popupLoad"){

        //Get current authentication state and tell popup
        //plus send some additional info
        let user = firebase.auth().currentUser;
        if (user) {
          userID = user.uid;
          //Get current URL (async function)
          chrome.tabs.query({
            active: true,
            currentWindow: true
          }, function(tabs) {
            var tab = tabs[0];
            var url = tab.url;
             //Read assessments and look for all assessments with the corresponding URL
            //TODO: Find a way to replace with a read of the metadata to have to load less data
            let assessment  = {};
            let isAssessment = 0;
            console.log("IM HERE FIRST");
            database.ref("/assessment/").once("value").then(function(snapshot) {
              console.log("IM HERE THIRD");
              let assessmentsList = snapshot.val();
              let temp = [];
              Object.keys(assessmentsList).forEach((id) => {
                if (assessmentsList[id].url == url) {
                  temp.push(assessmentsList[id]);
                  isAssessment++;
                };
                assessment = shuffleArray(temp)[0];
              });
              if (isAssessment == 0) {
                sendResponse({type: "loggedIn", isAssessed: "no"});
              } else {
                sendResponse({type: "loggedIn", isAssessed: "yes", "content": assessment});
              }
            });
          });
          //If the sendResponse is inside an async function, need to return true
          return true;
        } else {
          sendResponse({type: "loggedOut"});
        };

      } else if (message.type == "assessmentSubmission") {

        let assessment = message.assessment;
        //Push assessment to the assessment reference in the db and get the key
        let newKey = database.ref("assessment").push(assessment).key;
        //Add the corresponding metadata
        //TODO: Set the metadata in a cloud function (users shouldn't tamper with it)
        //DON'T FORGET TO CHANGE THE RULES: remove write authorization to the metadata subtree
        database.ref("metadata").push({
          author: userID, 
          vote: 0, 
          url: message.url, 
          queueID: message.queueID,
          key: newKey, 
          status: "pending"
        }); 

      } else if (message.type == "urlSubmission") {

        let submission = message.package;
        database.ref("queue").push({url: submission});

      } else if (message.type == "dropdown") {
        console.log("Dropdwon message received");
        let user = firebase.auth().currentUser;
        if (user) {
          uid = user.uid;
          sendResponse({"uid": uid});
        }
      };

});
  
  

  //Tells the popup script when the auth state changes
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      userID = user.uid;
      chrome.runtime.sendMessage({loginStatus: "loggedIn", type: "authChange"});
    } else {
      chrome.runtime.sendMessage({loginStatus: "loggedOut", type: "authChange"});
    }
  });

  //TODO: Add profile deletion event listener
  //See https://firebase.google.com/docs/functions/auth-events

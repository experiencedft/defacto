var config = {
    apiKey: "AIzaSyBiWzrlcwxigAnXrapXNX2pIp3yj5WFTG4",
    authDomain: "defacto-654d7.firebaseapp.com",
    databaseURL: "https://defacto-654d7.firebaseio.com",
    projectId: "defacto-654d7",
    storageBucket: "defacto-654d7.appspot.com",
    messagingSenderId: "633832248132"
  };
  firebase.initializeApp(config);

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
        let user = firebase.auth().currentUser;
        if (user) {
          sendResponse({type: "loggedIn"});
        } else {
          sendResponse({type: "loggedOut"});
        };

      };
  
    });
  
  

  //Tells the popup script when the auth state changes
  //TODO: Investigate what happens if a profile is deleted from the console
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      chrome.runtime.sendMessage({loginStatus: "loggedIn", type: "authChange"});
    } else {
      chrome.runtime.sendMessage({loginStatus: "loggedOut", type: "authChange"});
    }
  });

//Helper functions to build the HTML 

function makeSignInMenu() {
  let HTMLstring = "<button id='sign-up'>Sign-up</button>\
  <button id='log-in'>Log-in</button>";
  return HTMLstring;
};

function makeLogInForm() {
  let HTMLstring = "\
    <div> \
      <label>Email</label>\
      <input id='input-email' autocomplete='off'>\
    </div> \
    <div>\
      <label>Password</label>\
      <input type='password' id='input-password' autocomplete='off'>\
    </div> \
    <button id='log-in'>Sign-in</button>"
  return HTMLstring;
};

function makeSignUpForm() {
  let HTMLstring = "\
    <div> \
      <label>Email</label>\
      <input id='input-email' autocomplete='off'>\
    </div> \
    <div>\
      <label>Password</label>\
      <input type='password' id='input-password' autocomplete='off'>\
    </div> \
    <div>\
    <label>Confirm password</label>\
    <input type='password' id='input-confirm-password' autocomplete='off'>\
    </div> \
    <button id='sign-up'>Sign-up</button>"
  return HTMLstring;
};

function makeDeFactoMenu() {
  let HTMLstring = "<button type='button' name='submission' id='submission'>Submit current tab</button>\
  <button type='button' name='review' id='review'>Start reviewing</button>";
  return HTMLstring;
};


//To do when the user clicks on the exntension icon 
window.addEventListener('DOMContentLoaded', (_event) => {
  console.log("DOM loaded and parsed");
  //Send a message to background script informing that the page is loaded
  chrome.runtime.sendMessage({type: "popupLoad"}, function (response) {
    //Background script tells us whether the user is logged in
    if (response.type == "loggedIn") {

      //Create HTML of DeFacto UI
      let container = document.querySelector("#container");
      container.innerHTML = makeDeFactoMenu();
      //Add event listeners
      let submission = document.getElementById('submission');
      let review = document.getElementById('review');
      submission.onclick = function() {
        //Get all tabs with specified property (active tab of the active window)
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
          var activeTab = tabs[0].url
          chrome.runtime.sendMessage({type: "urlSubmission", package: activeTab});
        });
      //  chrome.storage.sync.get(['queue'], function(result) {
      //    console.log(result.queue);
      //  });
      };
      review.onclick = function() {
        chrome.tabs.create({url: "reviewTab.html"});
      };

    } else if (response.type == "loggedOut") {

      let container = document.querySelector("#container");
      container.innerHTML = makeSignInMenu();
      //Add on click event listener to log-in button
      let logInButton = document.querySelector("#log-in");
      logInButton.onclick = function () { 
        container.innerHTML = makeLogInForm();
        //Add event listener to log-in form button
        let logIn = document.querySelector("#log-in");
        logIn.onclick = function () {
          let credentials = {};
          credentials.email = document.querySelector("#input-email").value;
          credentials.password = document.querySelector("#input-password").value;
          credentials.type = "loginAttempt";
          container.innerHTML = "loading...";
          //Send crendentials to background script;
          chrome.runtime.sendMessage(credentials)

        };
      };
      //Add on click even listener to the sign-up button
      let signUpButton = document.querySelector("#sign-up");
      signUpButton.onclick = function () {
        container.innerHTML = makeSignUpForm();  
        //Add event listener to  sign-up form button
        let signUp = document.querySelector("#sign-up");
        signUp.onclick = function () {
          if (document.querySelector("#input-password").value == document.querySelector("#input-confirm-password").value) {
            let credentials = {};
            credentials.email = document.querySelector("#input-email").value;
            credentials.password = document.querySelector("#input-password").value;
            credentials.type = "signUpAttempt";
            container.innerHTML = "loading...";
            //Send crendentials to background script;
            chrome.runtime.sendMessage(credentials)
          } else {
            //TO DO: Tell user that the passwords don't match
          }
        };
      };
    };
  });
});

//Listen to messages from the background script
chrome.runtime.onMessage.addListener( function(message, _sender, _sendResponse) {
  //If the message signals an auth state change
  if (message.type == "authChange") {

    if (message.loginStatus == "loggedIn") {

      //Create HTML of DeFacto UI
      let container = document.querySelector("#container");
      container.innerHTML = makeDeFactoMenu();
      //Add event listeners
      let submission = document.getElementById('submission');
      let review = document.getElementById('review');
      submission.onclick = function() {
        console.log("clicked!");
        //Get all tabs with specified property (active tab of the active window)
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
          var activeTab = tabs[0].url
          chrome.runtime.sendMessage({type: "urlSubmission", package: activeTab});
        });
      //  chrome.storage.sync.get(['queue'], function(result) {
      //    console.log(result.queue);
      //  });
      };
      review.onclick = function() {
        chrome.tabs.create({url: "reviewTab.html"});
      };

    } else if (message.loginStatus == "loggedOut") {

      //If user logs out, re-build the sign-in page
      let container = document.querySelector("#container");
      container.innerHTML = makeSignInMenu();
      //Add on click event listener to log-in button
      let logInButton = document.querySelector("#log-in");
      logInButton.onclick = function () { 
        container.innerHTML = makeLogInForm();
        //Add event listener to 
        let logIn = document.querySelector("#log-in");
        logIn.onclick = function () {
          let credentials = {};
          credentials.email = document.querySelector("#input-email").value;
          credentials.password = document.querySelector("#input-password").value;
          credentials.type = "loginAttempt";
          container.innerHTML = "loading...";
          //Send crendentials to background script;
          chrome.runtime.sendMessage(credentials)

        };
      }
    };

  } else if (message.type == "dummy") {

  };
});


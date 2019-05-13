//Helper functions to build the HTML content of the popup

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

function makeAssessmentTemplate() {
  let HTLMLstring = "<p><span id='false-claims'></span> false claims</p>\
  <p><span id='misleading-claims'></span> misleading claims</p>\
  <p><span id='fallacious-claims'></span> fallacious claims</p>\
  <a id='assessment-details' href='#'>See details<a>";
  return HTLMLstring;
};

//To do when the user clicks on the extension icon 
window.addEventListener('DOMContentLoaded', (_event) => {
  console.log("DOM loaded and parsed");
  //Send a message to background script informing that the page is loaded
  chrome.runtime.sendMessage({type: "popupLoad"}, function (response) {
    //Background script tells us whether the user is logged in
    if (response.type == "loggedIn") {
      //Display random assessment of the page if it exists 
      //Say no assessment exists otherwise
      if (response.isAssessed == "yes") {
        const assessment = response.content;
        //Set assessemnt in local storage if the user asks for details
        chrome.storage.sync.set({currentAssessment: assessment}, function() {
          console.log('Assessment is set in local storage to:');
          console.log(assessment);
        });
        //Display number of false, misleading and fallacious claims 
        const assessmentContainer = document.querySelector("#assessment-container");
        assessmentContainer.innerHTML = makeAssessmentTemplate();
        const falseClaimsNumber = Object.keys(assessment.falseClaims).length;
        const misleadingClaimsNumber = Object.keys(assessment.misleadingClaims).length;
        const fallaciousClaimsNumber = Object.keys(assessment.fallaciousClaims).length;
        let falseClaimsElem = document.querySelector("#false-claims");
        falseClaimsElem.innerHTML = falseClaimsNumber.toString();
        let misleadingClaimsElem = document.querySelector("#misleading-claims");
        misleadingClaimsElem.innerHTML = misleadingClaimsNumber.toString();
        let fallaciousClaimsElem = document.querySelector("#fallacious-claims");
        fallaciousClaimsElem.innerHTML = fallaciousClaimsNumber.toString();
        //Add event listener to details link
        const detailsElem = document.querySelector("#assessment-details");
        detailsElem.onclick = function() {
          chrome.tabs.create({url: "assessmentDetails.html"});
        };
      } else if (response.isAssessed == "no") {
        const assessmentContainer = document.querySelector("#assessment-container");
        assessmentContainer.innerHTML = "<p>Not assessed yet</p>";
      }
      //Create submissions and review buttons
      //TODO: Don't make a submission button if an assessment is displayed 
      //OR if queue is non empty
      let container = document.querySelector("#buttons-container");
      container.innerHTML = makeDeFactoMenu();
      //Add event listeners
      let submission = document.getElementById('submission');
      let review = document.getElementById('review');
      //Add to database when submit button clicked
      submission.onclick = function() {
        //Get all tabs with specified property (active tab of the active window)
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
          var activeTab = tabs[0].url
          chrome.runtime.sendMessage({type: "urlSubmission", package: activeTab});
        });
      };
      //Open review panel in new tab when review button clicked
      review.onclick = function() {
        chrome.tabs.create({url: "reviewTab.html"});
      };

    } else if (response.type == "loggedOut") {

      let container = document.querySelector("#buttons-container");
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
            errorBox = document.querySelector("#error-container");
            errorBox.innerHTML('<p style="color: red;">Passwords don\'t match</p>');
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
      //Display random assessment of the page if it exists

      //Say no assessment exists otherwise

      //Create submissions and review buttons
      //TODO: Don't make a submission button if an assessment is displayed
      let container = document.querySelector("#buttons-container");
      container.innerHTML = makeDeFactoMenu();
      //Add event listeners
      let submission = document.getElementById('submission');
      let review = document.getElementById('review');
      //Add to database when submit button clicked
      submission.onclick = function() {
        console.log("clicked!");
        //Get all tabs with specified property (active tab of the active window)
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
          var activeTab = tabs[0].url
          chrome.runtime.sendMessage({type: "urlSubmission", package: activeTab});
        });

      };
      //Open review panel in new tab when review button clicked
      review.onclick = function() {
        chrome.tabs.create({url: "reviewTab.html"});
      };

    } else if (message.loginStatus == "loggedOut") {

      //If user logs out, re-build the sign-in page
      let container = document.querySelector("#buttons-container");
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


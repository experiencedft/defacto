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

//Helper function
function copyStringToClipboard (str) {
  // Create new element
  var el = document.createElement('textarea');
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '');
  el.style = {position: 'absolute', left: '-9999px'};
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand('copy');
  // Remove temporary element
  document.body.removeChild(el);
}

/*Dropdown to select URL to review from possible URLs.
Currently: retrieves the queue from sync storgae
Eventually: only shows the URL from the back end db reviewer has been
selected to assess*/

const section = document.createElement("section");
section.setAttribute('id','url')
//Add element right after <h1> in the form
document.querySelector('h1').parentNode.insertBefore(section, document.querySelector('h1').nextSibling);
const l = document.createElement("label");
l.setAttribute("for","selectURL");
l.innerHTML = "Select URL to review "
document.querySelector("#url").appendChild(l);
const dropdown = document.createElement("select");
dropdown.setAttribute("id","selectURL");
dropdown.setAttribute("name","selectURL");
dropdown.required = true; //boolean attribute = reflected property

chrome.runtime.sendMessage({type: "dropdown"}, function (response) {
  const uid = response.uid;
  console.log("current uid = "+uid);
  let dbRead = database.ref("/users/"+uid+"/userQueue");
  dbRead.once('value').then((dbObject) => {
    console.log("Reading database entry");
    if (dbObject.exists()) {
      console.log("Object exists");
      let userQueue = dbObject.val();
      console.log(userQueue);
      Object.keys(userQueue).forEach((uid) => {
        const url = userQueue[uid].url;
        console.log(url);
        const queueID = userQueue[uid].queueID;
        console.log(queueID);
        const option = document.createElement("option");
        const optionText = document.createTextNode(url);
        //The values to send to server 
        option.setAttribute("value", url);
        option.setAttribute("data-queueid", queueID);
        //The value displayed
        //TODO: Change with the title of the corresponding URL
        option.appendChild(optionText);
        dropdown.appendChild(option);
        console.log(dropdown);
      });
    } else {
      dropdown.innerHTML = '<option>You have no URL pending review</option>';
    }

    document.querySelector("#url label").appendChild(dropdown);

    //Add button to copy URL
    let select = document.querySelector("select");
    let copyURLbutton = document.createElement("button");
    copyURLbutton.setAttribute("id","url-link");
    copyURLbutton.setAttribute("data-link", select.value);
    copyURLbutton.innerHTML = "Copy URL to clipboard";
    //Copy data-link attribute content (URL) to clipboard on click
    copyURLbutton.onclick = (event) => {
      console.log("I CLICKED THE URL BUTTON");
      var copyText = event.target.getAttribute("data-link");
      copyStringToClipboard(copyText);
      //To prevent reloading the page, no idea why...
      return false;
    };

    //On dropdwn value change event
    //If the dropdown value changes, change the data-link attribute of the button
    select.addEventListener("change", (event) => {
      let button = document.querySelector("#url button");
      button.setAttribute("data-link", event.target.value); 
    });

    return document.querySelector("#url").appendChild(copyURLbutton);
  });
});


//Interactions with the form (addition of form fields)

//Add subassessment to false claims section
let addSubassessmentFalse = document.querySelector("#false-claims .add-subassessment");
let nodeFalse = document.querySelector("#false-claims .subassessment");
nodeFalseCopy = nodeFalse.cloneNode(true);
addSubassessmentFalse.onclick = function () {
  let parent = document.querySelector("#false-claims");
  let button = nodeFalseCopy.querySelector(".add-source");
  button.onclick = function () {
    let p = this.parentNode;
    let node = p.querySelector("input:last-child");
    nodeCopy = node.cloneNode();
    nodeCopy.value = "";
    node.parentNode.insertBefore(nodeCopy, node.nextSibling);
  };
  //lastElementChild ignores the white space at the end of #false-claims
  parent.insertBefore(nodeFalseCopy, parent.lastElementChild);
};

//Add subassessment to misleading claims section
let addSubassessmentMisleading = document.querySelector("#misleading-claims .add-subassessment");
let nodeMisleading = document.querySelector("#misleading-claims .subassessment");
nodeMisleadingCopy = nodeMisleading.cloneNode(true);
addSubassessmentMisleading.onclick = function () {
  let parent = document.querySelector("#misleading-claims");
  let button = nodeMisleadingCopy.querySelector(".add-source");
  button.onclick = function () {
    let p = this.parentNode;
    let node = p.querySelector("input:last-child");
    nodeCopy = node.cloneNode();
    nodeCopy.value = "";
    node.parentNode.insertBefore(nodeCopy, node.nextSibling);
  };
  //lastElementChild ignores the white space at the end of #false-claims
  parent.insertBefore(nodeMisleadingCopy, parent.lastElementChild);
};

//Add subassessment to fallacious claims section
let addSubassessmentFallacious = document.querySelector("#fallacious-claims .add-subassessment");
let nodeFallacious = document.querySelector("#fallacious-claims .subassessment");
nodeFallaciousCopy = nodeFallacious.cloneNode(true);
addSubassessmentFallacious.onclick = function () {
  let parent = document.querySelector("#fallacious-claims");
  let button = nodeFallaciousCopy.querySelector(".add-source");
  button.onclick = function () {
    let p = this.parentNode;
    let node = p.querySelector("input:last-child");
    nodeCopy = node.cloneNode();
    nodeCopy.value = "";
    node.parentNode.insertBefore(nodeCopy, node.nextSibling);
  };
  //lastElementChild ignores the white space at the end of #false-claims
  parent.insertBefore(nodeFallaciousCopy, parent.lastElementChild);
};

//Select all "Add source" buttons
let addSource = document.querySelectorAll(".add-source");
//For each button, add an onclick even listener that will append an input if clicked
addSource.forEach(function(button) {
  button.onclick = function () {
    let p = this.parentNode;
    let node = p.querySelector("input:last-child");
    nodeCopy = node.cloneNode();
    nodeCopy.value = "";
    node.parentNode.insertBefore(nodeCopy, node.nextSibling);
  };
  });

//Create assessment object and add to local storage (back-end in the future)
//TODO: replace with addEventListener
let submit = document.querySelector("#submit");

submit.onclick = function() {

  //Create assessment object
  let assessment = {
    falseClaims: {},
    fallaciousClaims: {},
    misleadingClaims: {},
  };

  //Select all false claims subassessment divs
  let falseSubassessments = document.querySelectorAll("#false-claims .subassessment");
  //Loop over subassessments to add to assessment object
  falseSubassessments.forEach(function(subassessment, i) {
    let temp = {
      quote:"",
      explanation: {
        text: "",
        sources: [],
      }
    };
    let q = subassessment.querySelector(".quote");
    let t = subassessment.querySelector(".explanation");
    let s = subassessment.querySelectorAll(".source");
    temp.quote = q.value;
    temp.explanation.text = t.value;
    s.forEach(function(source, j) {
      temp.explanation.sources[j] = source.value;
    });
    assessment.falseClaims[i] = temp;
  });

  //Select all misleading claims subassessment divs
  let misleadingSubassessments = document.querySelectorAll("#misleading-claims .subassessment");
  //Loop over subassessments to add to assessment object
  misleadingSubassessments.forEach(function(subassessment, i) {
    let temp = {
      quote:"",
      explanation: {
        text: "",
        sources: [],
      }
    };
    let q = subassessment.querySelector(".quote");
    let t = subassessment.querySelector(".explanation");
    let s = subassessment.querySelectorAll(".source");
    temp.quote = q.value;
    temp.explanation.text = t.value;
    s.forEach(function(source, j) {
      temp.explanation.sources[j] = source.value;
    });
    assessment.misleadingClaims[i] = temp;
  });

  //Select all false claims subassessment divs
  let fallaciousSubassessments = document.querySelectorAll("#fallacious-claims .subassessment");
  //Loop over subassessments to add to assessment object
  fallaciousSubassessments.forEach(function(subassessment, i) {
    let temp = {
      quote:"",
      explanation: {
        text: "",
        sources: [],
      }
    };
    let q = subassessment.querySelector(".quote");
    let t = subassessment.querySelector(".explanation");
    let s = subassessment.querySelectorAll(".source");
    temp.quote = q.value;
    temp.explanation.text = t.value;
    s.forEach(function(source, j) {
      temp.explanation.sources[j] = source.value;
    });
    assessment.fallaciousClaims[i] = temp;
  });
  let dropdown = document.querySelector("#selectURL");
  let url = dropdown.value;
  assessment.url = url;
  let queueID = dropdown.options[dropdown.selectedIndex].getAttribute("data-queueid");
  chrome.runtime.sendMessage({
    type: "assessmentSubmission", 
    "assessment": assessment, 
    "queueID": queueID, 
    "url": url
  });
  alert("Assessment submitted");
  //Reload page without the browser cache
  location.reload(true);
};

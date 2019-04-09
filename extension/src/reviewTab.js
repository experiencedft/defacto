//Helper functions

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
//Retrieve from local storage and add options + create dropdown
chrome.storage.sync.get(['queue'], function(result) {
  //Check if there is something in queue
  //TODO: move that in the popup.js to throw an alert and avoid opening a tab
  if(Array.isArray(result.queue) && result.queue.length){
    //test
    //console.log(result.queue);
    result.queue.forEach(function(url){
      const option = document.createElement("option");
      const optionText = document.createTextNode(url);
      //Value defines content to be sent to the server
      option.setAttribute("value", url);
      //Content of option = what is displayed
      option.appendChild(optionText);
      dropdown.appendChild(option);
    });
  } else {
    dropdown.innerHTML = '<option>You have no URL pending review</option>'
  }
});
document.querySelector("#url label").appendChild(dropdown);

//Interactions with the form (addition of form fields)

//TODO: replace onclick with addEventListener

//Add subassessment to false claims section
let addSubassessmentFalse = document.querySelector("#false-claims .add-subassessment");
let nodeFalse = document.querySelector("#false-claims .subassessment");
nodeFalseCopy = nodeFalse.cloneNode(true);
addSubassessmentFalse.onclick = function () {
  let parent = document.querySelector("#false-claims");
  //lastElementChild ignores the white space at the end of #false-claims
  parent.insertBefore(nodeFalseCopy, parent.lastElementChild);
};

//Add subassessment to misleading claims section
let addSubassessmentMisleading = document.querySelector("#misleading-claims .add-subassessment");
let nodeMisleading = document.querySelector("#misleading-claims .subassessment");
nodeMisleadingCopy = nodeMisleading.cloneNode(true);
addSubassessmentMisleading.onclick = function () {
  let parent = document.querySelector("#misleading-claims");
  //lastElementChild ignores the white space at the end of #false-claims
  parent.insertBefore(nodeMisleadingCopy, parent.lastElementChild);
};

//Add subassessment to fallacious claims section
let addSubassessmentFallacious = document.querySelector("#fallacious-claims .add-subassessment");
let nodeFallacious = document.querySelector("#fallacious-claims .subassessment");
nodeFallaciousCopy = nodeFallacious.cloneNode(true);
addSubassessmentFallacious.onclick = function () {
  let parent = document.querySelector("#fallacious-claims");
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
      },
      votes: 0,
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
      },
      votes: 0,
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
      },
      votes: 0,
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

  console.log(assessment);
};

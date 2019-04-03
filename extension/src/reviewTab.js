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
l.innerHTML = "Select URL to review"
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

/*Form to select URL to review from possible URLs.
Currently: retrieves the queue from sync storgae
Eventually: only shows the URL from the back end db reviewer has been
selected to assess*/

//Create parent form element.

//action attribute = where to send (URL)
//method attribute = HTTP method to use
const form = document.createElement("form");
form.setAttribute("action","/assessment-form");
form.setAttribute("method", "post");
document.body.appendChild(form);

/*Form to select URL to review from possible URLs.
Currently: retrieves the queue from sync storgae
Eventually: only shows the URL from the back end db reviewer has been
selected to assess*/
const div = document.createElement("div");
document.querySelector("form").appendChild(div);
const l = document.createElement("label");
l.setAttribute("for","selectURL");
l.innerHTML = "Select URL to review"
document.querySelector("div:last-child").appendChild(l);
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
      //Check that array exists and is not empty
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
document.querySelector("div:last-child").appendChild(dropdown);

/*Form to select URL to review from possible URLs.
Currently: retrieves the queue from sync storgae
Eventually: only shows the URL from the back end db reviewer has been
selected to assess*/

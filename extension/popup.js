let submission = document.getElementById('submission');

submission.onclick = function() {

  //Get all tabs with specified property (active tab of the active window)
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0].url
    //TODO: plug to the API, currently uses local storage for testing
    chrome.storage.sync.get(['queue'], function(result) {
      //If queue is not in local storage, create it
      if (result.queue === undefined) {
        result.queue = []
      };
      //Add active tab URL if not already there
      if (!(result.queue.includes(activeTab))) {
      result.queue.push(activeTab);
      chrome.storage.sync.set(result);
    }
    });
  });

  chrome.storage.sync.get(['queue'], function(result) {
    console.log(result.queue);
  });
  
};

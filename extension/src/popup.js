let submission = document.getElementById('submission');
let review = document.getElementById('review');

submission.onclick = function() {
  //Get all tabs with specified property (active tab of the active window)
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0].url
    //TODO: plug to the API, currently uses local storage for testing
    chrome.storage.sync.get(['queue'], function(result) {
      //If queue is not in sync storage, create it
      if (result.queue === undefined) {
        result.queue = [];
      };
      //Add active tab URL if not already there
      if (!(result.queue.includes(activeTab))) {
      result.queue.push(activeTab);
      chrome.storage.sync.set(result, function() {
        //test
        console.log(result.queue)
      });
      };
    });
  });
//  chrome.storage.sync.get(['queue'], function(result) {
//    console.log(result.queue);
//  });
};

review.onclick = function() {
  chrome.tabs.create({url: "reviewTab.html"});
};

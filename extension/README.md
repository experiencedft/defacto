# DeFacto MVP Chrome Extension

This folder contains the Chrome Extension of the DeFacto MVP.

## How to install

To install the extension, please follow the following steps:

1. Download the extension folder
2. In Chrome, type chrome://extensions in the address bar
3. Enable developer mode in the top right hand corner of the page
4. Click on the "Load unpacked extension" button
5. Browse to where you put the extension folder and select it

The DeFacto extension should now appear in your extensions menu.

## How to use

Firstly, you should create an account using a valid email address and a password. Authentication is done using Firebase Authentication. We are able to see the email address you used for signing up. We won't be sending you any email, but of course you can always create a throwaway email address if you would like to.

Once you are signed up to the extension, the UI is composed of the following elements:

* A summary of a random assessment for your current tab's URL if there is one, a message informing you the page hasn't been assessed if there isn't.
* A button to submit the current  URL to the system for review. This will automatically assign the URL to a random number of users.
* A button to open the assessment tab. This will allow you to assess the URLs that have been assigned to you. Copy the URL to your clipboard using the corresponding button and open a new tab manually to access the URL you wish to review.

If you are assigned an URL to assess, you have 48 hours to do so before it is removed from your queue.

## A brief note on the UI/UX

As discussed in the project's README, the UI/UX are far from ideal, especially when it comes to writing an assessment. Not only does starting an assessment open a new tab, but the user then has to copy the URL to the clipboard, open a new tab manually, and paste in the search bar to see the corresponding URL. It is then a back and forth between the extension tab and the URL tab in order to write the assessment. This limitation is due to the Chrome Extension Content Security Policies which make it very difficult to interact with remote URLs within the extension environment.  

Ideally, what we would like to see is that users shouldn't need to leave their current web page at all, not even to open an assessment form in a new tab. To that end, the next step should be to implement annotations.  

## Known issues

* It is possible to submit an URL that already has exisiting assessments.
* URLs can be added to the queue of the person who submitted them.
* No error messages when login fails
* Users can write to metadatas
* The URL is not removed from the user queue when an assessment is pushed by the user

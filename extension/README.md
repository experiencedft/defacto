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
* A button to open the assessment tab. This will allow you to assess the URLs that have been assigned to you.

If you are assigned an URL to assess, you have 48 hours to do so before it is removed from your queue.

## Known issues

* It is possible to submit an URL that already has exisiting assessments.
* URLs can be added to the queue of the person who submitted them.
* No error messages when login fails

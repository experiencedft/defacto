# DeFacto MVP

This is the repository for a minimally (really minimally) viable iteration of the DeFacto internet peer-review extension.

## What does DeFacto aim to be?

DeFacto is a project that aims to combat misinformation online. The end goal is to make available a browser extension that will provide an assessment overlay for users on the entire internet. The underlying infrastructure will be entirely autonomous, meaning that no central authority or "trusted" third parties will decide what is true or false. Rather, the verification of online content for false claims, misleading claims or fallacious claims will be crowdsourced and the system will be secured using a robust Sybil-proof reputation system. As some readers will note, this is not an easy task, but we want to give it our best.

## What does the MVP currently do?

The current iteration is extremely basic and should not be seen as representative of the final product we have in mind. It is merely intended to give an idea of what the user experience could look like to an extent. Right now, the features are:

* Account creation (Firebase email + password authentication)
* URL submission for assessment
* Assignment of a given URL to a random selection of users 
* Users can assess new items in their queue for 48 hours
* The extension popup displays a random assessment for the current tab's URL if one exists

There is no curation mechanism, there are some bugs, and the UI is *really* bad. We are aware of that. This is just a modest beginning.

## How can I help?

In the following months, we will iterate with new versions of the extension and experiment with several subsystems. If you would like to help, you can join discussion on our [Discord](https://discord.gg/NQhrQ8y) server, feedback about what we are trying to achieve is welcome.

## But what's next exactly?

Below is a list of things we would like to implement and test:

* A voting system to curate assessments
* A reputation system 
* Peer-to-peer architecture
* A reward mechanism for good actors
* And more...

We will be sharing more details about our roadmap gradually.

## How do I install the extension?

Head into the extension folder and follow the instructions in the README file there.

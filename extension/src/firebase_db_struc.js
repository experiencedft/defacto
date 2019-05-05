var firebase_db = {
//Queue of web pages to assess
"queue": {
    //Unique ID allocated by Firebase
    "213547951": {
        url,
        timestamp //add server side
    },
    "412313215": {}
},
//List of assessments
"assessment": {
    "785469321": {
        falseClaim,
        misleadingClaim,
        fallaciousClaim,
    },
    "314527896": {}
},
//Metadata attached to each assessment
"metadata": {
    "789541234": {
        assessmentID, //assessment the metadata refers to
        queueID, //ID of the corresponding queue item
        votes,
        authorUID, //Firebase UID of the author
        timestamp, //add server side
        status //indicates whether assessment is pending vote or accepted
    },
    "445788412": {}
},
"users": {
    "14558626": {
        userID, //The unique UID of the user
        email,
        "reviewQueue": {
            queueID, //ID of the queue element corresponding to this URL
            url //the URL to review
        }
    }
}
}
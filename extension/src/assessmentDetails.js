function makeClaimDiv() {
/*     <div class="claim-div">\
    <h3>Quote</h3>\
    <p id="quote"></p>\
    <h3>Explanation</h3>\
    <p id="explanation"></p>\
    <ol id="sources"></ol>\
    </div> */
    claimDiv = document.createElement("div");
    claimDiv.setAttribute("class", "claim-div");
    quoteTitle = document.createElement("h3");
    quoteTitle.innerHTML = "Quote";
    quoteParagraph = document.createElement("p");
    quoteParagraph.setAttribute("class", "quote");
    explanationTitle = document.createElement("h3");
    explanationTitle.innerHTML = "Explanation";
    explanationParagraph = document.createElement("p");
    explanationParagraph.setAttribute("class", "explanation");
    ol = document.createElement("ol");
    ol.setAttribute("class", "sources");
    claimDiv.appendChild(quoteTitle);
    claimDiv.appendChild(quoteParagraph);
    claimDiv.appendChild(explanationTitle);
    claimDiv.appendChild(explanationParagraph);
    claimDiv.appendChild(ol);
    return claimDiv;
};

chrome.storage.sync.get(["currentAssessment"], function(result) {
    const assessment = result.currentAssessment;
    const falseClaims = assessment.falseClaims;
    const misleadingClaims = assessment.misleadingClaims;
    const fallaciousClaims = assessment.fallaciousClaims;
    //Populate false claims section
    Object.keys(falseClaims).forEach((index) => {
        const falseClaimsContainer = document.querySelector("#false-claims-container");
        //Make a div for the claim to be added
        const claimDiv = makeClaimDiv();
        const claimDivString = "claim-div-"+index; 
        console.log("String is " + claimDivString);
        claimDiv.setAttribute("id", claimDivString);
        falseClaimsContainer.appendChild(claimDiv);
        //Add quote to the relevant <p> element
        document.querySelector("#"+claimDivString+" .quote").innerHTML = falseClaims[index].quote;
        //Add explanation to the relevant <p> element
        document.querySelector("#"+claimDivString+" .explanation").innerHTML = falseClaims[index].explanation.text;
        let sourcesList = document.querySelector("#"+claimDivString+ " .sources");
        //Add sources in to the ordered list
        Object.keys(falseClaims[index].explanation.sources).forEach((sourceNo) => {
            const sourceText = falseClaims[index].explanation.sources[sourceNo];
            const li = document.createElement("li");
            li.innerHTML = sourceText;
            sourcesList.appendChild(li);
        });
    });
    //Populate misleading claims section
    Object.keys(misleadingClaims).forEach((index) => {
        const misleadingClaimsContainer = document.querySelector("#false-claims-container");
        //Make a div for the claim to be added
        const claimDiv = makeClaimDiv();
        const claimDivString = "claim-div-"+index; 
        console.log("String is " + claimDivString);
        claimDiv.setAttribute("id", claimDivString);
        misleadingClaimsContainer.appendChild(claimDiv);
        //Add quote to the relevant <p> element
        document.querySelector("#"+claimDivString+" .quote").innerHTML = misleadingClaims[index].quote;
        //Add explanation to the relevant <p> element
        document.querySelector("#"+claimDivString+" .explanation").innerHTML = misleadingClaims[index].explanation.text;
        let sourcesList = document.querySelector("#"+claimDivString+ " .sources");
        //Add sources in to the ordered list
        Object.keys(misleadingClaims[index].explanation.sources).forEach((sourceNo) => {
            const sourceText = misleadingClaims[index].explanation.sources[sourceNo];
            const li = document.createElement("li");
            li.innerHTML = sourceText;
            sourcesList.appendChild(li);
        });
    });
    //Populate fallacious claims section
    Object.keys(fallaciousClaims).forEach((index) => {
        const fallaciousClaimsContainer = document.querySelector("#false-claims-container");
        //Make a div for the claim to be added
        const claimDiv = makeClaimDiv();
        const claimDivString = "claim-div-"+index; 
        console.log("String is " + claimDivString);
        claimDiv.setAttribute("id", claimDivString);
        fallaciousClaimsContainer.appendChild(claimDiv);
        //Add quote to the relevant <p> element
        document.querySelector("#"+claimDivString+" .quote").innerHTML = fallaciousClaims[index].quote;
        //Add explanation to the relevant <p> element
        document.querySelector("#"+claimDivString+" .explanation").innerHTML = fallaciousClaims[index].explanation.text;
        let sourcesList = document.querySelector("#"+claimDivString+ " .sources");
        //Add sources in to the ordered list
        Object.keys(fallaciousClaims[index].explanation.sources).forEach((sourceNo) => {
            const sourceText = fallaciousClaims[index].explanation.sources[sourceNo];
            const li = document.createElement("li");
            li.innerHTML = sourceText;
            sourcesList.appendChild(li);
        });
    });
});
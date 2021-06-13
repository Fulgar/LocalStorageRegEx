window.onload = function() {
	let lsrxButton = document.getElementById("lsrx-button");
	let inputField = document.getElementById("rxPatternInput");

	
	// Gets last search and inserts it as the default input field value
	chrome.storage.sync.get(["lastSearch"], function(items){
		if (items.lastSearch) {
			inputField.value = items.lastSearch;
		}
	});
	
	lsrxButton.onclick = function() {
		// Saves search entry as "Last search"
		chrome.storage.sync.set({"lastSearch": inputField.value});
		
		// Submits
		onSubmitSearch(inputField.value);
	};
	
	// If presses enter in textfield 
	inputField.addEventListener("keyup", function(e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			lsrxButton.click();
		}
	});
};


function onSubmitSearch(inputFieldText) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {pattern: inputFieldText}, function(response) {
			displaySearchResults(response.results);
		});
	});
}

function displaySearchResults(results) {
	let resultsDiv = document.getElementsByClassName("lsrx-results")[0];
	
	// Clean slate
	resultsDiv.innerHTML = "";
	
	results.forEach ((result, i) => {
		let resultRow = document.createElement("div");
		resultRow.className = "lsrx-result-row"
		resultsDiv.appendChild(resultRow);
		
		
		let valueSpanContainer = document.createElement("div");
		valueSpanContainer.className = "lsrx-value-span-container";
		
		let valueSpan = document.createElement("span");
		valueSpan.appendChild(document.createTextNode(result));
		valueSpan.className = "lsrx-value-span"
		valueSpan.id = "value-span-" + i;
		
		valueSpanContainer.appendChild(valueSpan);
		
		
		let copyButtonContainer = document.createElement("div");
		copyButtonContainer.className = "lsrx-copy-button-container";
		
		let copyButton = document.createElement("button");
		copyButton.appendChild(document.createTextNode("Copy"));
		copyButton.className = "lsrx-copy-button";
		copyButton.onclick = function () {
			// Copy to clipboard
			let spanTxt = document.getElementById("value-span-" + i).textContent;
			navigator.clipboard.writeText(spanTxt);
			//document.execCommand("copy");

		};
		
		copyButtonContainer.appendChild(copyButton);
		
		
		let dottedDivider = document.createElement("hr");
		dottedDivider.className = "dotted-hr";
		
		resultRow.appendChild(valueSpanContainer);
		resultRow.appendChild(copyButtonContainer);
		resultRow.appendChild(dottedDivider);
	});
}
window.onload = function () {
	function getLSByRegex(pattern){
		let re = new RegExp(pattern);
		let ls = window.localStorage;
		let results = [];
	
		for (let i = 0; i < ls.length; i++) {
			if (re.exec(Object.keys(ls)[i])) {
				results.push(ls.getItem(ls.key(i)));
			}
		}
	
		return results;
	}
	
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if (!sender.tab) {
			let responseResults = getLSByRegex(request.pattern);
			sendResponse({results: responseResults});
		}
	});
};
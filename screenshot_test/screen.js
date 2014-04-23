console.log("pre-" + window.location.href);
chrome.runtime.sendMessage({ready_set: "go"}, function(resp) {
		console.log("a");
		console.log(resp.itory);
	});
/*window.onload = function() {
	console.log("sta " + window.location.href);
	chrome.runtime.sendMessage({ready_set: "go"}, function(resp) {
		console.log("b");
		console.log(resp.itory);
	});
};*/
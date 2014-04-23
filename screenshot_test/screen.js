console.log("pre-" + window.location.href);
window.setTimeout(function() {
		console.log("burp");
		chrome.runtime.sendMessage({ready_set: "go"}, function(resp) {
		console.log("a");
		console.log(resp.itory);
	});
}, 1000);
/*window.onload = function() {
	console.log("sta " + window.location.href);
	chrome.runtime.sendMessage({ready_set: "go"}, function(resp) {
		console.log("b");
		console.log(resp.itory);
	});
};*/
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.ready_set == "go") {
			var name = request.name;
			chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, function(data) {
				//alert(data);
				var url = "http://usdivad.com/l2/kayak/img_capture.php";
				var dataObj = {img: data, label:name};
				//var params = "img=" + data;

				$.post(url, dataObj, function(resp) {
					//alert(resp);
				})
			});
			sendResponse({itory: "asdf"});
		}
	});
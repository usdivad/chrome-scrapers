chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, function(data) {
			//alert(data);
			var url = "http://usdivad.com/l2/screen_test/capture.php";
			var dataObj = {img: data};
			var params = "img=" + data;
			//var params = "img="+"asdf";
			


			/*var http = new XMLHttpRequest();
			http.open("POST", url, true);

			//http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			http.setRequestHeader("Content-length", params.length);
			http.setRequestHeader("Connection", "close");

			http.onreadystatechange = function() {
				if (http.readyState==4 && http.status==200) {
					alert(http.responseText);
				}
			}

			http.send(JSON.stringify(dataObj));
			//http.send(params);*/

			$.post(url, dataObj, function(resp) {
				alert(resp);
			})
		});
		sendResponse({itory: "asdf"});
	});
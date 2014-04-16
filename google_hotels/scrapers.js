//Port of KayakScrapers.java
function Scrapers() {
console.log("scrap");
//test URL = http://www.kayak.com/hotels/London,England,United-Kingdom-c28501/2014-04-18/2014-04-19/2guests

//Make sure we're in the right place
/*if (window.location.href.match("hotels") == null) {
	getCity(sleepMs);
}*/

//coll data
var city = "";
cityStr = window.location.href.match(/hotels\/.*(?=\/.+\/.+\/)/)
if (cityStr != null) {
	city = cityStr[0].replace("hotels/", "");
}

var now = new Date();
var date_create = now.getUTCFullYear() + "-" + (now.getUTCMonth()+1) + "-" + now.getUTCDate();
var timestamp = now.toString();

var csvString = "";

/**SCRAPE!**/
//here

//Data collection
sendToCsv(csvString);


function getNextUrl() {
	var nextCity = getCity(sleepMs);
	var nextUrl = toUrl(nextCity);
}


function sendToCsv(str) {
	var http = new XMLHttpRequest();
	var url = "http://usdivad.com/l2/kayak/collect.php";

	//For JSON params
	/*var jsonString = JSON.stringify({a:"orange", b:"apple"});
	var params = "data="+encodeURIComponent(jsonString);*/

	var params = "data=" + encodeURIComponent(str);
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//http.setRequestHeader("Content-type", "application/json");
	//http.setRequestHeader("Content-type", "application/json;charset=UTF-8")
	/*http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");*/

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
	        console.log(http.responseText);
			clearReloader();
	        console.log("Getting next city...");
	        getCity(sleepMs/2); //don't have to worry about datacoll, only ratelimit
	    }
	}
	http.send(params);
}

function logTime() {
	var http = new XMLHttpRequest();
	var url = "http://usdivad.com/l2/kayak/log_time.php";

	var params = "data=" + encodeURIComponent(sleepMs);
	http.open("POST", url, true);

	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {
	    if(http.readyState == 4 && http.status == 200) {
	        console.log("time logged");
	    }
	}
	http.send(params);
}

function toCsvFormat(strings,alternate_sources,alt_rest) {
	var s = "";
	for (var i=0; i<strings.length; i++) {
		s += removeCommas(strings[i].toString()) + ",";
		//console.log(strings[i]);
	}
	s += alternate_sources.join(",").replace(/\s/g, "");
	s += ","+removeCommas(alt_rest);
	return s;
}

function removeCommas(s) { //or rather, commas to spaces
	return s.replace(/,/g, " ");
}

function copyToClipboard(s) {
	window.prompt("Copy to clipboard: Cmd+C -> Enter", s);
}

} //end KayakScrapers


/*Global functions (see poops comment for just)*/
function sayHi(){
	console.log("hello");
}

//Retrieve city from list, has to go in global
function getCity(sleep) {
	var http = new XMLHttpRequest();
	var url = "http://usdivad.com/l2/kayak/get_city.php";
	http.open("GET", url, true);
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			//console.log(http.responseText);
			var city = http.responseText;
			var nextUrl = "http://usdivad.com/l2/kayak/scrape_exit.html";
			if (city == "empty!") {
				nextUrl = "http://usdivad.com/l2/kayak/scrape_exit.html";
			}
			else {
				nextUrl = toUrl(city);
			}
			console.log(nextUrl);
			//clearReloader();
			window.setTimeout(function() {
				window.location.href = nextUrl;
				//logTime();
			}, sleep);
			console.log("Now I sleep for " + sleep/1000 + " seconds cos I'm not a bot");
		}
		else {
			//console.log("getCity error!");
		}
	}
	http.send(null);
	//http.open("GET")
}
function toUrl(city) {
	var urlBase = "http://www.google.com/search?q=";
	url = urlBase + city;
	return url;
}

function clearReloader() {
	window.clearTimeout(reloader);
	console.log("Killed reloader");
}

//Get sleep from sleep_times.txt file
function getSleep() {
	var http = new XMLHttpRequest();
	var url = "http://usdivad.com/l2/kayak/get_sleep.php";
	http.open("GET", url, true);
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			//console.log(http.responseText);
			var sleepTime = http.responseText;
			if (sleepTime != null) {
				if (!isNaN(parseInt(sleepTime))) {
					sleepMs = parseInt(sleepTime) + Math.random()*2000;
					console.log("reset sleep time from get_sleep");
					clearReloader();
					reloader = window.setTimeout(function() { //window.location.reload() triggers security!
						getCity(1000);
					}, sleepMs);
					console.log("From reloader: Now I sleep for " + sleepMs/1000 + " seconds cos I'm not a bot");
				}
				else {console.log("NaN error; keep the old time");}
			}

		}
	}
	http.send(null);
}

function sendSecurityAlert() {
	var now = new Date().toString();
	var http = new XMLHttpRequest();
	var url = "http://usdivad.com/l2/kayak/security.php";
	var params = "data=" + "SECURITY CHECK encountered at " + encodeURIComponent(now);
	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.onreadystatechange = function() {
	    if(http.readyState == 4 && http.status == 200) {
	        console.log("security check at " + now);
	    }
	}
	http.send(params);
}


/*
 * GLOBAL POOPS
 * needed to plant execution in case window.onload fails
 * but this is all w/in the extension load anyways; not accessible by user
 */ 
console.log("BEEF");

//w.r.t. sleepMs, if it's too low you'll end up making too many unsuccessful requests
var sleepMs = (7+(Math.random()*8))*1000; //backup method



var reloader = window.setTimeout(function() { //window.location.reload() triggers security!
	getCity(1000);
}, sleepMs);
console.log("From reloader: Now I sleep for " + sleepMs/1000 + " seconds cos I'm not a bot");


//Security check
if (window.location.href.match("security") != null) {
	console.log("I died");
	alert("Scraper pause! (security check)");
	clearReloader();
	sendSecurityAlert();
}

window.onload = function() {
	sayHi();
	window.setTimeout(function() {
		KayakScrapers();
	}, 500);
}
function scrape() {
console.log("Gogogoogo");

//Make sure we're in the right place
/*if (window.location.href.match("hotels") == null) {
	getCity(sleepMs);
}*/


//coll data
var city = "";
cityStr = window.location.href.match(/search\?q=.*/)
if (cityStr != null) {
	city = cityStr[0].replace("search\?q=", "");
	city = city.replace(/\+/g, " ");
	city = city.replace("hotels in ", "");
}

var now = new Date();
var date_create = now.getUTCFullYear() + "-" + (now.getUTCMonth()+1) + "-" + now.getUTCDate();
var timestamp = now.toString();

var csvString = "";

/**SCRAPE!**/
var cu = document.getElementById("cu-results");
if (cu == null) {
	console.log("no hotel suggestions!");
	sendToCsv(removeCommas(city) + "," + removeCommas(date_create) + "," + removeCommas(timestamp) + ",,,,\r\n");
}
else {
var results = cu.getElementsByTagName("tr");

for (var i=0; i<results.length; i++) {
	var listing = results[i];
	var rank = i+1;
	var price = "";
	var hotel_name = "";
	var hotel_class = "";
	var rating_stars = "";
	var num_reviews = "";

	if (listing.getElementsByClassName("cu-hotels-price").length > 0) {
		var elm = listing.getElementsByClassName("cu-hotels-price")[0];
		if (typeof elm != "undefined") {
			price = elm.textContent;
		}
	}

	if (listing.getElementsByClassName("cu-hotels-link").length > 0) {
		var elm = listing.getElementsByClassName("cu-hotels-link")[0];
		if (typeof elm != "undefined") {
			hotel_name = elm.text;
		}
	}

	if (listing.getElementsByClassName("cu-hotels-stars").length > 0) {
		var elm = listing.getElementsByClassName("cu-hotels-stars")[0];
		if (typeof elm != "undefined") {
			hotel_class = elm.textContent;
		}
	}

	if (listing.getElementsByClassName("cu-scorestars").length > 0) {
		var elm = listing.getElementsByClassName("cu-scorestars")[0];
		if (typeof elm != "undefined") {
			rating_stars = elm.textContent;
		}
	}

	if (listing.getElementsByClassName("cu-hotels-extras").length > 0) {
		var td = listing.getElementsByClassName("cu-hotels-extras")[0];
		var elms = td.getElementsByTagName("span");
		if (elms.length > 0) {
			elm = elms[elms.length-1];
			if (typeof elm != "undefined") {
				nrContent = elm.textContent;
				num_reviews = nrContent.replace(/\D*/g, "");
				console.log(num_reviews);
			}
		}
	}

//format
var csvLine = toCsvFormat([city,date_create,timestamp,rank,hotel_name,price,hotel_class,rating_stars,num_reviews]);
csvString += csvLine;

}

//Data collection
console.log("HEY");
console.log(csvString);
sendToCsv(csvString);

} //end else

function getNextUrl() {
	var nextCity = getCity(sleepMs);
	var nextUrl = toUrl(nextCity);
}


function sendToCsv(str) {
	var http = new XMLHttpRequest();
	var url = phpBase + "collect.php";

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
	var url = phpBase + "log_time.php";

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

function toCsvFormat(strings) {
	var s = "";
	for (var i=0; i<strings.length; i++) {
		s += removeCommas(strings[i].toString()) + ",";
		//console.log(strings[i]);
	}
	//s += alternate_sources.join(",").replace(/\s/g, "");
	//s += ","+removeCommas(alt_rest);
	return s + "\r\n";
}

function removeCommas(s) { //or rather, commas to spaces
	return s.replace(/,/g, " ");
}

function copyToClipboard(s) {
	window.prompt("Copy to clipboard: Cmd+C -> Enter", s);
}

} //end scrape()


/*Global functions (see poops comment for just)*/
function sayHi(){
	console.log("hello");
}

//Retrieve city from list, has to go in global
function getCity(sleep) {
	var http = new XMLHttpRequest();
	var url = phpBase + "get_city.php";
	http.open("GET", url, true);
	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			//console.log(http.responseText);
			var city = http.responseText;
			var nextUrl = phpBase + "index.html";
			if (city == "empty!") {
				nextUrl = phpBase + "index.html";
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
	var urlBase = "https://www.google.com/search?q=";
	var query = "hotels+in+";
	url = urlBase + query + city.replace(",", "+");
	return url;
}

function clearReloader() {
	window.clearTimeout(reloader);
	console.log("Killed reloader");
}

//Get sleep from sleep_times.txt file
function getSleep() {
	var http = new XMLHttpRequest();
	var url = phpBase + "get_sleep.php";
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
	var url = phpBase + "security.php";
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
var phpBase = "http://usdivad.com/l2/google_hotels/";
console.log("BEEF");

//w.r.t. sleepMs, if it's too low you'll end up making too many unsuccessful requests
var sleepMs = (5+(Math.random()*8))*1000; //backup method



var reloader = window.setTimeout(function() { //window.location.reload() triggers security!
	scrape(); //for google, as onload seems to give problems
	//getCity(1000);
}, sleepMs);
console.log("From reloader: Now I sleep for " + sleepMs/1000 + " seconds cos I'm not a bot");


//Security check
if (window.location.href.match("security") != null) {
	console.log("I died");
	alert("Scraper pause! (security check)");
	clearReloader();
	sendSecurityAlert();
}

window.onload = function() { //has to be thru extension
	sayHi();
	window.setTimeout(function() {
		scrape();
		console.log("scrape");
	}, 500);
}
//Port of KayakScrapers.java
function KayakScrapers() {
console.log("Kayakyak");
//test URL = http://www.kayak.com/hotels/London,England,United-Kingdom-c28501/2014-04-18/2014-04-19/2guests

//Make sure we're in the right place
if (window.location.href.match("hotels") == null) {
	getCity(sleepMs);
}

//consts
var asLength = 4;
var resultsPerPage = 18; //estimate

//coll data
var city = "";
cityStr = window.location.href.match(/hotels\/.*(?=\/.+\/.+\/)/)
if (cityStr != null) {
	city = cityStr[0].replace("hotels/", "");
}
var rank = "";
var total_hotels = "";
/*var date_create = new Date().toLocaleString();
date_create = date_create.match(/\d+\/\d+\/\d+/)[0];*/
var now = new Date();
var date_create = now.getUTCFullYear() + "-" + (now.getUTCMonth()+1) + "-" + now.getUTCDate();
var timestamp = now.toString();


/*var csvColumns = "city,date_create,timestamp,rank,advertised,hotel_name,hotel_source,ad_headline,ad_source,price,rating_stars,rating_reviews,total_hotels";
for (var i=0; i<asLength; i++) {
	csvColumns += ",alt"+(i+1);
}
csvColumns += ",alt_rest"
csvColumns += "\n";*/
var csvString = "";
//csvString += csvColumns;

//proc
var contentDiv = document.getElementById("content_div");
var hotelListings = document.getElementsByClassName("hotelresult");

//Total hotels
var thStr = document.getElementById("resultcounttotalitems").innerText;
var totalPattern = /\d+(?= hotels)/;
var thMatch = thStr.match(totalPattern);
if (thMatch != null) {
	total_hotels = thMatch[0];
}

//for each listing
for (var i=0; i<hotelListings.length; i++) {
	var advertised = false;
	var hotel_name = "";
	var hotel_source = "";
	var ad_headline = "";
	var ad_source = "";
	var price = "";
	var rating_stars = "";
	var rating_reviews = "";
	var num_reviews = "";
	var alternate_sources = [];
	var alt_rest = "";
	for (var j=0; j<asLength; j++) {
		alternate_sources[j] = "";
	}
	var listing = hotelListings[i];
	if (listing.getElementsByClassName("inlineAdInner").length > 0) {
		advertised = true;
		ad_headline_elm = listing.getElementsByClassName("inlineAdHeadline")[0]
		if (typeof ad_headline_elm != "undefined") {
			ad_headline = ad_headline_elm.innerText;
		}
		ad_source_elm = listing.getElementsByClassName("inlineAdSite")[0];
		if (typeof ad_source_elm != "undefined") {
			ad_source = ad_source_elm.innerText;
		}
		price_elm = listing.getElementsByClassName("inlineAdBookPrice")[0];
		if (typeof price_elm != "undefined") {
			price = price_elm.innerText;
		}

		hotel_name = "";
		hotel_source = "";
		rating_stars = "";
		rating_reviews = "";
		num_reviews = "";		
	}
	else {
		advertised = false;
		hotel_name_elm = listing.getElementsByClassName("hotelname")[0];
		if (typeof hotel_name_elm != "undefined") {
			hotel_name = hotel_name_elm.getAttribute("title");
		}

		ad_headline = "";
		ad_source = "";

		var underprice = listing.getElementsByClassName("underprice")[0];
		
		if (typeof underprice != "undefined") {
			hotel_source_elm = underprice.getElementsByTagName("span")[0];
			if (typeof hotel_source_elm != "undefined") {
				hotel_source = hotel_source_elm.innerText.replace(" ", "");
			}
		}

		price_elm = listing.getElementsByClassName("bigpricelink")[0];
		if (typeof price_elm != "undefined") {
			price = price_elm.innerText;
		}


		var starStr_elm = listing.getElementsByClassName("starsprite")[0];
		if (typeof starStr_elm != "undefined") {
			starStr = starStr_elm.className;
			var starPattern = /star\d/;
			var starMatch = starStr.match(starPattern);
			if (starMatch != null) {
				rating_stars = starMatch[0].replace(/\D/g, "");
			}
		}

		var rating_reviews_elm = listing.getElementsByClassName("reviewsoverview")[0];
		if (typeof rating_reviews_elm != "undefined") {
			rating_reviews = rating_reviews_elm.getElementsByTagName("strong")[0]
														.innerText;
		}
								

		var nrStr_elm = listing.getElementsByClassName("reviewsoverview")[0];
		if (typeof nrStr_elm != "undefined") {
			var nrStr = nrStr_elm.innerText;
			var nrPattern = /\d+ reviews/;
			var nrMatch = nrStr.match(nrPattern);
			if (nrMatch != null) {
				num_reviews = nrMatch[0].replace(/\D/g, "");
			}
		}

		altSources = listing.getElementsByClassName("providerText");
		for (var j=0; j<asLength; j++) {
			var source = altSources[j];
			if (j < altSources.length) {
				alternate_sources[j] = source.innerText;
			}
			else {
				alternate_sources[j] = "";
			}
		}
		alt_rest_obj = listing.getElementsByClassName("allInlineItems")[0];
		if (typeof alt_rest_obj != "undefined") {
			alt_rest = alt_rest_obj.innerText;
		}
		//console.log(alt_rest)
		//console.log(alternate_sources);

	}

	var pageNumberStr = window.location.href.match(/pn=\d+/g);
	var pageNumber = 0;
	if (pageNumberStr != null) {
		pageNumberStr[0].replace(/\D/g, "");
		if (!isNaN(parseInt(pageNumber))) {
			rank = (pageNumber*resultsPerPage) + i+1;
		}
	}

	var csvLine = (toCsvFormat([city,date_create,timestamp,rank,advertised,hotel_name,hotel_source,ad_headline,ad_source,price,rating_stars,rating_reviews,total_hotels],alternate_sources,alt_rest) + "\n");
	//console.log((i+2) + ": " + csvLine);
	csvString += csvLine;

}

/*copyToClipboard(csvString);
console.log(csvString);*/

//Data collection
sendToCsv(csvString);
//Uncomment this to use img_capture (bandwidth!)
//takeScreenshot(city);

//Get next city and redirect (this is now in ajax in sendToCsv)
//getCity();


function getNextUrl() {
	var nextCity = getCity(sleepMs);
	var nextUrl = toKayakUrl(nextCity);
}

//Image capture!! relies on background.js n all
function takeScreenshot(cityName) {
	chrome.runtime.sendMessage({ready_set: "go", name: cityName}, function(resp) {
		console.log("a");
		console.log(resp.itory);
	});
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
				nextUrl = toKayakUrl(city);
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
function toKayakUrl(city) {
	var urlBase = "http://www.kayak.com/hotels";
	var now = new Date();
	var tempNow = new Date();
	var daysAdvance = 2; //prevent timezone differences
	
	//The safe way (prevent "2014-02-32" scenario)
	var date1 = new Date(tempNow.setDate(now.getDate() + daysAdvance));
	var date2 = new Date(tempNow.setDate(now.getDate() + daysAdvance + 1));
	var date1Str = date1.getUTCFullYear() + "-" + (date1.getUTCMonth()+1) + "-" + (date1.getUTCDate());
	var date2Str = date2.getUTCFullYear() + "-" + (date2.getUTCMonth()+1) + "-" + (date2.getUTCDate());
	var url = urlBase + "/" + city.replace(/\s/g, "-") + "/" + date1Str + "/" + date2Str + "/" + "2guests" + "?pn=0";
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

//window.location.href = toKayakUrl("Beijing");

/*
 * GLOBAL POOPS
 * needed to plant execution in case window.onload fails
 * but this is all w/in the extension load anyways; not accessible by user
 */ 
console.log("BEEF");

//w.r.t. sleepMs, if it's too low you'll end up making too many unsuccessful requests
var sleepMs = (7+(Math.random()*8))*1000; //backup method


/*var dice = Math.random();
if (dice > 0.5) {
	sleepMs = ;
}
else {
	sleepMs = 
}*/

/*var reloader = window.setTimeout(function() { 
	console.log("reloading");
	window.location.reload();
}, sleepMs);*/

var reloader = window.setTimeout(function() { //window.location.reload() triggers security!
	getCity(1000);
}, sleepMs);
console.log("From reloader: Now I sleep for " + sleepMs/1000 + " seconds cos I'm not a bot");
//getSleep();

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
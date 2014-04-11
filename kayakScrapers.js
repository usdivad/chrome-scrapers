//Port of KayakScrapers.java
function KayakScrapers() {
console.log("Kayakyak");
//test URL = http://www.kayak.com/hotels/London,England,United-Kingdom-c28501/2014-04-18/2014-04-19/2guests

//Make sure we're in the right place
if (window.location.href.match("hotels") == null) {
	getCity(0);
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


var csvColumns = "city,date_create,rank,advertised,hotel_name,hotel_source,ad_headline,ad_source,price,rating_stars,rating_reviews,total_hotels";
for (var i=0; i<asLength; i++) {
	csvColumns += ",alt"+(i+1);
}
csvColumns += ",alt_rest"
csvColumns += "\n";
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
		ad_headline = listing.getElementsByClassName("inlineAdHeadline")[0].innerText;
		ad_source = listing.getElementsByClassName("inlineAdSite")[0].innerText;
		price = listing.getElementsByClassName("inlineAdBookPrice")[0].innerText;

		hotel_name = "";
		hotel_source = "";
		rating_stars = "";
		rating_reviews = "";
		num_reviews = "";		
	}
	else {
		advertised = false;
		hotel_name = listing.getElementsByClassName("hotelname")[0].getAttribute("title");

		ad_headline = "";
		ad_source = "";

		var underprice = listing.getElementsByClassName("underprice")[0];
		hotel_source = underprice.getElementsByTagName("span")[0].innerText.replace(" ", "");
		price = listing.getElementsByClassName("bigpricelink")[0].innerText;


		var starStr = listing.getElementsByClassName("starsprite")[0].className;
		var starPattern = /star\d/;
		var starMatch = starStr.match(starPattern);
		if (starMatch != null) {
			rating_stars = starMatch[0].replace(/\D/g, "");
		}

		rating_reviews = listing.getElementsByClassName("reviewsoverview")[0]
								.getElementsByTagName("strong")[0]
								.innerText;

		var nrStr = listing.getElementsByClassName("reviewsoverview")[0].innerText;
		var nrPattern = /\d+ reviews/;
		var nrMatch = nrStr.match(nrPattern);
		if (nrMatch != null) {
			num_reviews = nrMatch[0].replace(/\D/g, "");
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

	var csvLine = (toCsvFormat([city,date_create,rank,advertised,hotel_name,hotel_source,ad_headline,ad_source,price,rating_stars,rating_reviews,total_hotels],alternate_sources,alt_rest) + "\n");
	//console.log((i+2) + ": " + csvLine);
	csvString += csvLine;

}

/*copyToClipboard(csvString);
console.log(csvString);*/

//Data collection
sendToCsv(csvString);


//Get next city and redirect (this is now in ajax in sendToCsv)
//getCity();


function getNextUrl() {
	var nextCity = getCity(sleepMs);
	var nextUrl = toKayakUrl(nextCity);
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
	        getCity(sleepMs);
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
	var date1 = now.getUTCFullYear() + "-" + (now.getUTCMonth()+1) + "-" + (now.getUTCDate()+1);
	var date2 = now.getUTCFullYear() + "-" + (now.getUTCMonth()+1) + "-" + (now.getUTCDate()+2);
	var url = urlBase + "/" + city.replace(/\s/g, "-") + "/" + date1 + "/" + date2 + "/" + "2guests" + "?pn=0";
	return url;
}

function clearReloader() {
	window.clearTimeout(reloader);
	console.log("Killed reloader");
}

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
					sleepMs = parseInt(sleepTime) + Math.random()*10000;
					console.log("reset sleep time from get_sleep");
					clearReloader();
					reloader = window.setTimeout(function() { //window.location.reload() triggers security!
						getCity(0);
					}, sleepMs);
					console.log("From reloader: Now I sleep for " + sleepMs/1000 + " seconds cos I'm not a bot");
				}
				else {console.log("NaN error");}
			}

		}
	}
	http.send(null);
}

function sendSecurityAlert() {
	var now = new Date().toString();
	var http = new XMLHttpRequest();
	var url = "http://usdivad.com/l2/kayak/security.php";
	var params = "data=" + "Security check encountered at " + encodeURIComponent(now);
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

var sleepMs = (60+(Math.random()*30))*1000; //backup method
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
	getCity(0);
}, sleepMs);
console.log("From reloader: Now I sleep for " + sleepMs/1000 + " seconds cos I'm not a bot");
getSleep();

if (window.location.href.match("security") != null) {
	console.log("I died");
	alert("Scraper pause! (security check)");
	clearReloader();
}

window.onload = function() {
	sayHi();
	window.setTimeout(function() {
		KayakScrapers();
	}, 500);
}
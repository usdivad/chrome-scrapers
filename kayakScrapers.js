//Port of KayakScrapers.java

//test URL = http://www.kayak.com/hotels/London,England,United-Kingdom-c28501/2014-04-18/2014-04-19/2guests

//coll data
var rank = 1;
var total_hotels = "";
var asLength = 5;
var date_create = new Date().toLocaleString().match(/\d+\/\d+\/\d+/)[0];

var csvColumns = "date_create,rank,advertised,hotel_name,hotel_source,ad_headline,ad_source,price,rating_stars,rating_reviews,total_hotels";
for (var i=0; i<asLength; i++) {
	csvColumns += ",alt"+(i+1);
}
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
		//console.log(alternate_sources);

	}

	rank = i+1;

	var csvLine = (toCsvFormat([date_create,rank,advertised,hotel_name,hotel_source,ad_headline,ad_source,price,rating_stars,rating_reviews,total_hotels],alternate_sources) + "\n");
	//console.log((i+2) + ": " + csvLine);
	csvString += csvLine;

}

/*copyToClipboard(csvString);
console.log(csvString);*/

//Data collection
var http = new XMLHttpRequest();
var url = "http://usdivad.com/l2/kayak/collect.php";
var params = "data="+csvString;
http.open("POST", url, true);

//Send the proper header information along with the request
http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
/*http.setRequestHeader("Content-length", params.length);
http.setRequestHeader("Connection", "close");*/

http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        console.log(http.responseText);
    }
}
http.send(params);

/*$.post("collect.php", {data: csvString}, function(d) {
	console.log("post");
});*/


function toCsvFormat(strings,alternate_sources) {
	var s = "";
	for (var i=0; i<strings.length; i++) {
		s += removeCommas(strings[i].toString()) + ",";
		//console.log(strings[i]);
	}
	s += alternate_sources.join(",").replace(/\s/g, "");
	return s;
}

function removeCommas(s) {
	return s.replace(/,/g, "");
}

function copyToClipboard(s) {
	window.prompt("Copy to clipboard: Cmd+C -> Enter", s);
}
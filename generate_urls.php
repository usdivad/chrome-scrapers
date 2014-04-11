<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

    $numPages = 3;
    $urlList = fopen('./url_list.txt', 'a');
    $urlsToAdd = '';

    //We only get whichever cities are left for this batch; so we'll append all URLs created here
    $cities = file('./cities_slave.txt');
    foreach($cities as $city) {
        $urlsToAdd .= paginateUrls($city, $numPages);
    }
    fwrite($urlList, $urlsToAdd);
    fclose($urlList);


    //
    function paginateUrls($city, $numPages) {
        $urls = '';
        for ($pn=0; $pn<$numPages; $pn++) {
            $urls .= toUrl($city).'?pn='.$pn.PHP_EOL;
        }
        return $urls;
    }

    function toUrl($city) {
        //"Sao Paolo" to "Sao-Paolo"
        $patterns = array('/\s/');
        $replacements = array('-');
        $cityClean = preg_replace($patterns, $replacements, $city);
        
        //Construct URL
        $urlBase = 'http://www.kayak.com/hotels';
        $dateFormat = 'Y-m-d';
        //$now = date($dateFormat);
        $daysAdvance = 1; //prevent timezone diffs
        $date1 = mktime(0,0,0, date("m"), date("d")+$daysAdvance, date("Y"));
        $date2 = mktime(0,0,0, date("m"), date("d")+$daysAdvance+1, date("Y"));
        $date1Str = date($dateFormat, $date1);
        $date2Str = date($dateFormat, $date2);
        $url = $urlBase.'/'.$cityClean.'/'.$date1Str.'/'.$date2Str.'/'.'2guests';
        return $url;
    }

?>
﻿<?php
function twitterFeedToHtml($feedTerms)
{
    global $pathToNews;
    $url = "http://search.twitter.com/search.atom?q=" . str_replace(" ","+",$feedTerms);
    $fopen_feed = @fopen($url, "r");
    //Make sure fopen was successful
    if ($fopen_feed) {
        //Store our data
        $data = "";
        while (!feof($fopen_feed)) {
            $data .= fread($fopen_feed, 8192);
        }
    }
    //Close fopen
    fclose($fopen_feed);
    $feedHtml = "";
    $xml = new SimpleXmlElement($data, LIBXML_NOCDATA);
    for($i=0; $i<5; $i++)
    {
        $tweet = strip_tags($xml->entry[$i]->title);
        $author = strip_tags($xml->entry[$i]->author->name);
        $feedHtml .= "<p>".$tweet."<br />- " . $author . "</p>";
    }
    file_put_contents($pathToNews,$feedHtml);
}
?>
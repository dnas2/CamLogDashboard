<?php

/*
 * The main file. Call this from PHP at the command line
 */

require("config.php");
include("classes/database.php");
include("functions/queries.php");
date_default_timezone_set('Europe/London');


$mysql = new Database();
$mysql->host = $dbCredentials['host'];
$mysql->user = $dbCredentials['user'];
$mysql->password = $dbCredentials['password'];
$mysql->database = $dbCredentials['database'];
$mysqlConnection = $mysql->connect();

if (!$mysqlConnection) {die;}

// Get the station frequencies
$frequencies = getLastQsoFrequencies($mysqlConnection);

// Get the totals
$totals = getQsoTotals($mysqlConnection);

// Get the operator QSO totals
$topOps = getOperatorQsos($mysqlConnection);

// Gets the mode split as percentage of all QSOs
$modes = getModeSplit($totals['totalQsos_all'], $mysqlConnection);

// Gets the mode split as percentage of all QSOs
$bands = getBandSplit($totals['totalQsos_all'], $mysqlConnection);


$mysql->disconnect($mysqlConnection);

$meta = array("created"=>date("H:i l j F"));

$result = array("frequencies"=>$frequencies,"totals"=>$totals,"topOps"=>$topOps,"modes"=>$modes,"bands"=>$bands,"meta"=>$meta);
$json = json_encode($result);

file_put_contents($pathToJson,$json);



?>
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
$frequencies = getLastQsoFrequencies();

// Get the totals
$totals = getQsoTotals();

// Get the operator QSO totals
$topOps = getOperatorQsos();

// Gets the mode split as percentage of all QSOs
$modes = getModeSplit($totals['totalQsos_all']);

$mysql->disconnect();

$meta = array("created"=>date("H:i l j F"));

$result = array("frequencies"=>$frequencies,"totals"=>$totals,"topOps"=>$topOps,"modes"=>$modes,"meta"=>$meta);
$json = json_encode($result);

file_put_contents($pathToJson,$json);

?>
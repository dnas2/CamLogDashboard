<?php

function getLastQsoFrequencies($mysqlConnection) {
    // Ideal query, but frequencies isn't actually populated it turns out!
    /*
    $q = "SELECT station, frequency FROM frequencies ORDER BY station";
    $results= array();
    $r = mysqli_query($mysqlConnection, $q);
    while ($row = mysqli_fetch_object($r)) 
    {
        $results[$row->station] = $row->frequency;
    }
    return $results;
     */
    // Query below doesn't have GROUP BY as that would give first frequency, not last (even with ORDER BY endTime DESC)
    $q = "SELECT station, frequency FROM log WHERE endTime>(DATE_SUB(NOW(),INTERVAL 70 MINUTE)) ORDER BY station, endTime DESC";  // Subtract 70 mins for 10 mins off UTC time (aka nasty timezone hack)
    $results= array();
    $r = mysqli_query($mysqlConnection, $q);
    while ($row = mysqli_fetch_object($r)) 
    {
        $stationNonBreakingHyphen = str_replace("-","&#8209;",$row->station);
        if (!array_key_exists($row->station,$results))  // Only the latest QSO can go into the array
        {
            $results[$stationNonBreakingHyphen] = $row->frequency / 1000000;
        }
    }
    ksort($results);
    return $results;
}

function getQsoTotals($mysqlConnection) {
    // 1. Get the number of QSOs
    $q = "SELECT COUNT(`id`) FROM `log`";
    $r = mysqli_query($mysqlConnection, $q);
    $totalQsos_all = mysqli_result($r,0,0);
    // 2. Distinct callsigns
    $q = "SELECT COUNT(DISTINCT(`callsign`)) FROM `log`";
    $r = mysqli_query($mysqlConnection, $q);
    $distinct_all = mysqli_result($r,0,0);
    // 3. Number of QSOs on VHF
    $q = "SELECT COUNT(`id`) FROM `log` WHERE `frequency`>30000000";
    $r = mysqli_query($mysqlConnection, $q);
    $totalQsos_vhf = mysqli_result($r,0,0);
    $results = array("totalQsos_all"=>$totalQsos_all, "distinct_all"=>$distinct_all, "totalQsos_vhf"=>$totalQsos_vhf);
    return $results;
}

function getOperatorQsos($mysqlConnection) {
    $q = "SELECT `operator`, COUNT(*) AS qsos FROM `log` GROUP BY `operator`";
    $r = mysqli_query($mysqlConnection, $q);
    $results = array();
    while ($row = mysqli_fetch_object($r)) 
    {
        $results[$row->operator] = $row->qsos;
    }
    arsort($results);
    $top5 = array();
    $i = 13;
    foreach ($results as $operator => $qsos)
    {
        if ($i > 0) {
            $top5[$operator] = $qsos;
            $i--;
        }
    }
    return $top5;
}



function getModeSplit($totalQsos, $mysqlConnection) {
    $q = "SELECT `mode`, COUNT(*) AS qsos FROM `log` GROUP BY `mode`";
    $r = mysqli_query($mysqlConnection, $q);
    $results = array();
    while ($row = mysqli_fetch_object($r)) 
    {
        $results[$row->mode] = $row->qsos;
    }
    arsort($results);
    $top5 = array();
    $i = 5;
    foreach ($results as $mode => $qsos)
    {
        if ($i > 0) {
            $top5[$mode] = round($qsos/$totalQsos*100); // As percentage
            $i--;
        }
    }
    return $top5;
}

function mysqli_result($res, $row, $field=0) { 
    // From http://php.net/manual/en/class.mysqli-result.php
    $res->data_seek($row); 
    $datarow = $res->fetch_array(); 
    return $datarow[$field]; 
} 


?>
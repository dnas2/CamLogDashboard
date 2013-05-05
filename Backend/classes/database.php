<?php

class Database {
    var $host,
    $user,
    $password,
    $database;
    
    function connect() {
        $link = mysql_connect($this->host, $this->user, $this->password);
        if (!$link) {
            return false;
        }
        mysql_select_db($this->database, $link) or die();
        return $link;
    }
    
    function disconnect() {
        mysql_close();
    }
    
}
    

?>
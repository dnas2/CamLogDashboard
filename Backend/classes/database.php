<?php

class Database {
    var $host,
    $user,
    $password,
    $database;
    
    function connect() {
        $link = mysqli_connect($this->host, $this->user, $this->password, $this->database);
        if (!$link) {
            return false;
        }
        return $link;
    }
    
    function disconnect($link) {
        mysqli_close($link);
    }
    
}
    

?>
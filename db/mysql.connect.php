<?php
	$mysqli = new mysqli( 'localhost', 'root', '', 'vm_db' );
    
    if ( $mysqli->errno ){
        echo "Fail to connect database! <br>";
        exit();
    }
?>
<?php
	$mysqli = new mysqli( 'localhost', 'root', '', 'eh_db' );
    
    if( $mysqli->errno ){
        echo "Fail to connect database! <br>";
        exit();
    }
?>
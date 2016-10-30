<?php
    $mysqli = new mysqli( 'localhost', 'jangerte_admin', 'lnkxuyen2109', 'jangerte_vm' );
    
    if ( $mysqli->errno ){
        echo "Fail to connect database! <br>";
        exit();
    }
?>
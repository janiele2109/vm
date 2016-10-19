<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";
    
	session_start();
	
	$username = $_POST[ 'username' ];
	$pass = $_POST[ 'password' ];	

    $query = 'SELECT * from users WHERE username = "' . $username . '" AND password = "' . $pass . '"';

    $result = $mysqli->query( $query, MYSQLI_STORE_RESULT );

    if ( mysqli_num_rows( $result ) )
    {
		$_SESSION[ "loginSuccess" ] = true;
        $_SESSION[ "username" ] = $username;
    }
    else
    {    	
    	$_SESSION[ "loginSuccess" ] = false;
    }

    header ( "Location: /index.php" );
?>
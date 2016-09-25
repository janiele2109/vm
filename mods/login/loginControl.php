<?php
    include_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";
    
	session_start();
	
	$username = $_POST[ 'username' ];
	$pass = $_POST[ 'password' ];	

    $query = 'SELECT * from users WHERE username = \'' . $username . '\' AND password = \'' . $pass . '\'';

    $result = $mysqli->query( $query, MYSQLI_STORE_RESULT );

    if( mysqli_num_rows( $result ) )
    {
    	echo "Login successfully! <br>";
    	echo "username: " . $username . "<br>";
		echo "password: " . $pass . "<br>";
		$_SESSION[ "loginSuccess" ] = true;
        $_SESSION[ "username" ] = $username;
    }
    else
    {
    	echo "Login failed! Invalid username or password <br>";
    	$_SESSION[ "loginSuccess" ] = false;
    }

    header ( "Location: ./../../index.php" );
?>
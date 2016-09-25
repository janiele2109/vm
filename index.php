<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config/app.config.php";

$username = "guest";
$loginSuccess = false;

session_start();

if ( isset( $_SESSION[ "loginSuccess" ] ) && $_SESSION[ "loginSuccess" ] )
{
	$username = $_SESSION[ "username" ];
	$loginSuccess = true;
}
?>

<?php
if ( $loginSuccess == true )
{
	require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/wordlist.php";
}
else
{
	require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/login/login.php";

	if ( isset( $_SESSION[ "loginSuccess" ] ) && !( $_SESSION[ "loginSuccess" ] ) )
		echo "<span class='loginErr'>Login failed! Invalid username or password </span><br>";
}
?>
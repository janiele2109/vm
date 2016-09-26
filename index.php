<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config/app.config.php";

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
	if( !isset( $_POST[ "menuItem" ] ) || $_POST[ "menuItem" ] != "myWord" )
		require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/wordlist.php";
	else
		require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/word/word.php";
}
else
{
	require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/login/login.php";

	if ( isset( $_SESSION[ "loginSuccess" ] ) && !( $_SESSION[ "loginSuccess" ] ) )
		echo "<span class='Err loginErr'>Login failed! Invalid username or password </span><br>";
}
?>
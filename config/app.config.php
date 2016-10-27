<?php
	session_set_cookie_params( 0 );

	$username = 'guest';
	$loginSuccess = false;

	if ( isset( $_POST[ 'username' ] ) && $_POST[ 'username' ] )
	{
		$username = $_POST[ 'username' ];
		$loginSuccess = true;
	}
?>
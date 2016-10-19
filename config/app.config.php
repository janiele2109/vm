<?php
	session_set_cookie_params( 0 );

	$username = 'guest';
	$loginSuccess = false;

	function getLoginInfo()
	{
		if ( isset( $_POST[ 'userName' ] ) && $_POST[ 'userName' ] )
		{
			$username = $_POST[ 'userName' ];
			$loginSuccess = true;
		}
	}
?>
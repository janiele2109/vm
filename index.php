<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/app.config.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';

	session_start();

	if ( isset( $_SESSION[ 'loginSuccess' ] ) && $_SESSION[ 'loginSuccess' ] ) {
		$username = $_SESSION[ 'username' ];
		$loginSuccess = true;
	}

	if ( $loginSuccess == true ) {
		if ( $_SERVER[ 'REQUEST_URI' ] == '/' || $_SERVER[ 'REQUEST_URI' ] == '/index.php' )
			require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/test/test.php';
	}
	else
	{
		require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/login/login.php';

		if ( isset( $_SESSION[ 'loginSuccess' ] ) && $_SESSION[ 'loginSuccess' ] )
			echo '<span class="err loginErr">' . constant( '5001' ) . '</span><br>';
	}
?>
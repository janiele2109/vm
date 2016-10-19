<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';

	function checkActive( $menuItem ) {

		if ( !isset( $_POST[ 'menuItem' ] ) && $menuItem == constant( 'menuItemTest' ) )
			echo 'class="active"';

		else if ( isset( $_POST[ 'menuItem' ] ) && $_POST[ 'menuItem' ] == $menuItem )
			echo 'class="active"';
	}
?>
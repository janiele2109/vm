<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';

	function checkActive( $menuItem ) {

		if( $menuItem == constant( 'menuItemTest' ) )
			if( ( !isset( $_POST[ 'menuItem' ] ) || $_POST[ 'menuItem' ] == constant( 'menuItemTest' ) ) )
				echo 'class="active"';

		else if( isset( $_POST[ 'menuItem' ] ) && $_POST[ 'menuItem' ] == $menuItem )
				echo 'class="active"';
	}
?>
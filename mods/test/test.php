<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/app.config.php';

	if ( isset( $_POST[ 'userName' ] ) && $_POST[ 'userName' ] )
	{
		$username = $_POST[ 'userName' ];
		$loginSuccess = true;
	}
?>

<!DOCTYPE html>
<html lang = 'en'>

<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/inc/head.php';
?>

<body OnLoad = 'history.pushState( "", document.title, "/test" );'>
	<?php
		require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/inc/header.php';
	?>

	<div class = 'content'>
		<?php
			require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/nav/nav.php';
			require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/test/testForm.php';
		?>
	</div>

	<footer>
	</footer>
</body>
</html>
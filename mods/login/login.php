<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config/app.config.php";
?>

<!DOCTYPE html>
<html lang="en">
<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/inc/head.php";
?>
<body>
	<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/inc/header.php";
	?>

	<div class="content">
		<?php
		require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/login/loginForm.php";
		?>
	</div>
	<footer>
	</footer>
</body>
</html>
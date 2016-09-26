<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config/app.config.php";
?>

<!DOCTYPE html>
<html lang="en">
<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/inc/head.php";
?>
<body OnLoad='document.getElementById("addNewWordTextBox").focus(); history.pushState("", document.title, "/myword");'>
	<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/inc/header.php";
	?>

	<div class="content">
		<?php
		require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/nav/nav.php";
		require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/word/wordForm.php";
		?>
	</div>
	<footer>
	</footer>
</body>
</html>
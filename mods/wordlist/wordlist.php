<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config/app.config.php";

if ( isset( $_POST[ "userName" ] ) && $_POST[ "userName" ] )
{
	$username = $_POST[ "userName" ];
	$loginSuccess = true;
}
?>

<!DOCTYPE html>
<html lang="en">
<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/inc/head.php";
?>
<body OnLoad='document.getElementById("addNewWordlistTextBox").focus(); history.pushState("", document.title, "/wordlist");'>
	<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/inc/header.php";
	?>

	<div class="content">
		<?php
		require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/nav/nav.php";
		require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/wordlistForm.php";
		?>
	</div>
	<footer>
	</footer>
</body>
</html>
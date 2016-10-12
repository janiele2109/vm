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
<body OnLoad='document.getElementById("testBtn").focus(); history.pushState("", document.title, "/test"); $("#testForm").css("display", "none");'>
	<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/inc/header.php";
	?>

	<div class="content">
		<?php
		require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/nav/nav.php";
		require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/test/testForm.php";
		?>
		<b><div id="msg" style="display:none; margin:auto; margin-top: 10px; width: 200px; height: 100px">&nbsp;</div></b>
		<button id='testBtn' style='display: block; margin:auto; width: 400px; height: 100px; margin-top: 200px'>Test</button>
	</div>
	<footer>
	</footer>
</body>
</html>
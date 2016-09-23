<?php
	require_once "./config/app.config.php";

	$username = "guest";
	$loginSuccess = false;

	session_start();

	if ( isset( $_SESSION[ "loginSuccess" ] ) && $_SESSION[ "loginSuccess" ] )
	{
		$username = $_SESSION[ "username" ];
		$loginSuccess = true;
	}
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="stylesheet" type="text/css" href="./css/main.css">

	<title>Welcome to English Helper</title>
</head>
<body>
	<header>
		<span class="title">English Helper</span>
		<span class="welcomeText">Welcome <?php echo $username; ?>!</span>
	</header>

	<div class="content">
		<?php
			if ( $loginSuccess == true )
			{
				include "./mods/wordlist/wordlistForm.php";
			}
			else
				include "./mods/login/loginForm.php"
		?>
	</div>
	<footer>
	</footer>
</body>
</html>
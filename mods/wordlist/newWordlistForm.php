<form>
	Wordlist title
	<input type="text" name="wordlistTitle" size="30" maxlength="30"></input>
	<button type="submit" formmethod="post" name="AddWL">Add</button>
	
	<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/wordlistControl.php";
	?>
</form>
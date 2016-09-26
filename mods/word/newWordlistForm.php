<form>
	Wordlist title
	<input id="addNewWordlistTextBox" type="text" name="wordlistTitle" size="30" maxlength="30"></input>
	<button id="addNewWordlistBtn" type="submit" formmethod="post" name="AddWL">Add</button>
	
	<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/wordlistControl.php";
	?>
</form>
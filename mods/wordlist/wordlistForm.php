<nav>
	<ul>
		<li><a href="#">My wordlist</a></li>
	</ul>
</nav>

<form>
	<button type="submit" name="addNewWordlist" formmethod="post">Add new wordlist</button>
	<button type="submit" name="delNewWordlist" formmethod="post" form="wordListView">Delete selected wordlist</button>
	<button type="submit" name="UpdateAllWordlist" formmethod="post" form="wordListView">Update selected wordlist</button>
</form>

<?php
	require_once "./mods/wordlist/wordlistControl.php";
	
	if( isset($_POST[ "addNewWordlist" ]) )
	{
		require_once "./mods/wordlist/newWordlistForm.php";
	}
?>

<form id="wordListView">
<table>
	<tr>
		<td><input type="checkbox" id="select_all" /></td>
		<td>Wordlist Title</td>
		<td style="width: 100px; text-align: center; margin: 0; padding: 0;"></td>
		<?php require_once "./mods/wordlist/wordlistView.php"; ?>
	</tr>
</table>
</form>
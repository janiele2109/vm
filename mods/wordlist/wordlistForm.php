<?php		
require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/newWordlistForm.php";		
?>

<button id="delAllWordlist">Delete selected wordlist</button>
<button type="submit" id="UpdateAllWordlist" name="UpdateAllWordlist" formmethod="post" form="wordListView">Update selected wordlist</button>

<form id="wordListView" action="/mods/wordlist/wordlistControl.php">
	<table>
		<tr>
			<td><input type="checkbox" id="select_all" /></td>
			<td class ='wordlist'>Wordlist Title</td>
			<td style="width: 100px; text-align: center; margin: 0; padding: 0;"></td>
			<?php 
			require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/wordlistView.php"; 
			?>
		</tr>
	</table>
</form>
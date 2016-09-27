<?php		
require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/newWordlistForm.php";		
?>

<button id="delSelectedWordLists">Delete selected wordlist</button>
<button id="updateSelectedWordLists">Update selected wordlist</button>

<table id="tbWordlistView">
	<tr>
		<td><input type="checkbox" id="select_all" /></td>
		<td class ='wordlist'>Wordlist Title</td>
		<td style="width: 100px; text-align: center; margin: 0; padding: 0;"></td>
	</tr>
	
	<?php 
	require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/wordlistView.php"; 
	?>
</table>
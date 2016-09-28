<?php		
require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/newWordlistForm.php";		
?>

<button id="delSelectedWordLists">Delete selected wordlists</button>
<button id="updateSelectedWordLists">Update selected wordlists</button>

<b><div id="msg" style="margin-bottom: 10px;">&nbsp;</div></b>

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
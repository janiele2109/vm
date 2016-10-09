<?php		
require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/word/newWordForm.php";		
?>

<button id="delSelectedWords">Delete selected words</button>
<button id="updateSelectedWords">Update selected words</button>

<b><div id="msg" style="margin-bottom: 10px;">&nbsp;</div></b>

<table id="tbWordView">
	<tr>
		<td><input type="checkbox" id="select_all" /></td>
		<td class ='word'>Word Title</td>
		<td class ='pronunciation'>Pronunciation</td>
		<td class ='wordlist'>Wordlist</td>
		<td class ='meaning'>Meaning</td>
		<td style="width: 100px; text-align: center; margin: 0; padding: 0;"></td>
	</tr>
	
	<?php 
	require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/word/wordView.php"; 
	?>
</table>
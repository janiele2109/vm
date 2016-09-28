<?php		
require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/word/newWordForm.php";		
?>

<button id="delSelectedWord">Delete selected word</button>
<button id="updateSelectedWord">Update selected word</button>

<table id="tbWordView">
	<tr>
		<td><input type="checkbox" id="select_all" /></td>
		<td class ='word'>Word Title</td>
		<td class ='wordlist'>Wordlist</td>
		<td style="width: 100px; text-align: center; margin: 0; padding: 0;"></td>
	</tr>
	
	<?php 
	require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/word/wordView.php"; 
	?>
</table>
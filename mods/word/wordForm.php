<?php		
require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/word/newWordForm.php";		
?>

<button type="submit" name="delNewWord" formmethod="post" form="wordList">Delete selected word</button>
<button type="submit" name="UpdateAllWord" formmethod="post" form="wordList">Update selected word</button>

<form id="wordList">
	<table>
		<tr>
			<td><input type="checkbox" id="select_all" /></td>
			<td class ='word'>Word</td>
			<td style="width: 100px; text-align: center; margin: 0; padding: 0;"></td>
			<?php 
			require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/word/wordView.php"; 
			?>
		</tr>
	</table>
</form>
<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/newWordForm.php';
?>

<div class = 'wordBtnCtrls'>
	<button id = 'delSelectedWordsBtn'>Delete selected words</button>
	<button id = 'updateSelectedWordsBtn'>Update selected words</button>
</div>

<select id = 'hiddenWordlistCb' class = 'hiddenWordlistCbCls'></select>

<div id = 'msgDiv' class = 'displayMsg'>&nbsp;</div>

<table id = 'wordViewTbl'>
	<tr>
		<td><input type = 'checkbox' id = 'selectAllChkbox'/></td>
		<td class = 'word'>Word Title</td>
		<td class = 'partOfSpeech'>Word class</td>
		<td class = 'pronunciation'>Pronunciation</td>
		<td class = 'wordlist'>Wordlist</td>
		<td class = 'meaning'>Meaning</td>
		<td class = 'example'>Example</td>
		<td class = 'updateBtn'></td>
	</tr>

	<?php
		require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/wordView.php';
	?>
</table>
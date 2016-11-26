<div id = 'wordForm'>

	<?php
		require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/newWordForm.php';
	?>

	<span class = 'required'>(*): Required</span>

	<div class = 'wordBtnCtrls'>
		<button id = 'delSelectedWordsBtn'>Delete selected words</button>
		<button id = 'updateSelectedWordsBtn'>Update selected words</button>
	</div>

	<select id = 'hiddenWordlistCb' class = 'hiddenWordlistCbCls'></select>

	<div id = 'msgDiv' class = 'displayMsg'>&nbsp;</div>

	<div class = 'pageDiv'>
		<button id = 'firstPage'> << First</button>
		<button id = 'prevPage'> < Prev</button>
		<input id = 'curPage' type = 'text' size = '3' maxlength = '3' value = 1 />
		<span> / </span>
		<span id = 'totalPage'>&nbsp;</span>
		<button id = 'nextPage'>Next ></button>
		<button id = 'lastPage'> Last >></button>
	</div>

	<table id = 'wordViewTbl'>
		<tr>
			<td><input type = 'checkbox' id = 'selectAllChkbox'/></td>
			<td class = 'word'>Word Title</td>
			<td class = 'partOfSpeech'>Word class</td>
			<td class = 'pronunciation'>Pronunciation</td>
			<td class = 'wordlist'>Wordlist</td>
			<td class = 'meaning'>Meaning</td>
			<td class = 'nativemeaning'>Native meaning</td>
			<td class = 'example'>Example</td>
			<td class = 'updateBtn'></td>
		</tr>

		<?php
			require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/wordView.php';
		?>
	</table>
</div>
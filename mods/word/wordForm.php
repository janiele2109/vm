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

	<div class = 'searchDiv'>
		<input type = 'checkbox' name = 'group' id = 'enableSearch'/>
		<label for = 'enableSearch' class = 'noselect'>Enable search</label>
	</div>

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
			<td class = 'word'><span id = 'searchWordSpan'>Word Title</span></td>
			<td class = 'partOfSpeech'><span id = 'searchPartOfSpeechSpan'>Word class</span></td>
			<td class = 'pronunciation'>Pronunciation</td>
			<td class = 'wordlist'><span id = 'searchWordlistSpan'>Wordlist</span></td>
			<td class = 'meaning'>Meaning</td>
			<td class = 'nativemeaning'><span id = 'searchNativeMeaningSpan'>Native meaning</span></td>
			<td class = 'example'>Example</td>
			<td class = 'updateBtn'></td>
		</tr>

		<?php
			require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/wordView.php';
		?>
	</table>
</div>
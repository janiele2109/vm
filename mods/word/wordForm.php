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
		<input type = 'checkbox' name = 'group' id = 'enableWordSearch'/>
		<label for = 'enableWordSearch' class = 'noselect'>Enable search</label>
	</div>

	<div class = 'wordEnableEditting'>
		<input type = 'checkbox' name = 'group' id = 'enableEditting'/>
		<label for = 'enableEditting' class = 'noselect'>Enable editting</label>
	</div>

	<div class = 'wordPageDiv'>
		<span>+ Total words: </span>
		<span id = 'totalWordsSpan' class = 'totalWord'></span>

		<span>+ Total word meanings: </span>
		<span id = 'totalWordMeaningsSpan' class = 'totalWordMeanings'></span>

		<span>+ Words in current page: </span>
		<span id = 'wordsCurrentPageSpan' class = 'wordsCurrentPageSpan'></span>

		<button id = 'wordFirstPage'> << First</button>
		<button id = 'wordPrevPage'> < Prev</button>
		<input id = 'wordCurPage' type = 'text' size = '3' maxlength = '3' value = 1 />
		<span> / </span>
		<span id = 'wordTotalPage'>&nbsp;</span>
		<button id = 'wordNextPage'>Next ></button>
		<button id = 'wordLastPage'> Last >></button>
	</div>

	<table id = 'wordViewTbl'>
		<tr>
			<td><input type = 'checkbox' id = 'selectAllChkbox'/></td>
			<td class = 'word'><span class = 'searchItem' id = 'searchWordSpan'>Word Title</span></td>
			<td class = 'partOfSpeech'><span class = 'searchItem' id = 'searchPartOfSpeechSpan'>Word class</span></td>
			<td class = 'pronunciation'>Pronunciation</td>
			<td class = 'wordlist'><span class = 'searchItem' id = 'searchWordlistSpan'>Wordlist</span></td>
			<td class = 'meaning'>Meaning</td>
			<td class = 'nativemeaning'><span class = 'searchItem' id = 'searchNativeMeaningSpan'>Native meaning</span></td>
			<td class = 'example'>Example</td>
			<td class = 'updateBtn'></td>
		</tr>

		<?php
			require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/wordView.php';
		?>
	</table>
</div>
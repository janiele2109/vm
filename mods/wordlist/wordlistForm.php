<div id = 'wordlistForm'>

	<?php
		require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/wordlist/newWordlistForm.php';
		require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/app.config.php';
	?>

	<span class = 'required'>(*): Required</span><br/>

	<div class = 'wordlistBtnCtrls'>
		<button id = 'delSelectedWordListsBtn'>Delete selected wordlists</button>
		<button id = 'updateSelectedWordListsBtn'>Update selected wordlists</button>
	</div>

	<div id = 'msgDiv' class = 'displayMsg'>&nbsp;</div>

	<div class = 'wordlistEnableEditting'>
		<input type = 'checkbox' name = 'group' id = 'enableEditting'/>
		<label for = 'enableEditting' class = 'noselect'>Enable editting</label>
	</div>

	<div class = 'wordlistEnableSearching'>
		<input type = 'checkbox' name = 'group' id = 'enableWordlistSearch'/>
		<label for = 'enableWordlistSearch' class = 'noselect'>Enable search</label>
	</div>

	<div class = 'wordlistPageDiv'>
		<span>+ Total wordlists: </span>
		<span id = 'totalWordlistsSpan' class = 'totalWordlist'></span>

		<span>+ Wordlists in current page: </span>
		<span id = 'wordlistsCurrentPageSpan' class = 'wordlistsCurrentPageSpan'></span>

		<button id = 'wordlistFirstPage'> << First</button>
		<button id = 'wordlistPrevPage'> < Prev</button>
		<input id = 'wordlistCurPage' type = 'text' size = '3' maxlength = '3' value = 1 />
		<span> / </span>
		<span id = 'wordlistTotalPage'>&nbsp;</span>
		<button id = 'wordlistNextPage'>Next ></button>
		<button id = 'wordlistLastPage'> Last >></button>
	</div>

	<table id = 'wordlistViewTbl'>
		<tr>
			<td><input type = 'checkbox' id = 'selectAllChkbox'/></td>
			<td class = 'wordlist'><span class = 'searchItem' id = 'searchWordlistNameSpan'>Wordlist Title</span></td>
			<td class = 'wlTotalWords'>Total words</td>
			<td class = 'wlTotalWordMeanings'>Total word meanings</td>
			<td class = 'wlScore'>Score</td>
			<td class = 'updateBtn'></td>
		</tr>

		<?php
			require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/wordlist/wordlistView.php';
		?>
	</table>
</div>
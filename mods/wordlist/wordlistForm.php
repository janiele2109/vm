<div id = 'wordlistForm'>

	<?php
		require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/wordlist/newWordlistForm.php';
		require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/app.config.php';
	?>

	<div class = 'wordlistBtnCtrls'>
		<button id = 'delSelectedWordListsBtn'>Delete selected wordlists</button>
		<button id = 'updateSelectedWordListsBtn'>Update selected wordlists</button>
	</div>

	<div id = 'msgDiv' class = 'displayMsg'>&nbsp;</div>

	<table id = 'wordlistViewTbl'>
		<tr>
			<td><input type = 'checkbox' id = 'selectAllChkbox'/></td>
			<td class = 'wordlist'>Wordlist Title</td>
			<td class = 'updateBtn'></td>
		</tr>

		<?php
			require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/wordlist/wordlistView.php';
		?>
	</table>
</div>
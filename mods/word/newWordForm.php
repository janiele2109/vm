<form>
	<span class = 'wordTitle'>Word title <span class = 'required'>(*)</span> </span>

	<input id = 'addNewWordTextBox' type = 'text' size = '30' maxlength = '30' tabindex = '1'/>

	<span class = 'belongToWordlist'>belong to wordlist</span>

	<select id = 'wordlistCb' class = 'wordlistCb' tabindex = '2'>

		<?php
			require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';
			require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/app.config.php';

			$query = 'SELECT wl.wordlistId, wl.wordlistName
					  FROM wordlist wl
					  INNER JOIN users u
					  ON wl.userId = u.userId
					  WHERE u.userName = "' . $username .
					  '" ORDER BY wordlistName';

			if ( $result = $mysqli->query( $query ) )
			{
				while ( $row = mysqli_fetch_row( $result ) )
				{
					echo '<option value = "' . $row[ 0 ] . '">' . $row[ 1 ] . '</option>';
				}

				mysqli_free_result( $result );
			}
		?>

	</select>

	<div class = 'enableEditting'>
		<input type = 'checkbox' name = 'group' id = 'enableEditting'/>
		<label for = 'enableEditting' class = 'noselect'>Enable editting</label>
	</div><br/>

	<span class = 'wordClassSpan'>Word class</span>

	<select id = 'wordClassCb' class = 'wordClassCb' tabindex = '3'>
		<option value = 'noun'>noun</option>
		<option value = 'verb'>verb</option>
		<option value = 'adjective'>adjective</option>
		<option value = 'adverb'>adverb</option>
		<option value = 'pronoun'>pronoun</option>
		<option value = 'preposition'>preposition</option>
		<option value = 'conjunction'>conjunction</option>
		<option value = 'determiner'>determiner</option>
		<option value = 'exclamation'>exclamation</option>
	</select>

	<span class = 'pronunciationSpan'>Pronunciation <span class = 'required'>(*)</span> </span>

	<input id = 'pronunciationTextBox' type = 'text' size = '30' maxlength = '30' tabindex = '4'/><br/>

	<p>
		<span class = 'meaningSpan'>Meaning <span class = 'required'>(*)</span> </span>

		<textarea id = 'meaningTextArea' placeholder = 'Meaning...' rows = '4' cols = '50' class = 'meaningTextArea' tabindex = '5'></textarea>

		<button type = 'submit' id = 'addNewWordBtn' class = 'addNewWordBtn'>Add</button>
	</p>

	<p>
		<span class = 'nativeMeaningSpan'>Native meaning <span class = 'required'>(*)</span> </span>

		<textarea id = 'nativemeaningTextArea' placeholder = 'Meaning in native language...' rows = '4' cols = '50' class = 'nativemeaningTextArea' tabindex = '6'></textarea>
	</p>

	<p>
		<span>Example <span class = 'required'>(*)</span> </span>

		<textarea id = 'exampleTextArea' placeholder = 'Example...' rows = '4' cols = '50' class = 'exampleTextArea' tabindex = '7'></textarea>
	</p>

</form>
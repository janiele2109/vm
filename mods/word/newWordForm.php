<form>
	<span class = 'wordTitle'>Word title</span>

	<input id = 'addNewWordTextBox' type = 'text' size = '30' maxlength = '30'/>

	<span class = 'belongToWordlist'>belong to wordlist</span>

	<select id = 'wordlistCb' class = 'wordlistCb'>

		<?php
			require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';

			$query = 'SELECT *
					  FROM wordlist
					  ORDER BY wordlistName';

			if ( $result = $mysqli->query( $query ) )
			{
				while ( $row = mysqli_fetch_row( $result ) )
				{
					echo '<option value = "' . $row[ 0 ] . '">' . $row[ 1 ] . '</option>';
				}

				mysqli_free_result( $result );
			}
		?>

	</select><br/>

	<span class = 'wordClassSpan'>Word class</span>

	<select id = 'wordClassCb' class = 'wordClassCb'>
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

	<span class = 'pronunciationSpan'>Pronunciation</span>

	<input id = 'pronunciationTextBox' type = 'text' size = '30' maxlength = '30'/><br/>

	<p>
		<span class = 'meaningSpan'>Meaning</span>

		<textarea id = 'meaningTextArea' placeholder = 'Meaning...' rows = '4' cols = '50' class = 'meaningTextArea'></textarea>

		<button type = 'submit' id = 'addNewWordBtn' class = 'addNewWordBtn'>Add</button>
	</p>

	<p>
		<span class = 'exampleSpan'>Example</span>

		<textarea id = 'exampleTextArea' placeholder = 'Example...' rows = '4' cols = '50' class = 'exampleTextArea'></textarea>
	</p>

</form>
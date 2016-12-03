<div id = 'testForm' class = 'testForm'>
	<div class = 'toggleTestForm'>
		<form>
			<div class = 'testOptions'>
			    <input type = 'checkbox' name = 'group' id = 'displayPron'/>
		    	<label for = 'displayPron' class = 'noselect'>Display pronunciation</label>

		    	<input type = 'checkbox' name = 'group' id = 'displayExample'/>
		    	<label for = 'displayExample' class = 'noselect'>Display example</label>

		    	<input type = 'checkbox' name = 'group' id = 'displayNativeMeaning'/>
		    	<label for = 'displayNativeMeaning' class = 'noselect'>Display native meaning</label>
			</div>

			<div class = 'cntNumberLabel'>
				<span>Tested/Total: </span>
				<span id = 'cntNumber'></span>
				<span> -- Corrected/Total: </span>
				<span id = 'correctedRate'></span>
			</div>

			<div class = 'meaningDescription'>
				<span class = 'meaningLabel'>Meaning</span>
				<span id = 'wordClassSpan' class = 'wordClassSpan'></span>:
				<span id = 'meaningSpan' data-wordId = '' data-word = '' data-partOfSpeech = '' data-wordlistName = '' data-pronunciation = ''></span>
			</div>

			<input id = 'inputWord' type = 'text' autocomplete = 'off' size = '50' maxlength = '50' class = 'inputWord'/><br/>
			<span id = 'pronunciationSpan' class = 'pronunciationSpan'></span><br/>
			<button type = 'submit' id = 'checkWordBtn'>Check</button>
			<button id = 'showWordBtn'>Show word</button>
			<button id = 'nextWordBtn'>Next</button>
			<button id = 'retestBtn'>Retest</button>
		</form>

		<span id = 'resultSpan' class = 'resultSpan'></span>

		<div id = 'nativeMeaningDiv' class = 'nativeMeaningDiv'>
			<b><span>Native meaning: </span></b><br/>
		</div>

		<div id = 'exampleDiv' class = 'exampleDiv'>
			<b><span>Example: </span></b><br/>
		</div>
	</div>

	<div class = 'testPage'>
		<b><span id = 'msgDiv'></span></b>
	</div>

	<div class = 'testingWordlist' id = 'testingWordlist'>
		<span class = 'belongToWordlist'>Choose wordlist for testing</span>
		<select id = 'testingWordlistCb' class = 'wordlistCb' tabindex = '1'>

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

			<option value = 'allWordlists' selected>All wordlists</option>
		</select>
	</div>

	<button id = 'testBtn'  tabindex = '2' style = 'display: block;	margin:auto;width: 400px;height: 100px;margin-top: 50px'>Test</button>

	<span class = 'hiddenFields' id = 'startOffset'>0</span>
	<span class = 'hiddenFields' id = 'curTestWordIndex'>0</span>
	<span class = 'hiddenFields' id = 'totalWordNum'>0</span>
</div>
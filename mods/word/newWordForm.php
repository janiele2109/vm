<form>
	<span style="margin-right: 10px">Word title</span>
	<input id="addNewWordTextBox" type="text" size="30" maxlength="30"></input>
	<span style="margin-left: 10px; margin-right: 10px">belong to wordlist</span>
	<select id="wordlistCb" style="width: 200px;">

		<?php
		require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

		$query = "SELECT * FROM wordlist ORDER BY wordlistName";

		if ( $result = $mysqli->query( $query ) )
		{
			while ( $row = mysqli_fetch_row( $result ) )
			{
				echo '<option value="' . $row[0] . '">' . $row[1] . '</option>';
			}

			mysqli_free_result($result);
		}
		?>

	</select>
	<span style="margin-left: 10px; margin-right: 10px">Pronunciation</span>
	<input id="pronunciationTextBox" type="text" size="30" maxlength="30"></input>
	<br/>
	<p>
		<span style="margin-right: 10px">Meaning</span>
		<textarea id="meaningTextArea" placeholder="Meaning..." rows="4" cols="50" style="margin-left: 7px; vertical-align: top;"></textarea> 
		<button type="submit" id="addNewWordBtn" style="width:200px; height: 60px;margin-left: 15px;">Add</button>
	</p>
</form>
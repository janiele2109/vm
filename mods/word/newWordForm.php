<form>
	Word title
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
	<button type="submit" id="addNewWordBtn">Add</button>
</form>
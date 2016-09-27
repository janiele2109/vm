<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	$query = "SELECT wordlistName FROM wordlist ORDER BY wordlistName";

	if ( $result = $mysqli->query( $query ) )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{
			echo "<tr class='dynRowWordList'>" .
					"<td><input type='checkbox' class='checkbox' name='wordList[]' value='old:" . $row[0] . ";new:" . $row[0] . "' id='chk-" . $row[0] . "'/></td>
					<td name='wordlist'><span id='" . $row[0] . "'class ='wordlist'>" . $row[0] . "</span></td>
					<td><button class='UpdateWordlistBtn' id='UpdateWordlistBtn-" . $row[0] . "' value='old:" . $row[0] . ";new:" . $row[0] . "'>Update</button></td>
				</tr>";
		}

		mysqli_free_result($result);
	}
?>
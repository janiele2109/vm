<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	$query = "SELECT wordlistName FROM wordlist ORDER BY wordlistName";

	if ( $result = $mysqli->query( $query ) )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{
			echo "<tr class='dynRowWordList'>" .
					"<td><input id='chk-wordlist-wordlistId-" . $row[0] . "' name='wordList[]' class='checkbox' type='checkbox' value='oldWordlistId:" . $row[0] . ";newWordlistId:" . $row[0] . "'/></td>
					<td name='wordlist'><span id='span-wordlist-wordlistId-" . $row[0] . "'class ='wordlist'>" . $row[0] . "</span></td>
					<td name='btnUpdateWordlist'><button id='updateWordlistBtn-wordlist-wordlistId-" . $row[0] . "' class='updateWordlistBtn' value='oldWordlistId:" . $row[0] . ";newWordlistId:" . $row[0] . "'>Update</button></td>
				</tr>";
		}

		mysqli_free_result($result);
	}
?>
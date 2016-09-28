<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	$query = "SELECT wordId, word.wordlistId, word, wordlistName FROM word, wordlist WHERE word.wordlistId = wordlist.wordlistId ORDER BY word";

	if ( $result = $mysqli->query( $query ) )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{
			echo "<tr class='dynRowWord'>" .
					"<td><input id='chk-word-wordId-" . $row[0] . "-wordlistId-" . $row[1] . "' name='word[]' class='checkbox' type='checkbox' value='oldWordId:" . $row[0] . ";newWordId:" . $row[0] . ";oldWordlistId:" . $row[1] . ";newWordlistId:" . $row[1] . "'/></td>
					<td name='word'><span id='span-word-wordId-" . $row[0] . "'class ='word'>" . $row[2] . "</span></td>
					<td name='wordlist'><span id='span-word-wordlistId-" . $row[1] . "'class ='wordlist'>" . $row[3] . "</span></td>
					<td name='btnUpdateWord'><button id='updateWordBtn-word-wordId-" . $row[0] . "-wordlistId-" . $row[1] . "' class='updateWordBtn' value='oldWordId:" . $row[0] . ";newWordId:" . $row[0] . ";oldWordlistId:" . $row[1] . ";newWordlistId:" . $row[1] . "'>Update</button></td>
				</tr>";
		}

		mysqli_free_result($result);
	}
?>
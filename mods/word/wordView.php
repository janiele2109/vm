<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	$query = "SELECT wordId, word.wordlistId, word, wordlistName FROM word, wordlist WHERE word.wordlistId = wordlist.wordlistId ORDER BY word";

	if ( $result = $mysqli->query( $query ) )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{
			echo "<tr class='dynRowWord'>" .
					"<td><input id='chk-wordId:" . $row[0] . ";wordlistId:" . $row[1] . "' name='word[]' class='checkbox' type='checkbox' value=''/></td>
					<td name='word'><span id='word-wordId:" . $row[0] . ";wordlistId:" . $row[1] . "'class ='word'>" . $row[2] . "</span></td>
					<td name='wordlist'><span id='wordlist-wordId:" . $row[0] . ";wordlistId:" . $row[1] . "' class ='word'>" . $row[3] . "</span></td>
					<td><button id='updateWordBtn-wordId:" . $row[0] . ";wordlistId:" . $row[1] . "' class='UpdateWordBtn' value=''>Update</button></td>
				</tr>";
		}

		mysqli_free_result($result);
	}
?>
<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	$query = "SELECT word FROM word ORDER BY word";

	if ( $result = $mysqli->query( $query ) )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{
			echo "<tr>" .
					"<td><input type='checkbox' class='checkbox' name='words[]' value='old:" . $row[0] . ";new:" . $row[0] . "' id='chk-" . $row[0] . "'/></td>
					<td class ='word'><span class ='word' id='" . $row[0] . "' name='" . $row[0] . "'>" . $row[0] . "</span></td>
					<td><button class='UpdateWordlistBtn' id='UpdateWordlistBtn-" . $row[0] . "' value='old:" . $row[0] . ";new:" . $row[0] . "'>Update</button></td>
				</tr>";
		}

		mysqli_free_result($result);
	}
?>
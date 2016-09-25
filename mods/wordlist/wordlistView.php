<?php
	include_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	$query = "SELECT wordlistName FROM wordlist ORDER BY wordlistName";

	if ( $result = $mysqli->query( $query ) )
	{
		$count = 0;

		while ( $row = mysqli_fetch_row( $result ) )
		{
			$count++;

			echo "<tr>" .
					"<td><input type='checkbox' class='checkbox' name='words[]' value='" . $row[0] . "'/></td>
					<td><span class ='word' id='" . $row[0] . "' name='" . $row[0] . "'>" . $row[0] . "</span></td>
					<td><button type='submit' name='UpdateWordlist' formmethod='post' value='" . $row[0] . "'>Update</button></td>
				</tr>";
		}

		mysqli_free_result($result);
	}
?>
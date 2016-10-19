<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';

	global $mysqli;

	$query = 'SELECT wordlistName
			  FROM wordlist
			  ORDER BY wordlistName';

	if ( $result = $mysqli->query( $query ) )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{
			echo '<tr class="dynRowWordList">' .
					'<td><input name="wordList[]" type="checkbox"/></td>' .
					'<td class="toggleEnabled"><span class="wordlist" data-controltranstype="input-text" data-sourcewordlistname="' . $row[ 0 ] . '">' . $row[ 0 ] . '</span></td>' .
					'<td><button class="updateWordlistNameBtn">Update</button></td>' .
				 '</tr>';
		}

		mysqli_free_result( $result );
	}
?>
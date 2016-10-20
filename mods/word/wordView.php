<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';

	global $mysqli;

	$query = "SELECT w.word,
					 w.partOfSpeech,
					 w.pronunciation,
					 wl.wordlistName,
					 wm.meaning,
					 wm.wordMeaningId
			  FROM word w
			  INNER JOIN wordlist wl
			  ON w.wordlistId = wl.wordlistId
			  INNER JOIN wordMeaning wm
			  ON w.wordId = wm.wordId
			  ORDER BY w.word";

	if ( $result = $mysqli->query( $query ) )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{
			echo '<tr class = "dynRowWord">' .
					'<td><input name = "word[]" type = "checkbox"/></td>' .
					'<td class = "toggleEnabled"><span class = "word" data-controltranstype = "input-text" data-sourceword = "' . $row[ 0 ] . '">' . $row[ 0 ] . '</span></td>' .
					'<td class = "toggleEnabled"><span class = "partOfSpeech" data-controltranstype = "select" data-sourcepos = "' . $row[ 1 ] . '">' . $row[ 1 ] . '</span></td>' .
					'<td class = "toggleEnabled"><span class = "pronunciation" data-controltranstype = "input-text" data-sourcepron = "' . $row[ 2 ] . '">' . $row[ 2 ] . '</span></td>' .
					'<td class = "toggleEnabled"><span class = "wordlist" data-controltranstype = "select" data-sourcewordlistname = "' . $row[ 3 ] . '">' . $row[ 3 ] . '</span></td>' .
					'<td class = "toggleEnabled"><span class = "meaning" data-controltranstype = "textarea" data-sourcemeaning = "' . $row[ 4 ] . '">' . $row[ 4 ] . '</span></td>' .
					'<td class = "exampleTd">';

			$query = 'SELECT we.wordExampleId, we.example
					  FROM wordexample we
					  INNER JOIN wordmeaning wm
					  ON we.wordMeaningId = wm.wordMeaningId
					  WHERE wm.wordMeaningId = "' . $row[ 5 ] . '"
					  ORDER BY we.example';

			if ( $wordExamples = $mysqli->query( $query ) )
			{
				while ( $example = mysqli_fetch_row( $wordExamples ) )
				{
					echo '<div class = "exampleEntry transEffect" data-exId = "ex_' . $example[ 0 ] . '" data-controltranstype = "button" data-sourceexample = "' . $example[ 1 ] . '">' . $example[ 1 ] . '</div><br/>';
				}

				mysqli_free_result( $wordExamples );
			}

			echo 	'</td>' .
				 	'<td><button class="updateWordBtn">Update</button></td>' .
				 '</tr>';
		}

		mysqli_free_result( $result );
	}
?>
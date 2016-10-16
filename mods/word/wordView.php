<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

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

	$result = $mysqli->query( $query );

	if ( $result )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{

			$query = 'SELECT we.wordExampleId, we.example
					  FROM wordexample we
					  INNER JOIN wordmeaning wm
					  ON we.wordMeaningId = wm.wordMeaningId 
					  WHERE wm.meaning = "' . $row[4] . '"
					  ORDER BY we.example';

			$wordExamples = $mysqli->query( $query );

			echo '<tr class="dynRowWord">' .
					'<td><input name="word[]" type="checkbox"/></td>' .
					'<td class="toggleEnabled"><span class="word" data-controltranstype="input-text" data-sourceword="' . $row[0] . '">' . $row[0] . '</span></td>' .
					'<td class="toggleEnabled"><span class="partOfSpeech" data-controltranstype="select" data-sourcepos="' . $row[1] . '">' . $row[1] . '</span></td>' .
					'<td class="toggleEnabled"><span class="pronunciation" data-controltranstype="input-text" data-sourcepron="' . $row[2] . '">' . $row[2] . '</span></td>' .
					'<td class="toggleEnabled"><span class="wordlist" data-controltranstype="select" data-sourcewordlistname="' . $row[3] . '">' . $row[3] . '</span></td>' .
					'<td class="toggleEnabled"><span class="meaning" data-controltranstype="textarea" data-sourcemeaning="' . $row[4] . '">' . $row[4] . '</span></td>' .
					'<td class="exampleTd">';

			if( $wordExamples )
			{
				while ( $example = mysqli_fetch_row( $wordExamples ) )
				{
					echo '<div class="exampleEntry transEffect" data-exId="ex_' . $example[0] . '" data-controltranstype="button" data-sourceexample="' . $example[1] . '">' . $example[1] . '</div><br/>';
				}
			}

			echo 	'</td>' .
				 	'<td><button class="btnUpdateWord">Update</button></td>' .
				 '</tr>';
		}

		mysqli_free_result($result);
	}
?>
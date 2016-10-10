<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	$query = "SELECT w.word, 
					 w.pronunciation, 
					 wl.wordlistName, 
					 wm.meaning,
					 w.wordlistId
			  FROM word w 
			  INNER JOIN wordlist wl
			  ON w.wordlistId = wl.wordlistId 
			  INNER JOIN wordMeaning wm
			  ON w.wordId = wm.wordId 
			  ORDER BY word";

	$result = $mysqli->query( $query );

	if ( $result )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{
			echo '<tr class="dynRowWord">' .
					'<td><input name="word[]" type="checkbox"/></td>' .
					'<td class="toggleEnabled"><span class="word" data-controltranstype="input-text" data-sourceword="' . $row[0] . '">' . $row[0] . '</span></td>' .
					'<td class="toggleEnabled"><span class="pronunciation" data-controltranstype="input-text" data-sourcepron="' . $row[1] . '">' . $row[1] . '</span></td>' .
					'<td class="toggleEnabled"><span class="wordlist" data-controltranstype="select" data-sourcewordlistname="' . $row[2] . '">' . $row[2] . '</span></td>' .
					'<td class="toggleEnabled"><span class="meaning" data-controltranstype="input-text" data-sourcemeaning="' . $row[3] . '">' . $row[3] . '</span></td>' .
					'<td><button class="btnUpdateWord">Update</button></td>' .
				 '</tr>';
		}

		mysqli_free_result($result);
	}
?>
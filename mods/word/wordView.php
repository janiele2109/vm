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

	$query = "SELECT * FROM wordlist ORDER BY wordlistName";

	$wordlistCb = $mysqli->query( $query );

	if ( $result )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{
			echo '<tr class="dynRowWord">' .
					'<td><input name="word[]" type="checkbox"/></td>' .
					'<td class="toggleEnabled"><span class="word" data-controltranstype="input-text" data-sourceword="' . $row[0] . '">' . $row[0] . '</span></td>' .
					'<td class="toggleEnabled"><span class="pronunciation" data-controltranstype="input-text" data-sourcepron="' . $row[1] . '">' . $row[1] . '</span></td>' .
					'<td class="toggleEnabled">' .
						'<select class="wordlist" id="wordlistCb" data-controltranstype="combobox" style="width: 200px;">';

						if ( $wordlistCb )
						{
							while ( $rw = mysqli_fetch_row( $wordlistCb ) )
							{
								echo '<option value="' . $rw[0] . '"';

								if( $rw[0] == $row[4] )
									echo " selected";

								echo '>' . $rw[1] . '</option>';
							}

							$wordlistCb->data_seek(0);							
						}

			echo		'</select>' .
					'</td>' .
					'<td class="toggleEnabled"><span class="meaning" data-controltranstype="input-text" data-sourcemeaning="' . $row[3] . '">' . $row[3] . '</span></td>' .
					'<td><button class="btnUpdateWord">Update</button></td>' .
				 '</tr>';
		}

		mysqli_free_result($wordlistCb);
		mysqli_free_result($result);
	}
?>
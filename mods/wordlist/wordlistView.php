<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/app.config.php';

	global $mysqli;

	$query = 'SELECT wl.wordlistId, wl.wordlistName, wl.DateCreated
			  FROM wordlist wl
			  INNER JOIN users u
			  ON wl.userId = u.userId
			  WHERE u.userName = "' . $username . '" ';

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'searchWordlistItem' )
	{
		if ( isset( $_POST[ 'wordlistName' ] ) && $_POST[ 'wordlistName' ] != '' )
			$query = $query . 'AND wl.wordlistName = "' . $_POST[ 'wordlistName' ] . '" ';
	}

	$query = $query . 'ORDER BY wl.DateCreated DESC LIMIT 10 OFFSET ';

	$pageIndex = 0;

	if ( isset( $_POST[ 'pageIndex' ] ) )
		$pageIndex = ( $_POST[ 'pageIndex' ] - 1 ) * 10;

	$query = $query . $pageIndex;

	if ( $result = $mysqli->query( $query ) )
	{
		while ( $row = mysqli_fetch_row( $result ) )
		{
			echo '<tr class="dynRowWordList">' .
					'<td><input name="wordList[]" type="checkbox"/></td>' .
					'<td class="toggleEnabled"><span class="wordlist" data-controltranstype="input-text" data-sourcewordlistname="' . $row[ 1 ] . '">' . $row[ 1 ] . '</span></td>';

				/* Get total words for wordlist */

				$query = 'SELECT COUNT(*) AS totalWords
						  FROM word w
						  INNER JOIN wordlist wl
						  ON w.wordlistId = wl.wordlistId
						  AND wl.wordlistId = ' . $row[ 0 ];

				if ( $ret = $mysqli->query( $query ) )
					echo '<td class = "wlTotalWords"><span>' . $ret->fetch_object()->totalWords . '</span></td>';
				else
					echo '<td class = "wlTotalWords"><span>0</span></td>';

				mysqli_free_result( $ret );

				/* Get total word meanings for wordlist */

				$query = 'SELECT COUNT(*) AS totalWordsMeanings
						  FROM word w
						  INNER JOIN wordlist wl
						  ON w.wordlistId = wl.wordlistId
						  INNER JOIN wordMeaning wm
						  ON w.wordId = wm.wordId
						  AND wl.wordlistId = ' . $row[ 0 ];

				if ( $ret = $mysqli->query( $query ) )
					echo '<td class = "wlTotalWordMeanings"><span>' . $ret->fetch_object()->totalWordsMeanings . '</span></td>';
				else
					echo '<td class = "wlTotalWordMeanings"><span>0</span></td>';

				mysqli_free_result( $ret );

				/* Get score for wordlist */

				$query = 'SELECT score
						  FROM wordlist wl
						  WHERE wl.wordlistId = ' . $row[ 0 ];

				if ( $ret = $mysqli->query( $query ) )
				{
					$score = $ret->fetch_object()->score;

					if ( $score != '' )
						echo '<td class = "wlScore"><span>' . $score . '%</span></td>';
					else
						echo '<td class = "wlScore"><span>0%</span></td>';
				}

				echo '<td><button class="updateWordlistNameBtn">Update</button></td>' .
				'</tr>';
		}

		echo '<tr class = "hiddenFields dynRowWordList">' .
			      '<td colspan = "6">' .
			          '<span id = "totalRowsInTable">' .
			          $result->num_rows .
			          '</span>' .
			      '</td>' .
			 '</tr>';

		mysqli_free_result( $result );
	}
?>
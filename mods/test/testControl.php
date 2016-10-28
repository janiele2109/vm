<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/libs/commonLib.php';

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'testDataRequest' )
	{
		getTestData( $_POST[ 'username' ] );
	}

	function getTestData( $username )
	{
		$responseData = checkUserNameExists( $username );

		if ( $responseData[ 'errState' ] == 'OK' )
		{
			$userId = $responseData[ 'dataContent' ];

			global $mysqli;

			$wordsList = [];

			$query = 'SELECT w.wordId, w.word, w.partOfSpeech, wl.wordlistName, w.pronunciation, wm.meaning, wm.nativemeaning
					  FROM word w
					  INNER JOIN wordMeaning wm
					  ON w.wordId = wm.wordId
					  INNER JOIN wordlist wl
					  ON w.wordlistId = wl.wordlistId
					  WHERE wl.userId = "' . $userId . '"';

			$result = $mysqli->query( $query );

			if ( $result != null &&
				 $result->num_rows > 0 )
			{
				while ( $row = mysqli_fetch_row( $result ) )
				{
					$examplesList = [];

					$query = 'SELECT we.example
							  FROM wordExample we
							  INNER JOIN wordMeaning wm
							  ON we.wordMeaningId = wm.wordMeaningId
							  WHERE wm.meaning = "' . $row[ 5 ] . '"';

					$examples = $mysqli->query( $query );

					if ( $examples != FALSE &&
						 $examples->num_rows > 0 )
					{
						while ( $ex = mysqli_fetch_row( $examples ) )
						{
							$examplesList[] = $ex;
						}

						mysqli_free_result( $examples );
					}

					$word = array(
								   'wordId' 		=> $row[ 0 ],
								   'word' 			=> $row[ 1 ],
								   'partOfSpeech'	=> $row[ 2 ],
								   'wordlistName' 	=> $row[ 3 ],
								   'pronunciation' 	=> $row[ 4 ],
								   'meaning' 		=> $row[ 5 ],
								   'nativemeaning'	=> $row[ 6 ],
								   'examples'		=> $examplesList
								 );

					$wordsList[] = $word;
				}

				$responseData[ 'errState' ] = 'OK';
				$responseData[ 'dataContent' ] = $wordsList;

				mysqli_free_result( $result );
			}
			else if ( $result == null )
			{
				$responseData[ 'errState' ] = 'NG';
				$responseData[ 'errCode' ] = '2001';
				$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
			}
			else
			{
				$responseData[ 'errState' ] = 'OK';
				$responseData[ 'dataContent' ] = '';
			}
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $responseData );
	}
?>
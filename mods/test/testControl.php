<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'testDataRequest' )
	{
		getTestData();
	}

	function getTestData()
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$wordsList = [];

		$query = 'SELECT w.wordId, w.word, w.partOfSpeech, wl.wordlistName, w.pronunciation, wm.meaning
				  FROM word w
				  INNER JOIN wordmeaning wm
				  ON w.wordId = wm.wordId
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			while ( $row = mysqli_fetch_row( $result ) )
			{
				$examplesList = [];

				$query = 'SELECT we.example
						  FROM wordexample we
						  INNER JOIN wordmeaning wm
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
							   'examples'		=> $examplesList
							 );

				$wordsList[] = $word;
			}

			$responseData[ 'errState' ] = 'OK';
			$responseData[ 'data' ] = $wordsList;

			mysqli_free_result( $result );
		}
		else if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '2001';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}

		$data = $responseData;
		header( 'Content-Type: application/json' );
		echo json_encode( $data );
	}
?>
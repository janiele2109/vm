<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'testDataRequest' ) 
	{
		getTestData();
	}

	function getTestData()
	{
		global $mysqli;

		$wordsList = []; 

		$query = 'SELECT w.wordId, w.word, wl.wordlistName, w.pronunciation, wm.meaning
				  FROM word w
				  INNER JOIN wordmeaning wm
				  ON w.wordId = wm.wordId
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0)
		{
			while ( $row = mysqli_fetch_row( $result ) )
			{
				$word = array('wordId' => $row[0],
							  'word' => $row[1],
							  'wordlistName' => $row[2],
							  'pronunciation' => $row[3],
							  'meaning' => $row[4] );

				$wordsList[] = $word;
			}
		}

		$data = array("errState" => "OK", 
					  "errCode" => "FFFF", 
				  	  "msg" => "", 
					  "data" => $wordsList
					 );
		header("Content-Type: application/json");
		echo json_encode($data);

		return;
	}
?>
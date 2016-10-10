<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'addWord' ) 
	{
		addWord( $_POST[ 'wordName' ], $_POST[ 'wordlistId' ], $_POST[ 'pronunciation' ], $_POST[ 'wordMeaning' ] );
	}

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'delSelectedWords' ) 
	{
		delSelectedWords();
	}

	// if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'updateWord' )
	// {
	// 	updateWord( $_POST["oldWordVal"], $_POST["newWordVal"], $_POST["oldWordlistVal"], $_POST["newWordlistVal"] );
	// }

	// if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'updateSelectedWords' )
	// {
	// 	updateSelectedWords();
	// }

	function addWord( $wordTitle, $wordlistId, $pronunciation, $wordMeaning )
	{
		global $mysqli;

		$wordId = null;

		if( checkDuplicateWord($wordTitle, $wordlistId) )
			return;

		$query = 'INSERT INTO word(word, pronunciation, wordlistId) values("' . $wordTitle . '", "' . $pronunciation . '", "' . $wordlistId . '");';

		if( !(execQuery( $query, "Adding word failed!" ) ) )
			return;
		
		$query = 'SELECT w.wordId
				  FROM word w
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId
				  WHERE w.word = "' . $wordTitle . '" AND w.wordlistId = "' . $wordlistId . '"';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			$wordId = $result->fetch_object()->wordId;
		}

		$query = 'INSERT INTO wordMeaning(meaning, wordId) values("' . $wordMeaning . '", "' . $wordId . '");';

		if( !(execQuery( $query, "Adding word failed!" ) ) )
			return;
		
		ob_start();
		require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/wordView.php';
		$html = ob_get_contents();
		ob_end_clean();

		$data = array("errState" => "OK", 
					  "errCode" => "FFFF", 
					  "msg" => $wordTitle . " added", 
					  "htmlContent" => $html
					 );
		header("Content-Type: application/json");
		echo json_encode($data);
	}

	function delSelectedWords()
	{
		global $mysqli;

		$temp = '';
		$wordArr = json_decode($_POST['wordArr']);

		foreach( $wordArr as $word )
		{	
			$query = 'SELECT w.wordId
					  FROM word w
					  INNER JOIN wordlist wl
					  ON w.wordlistId = wl.wordlistId
					  WHERE w.word = "' . $word->word . '" AND w.wordlistId = "' . $word->wordlistId . '"';

			$result = $mysqli->query( $query );

			if ($result->num_rows > 0) 
			{
				$wordId = $result->fetch_object()->wordId;

				$query = 'DELETE FROM wordMeaning WHERE wordId="' . $wordId . '" AND meaning="' . $word->meaning . '";';

				if( !execQuery( $query, "Delete selected words meaning failed!" ) )
					return;

				$query = 'SELECT w.wordId
						  FROM wordMeaning wm
						  INNER JOIN word w
						  ON w.wordId = wm.wordId
						  WHERE w.wordId = "' . $wordId . '"';

				$result = $mysqli->query( $query );

				if ($result->num_rows == 0) 
				{
					$query = 'DELETE FROM word WHERE wordId="' . $wordId . '";';

					if( !execQuery( $query, "Delete selected words failed!" ) )
						return;
				}
			}
			else
			{
				$data = array("errState" => "OK", 
							  "errCode" => "FFFF", 
							  "msg" => "Delete selected words failed!", 
							  "htmlContent" => ""
							 );
				header("Content-Type: application/json");
				echo json_encode($data);

				return;
			}
		}

		$data = array("errState" => "OK", 
					  "errCode" => "FFFF", 
				  	  "msg" => "", 
					  "htmlContent" => ""
					 );
		header("Content-Type: application/json");
		echo json_encode($data);

		return;
	}

	function checkDuplicateWord($wordTitle, $wordlistId)
	{
		global $mysqli;

		$query = 'SELECT w.wordId
				  FROM word w
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId
				  WHERE w.word = "' . $wordTitle . '" AND w.wordlistId = "' . $wordlistId . '"';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			$query = 'SELECT *
					  FROM wordmeaning wm
					  INNER JOIN word w
					  ON w.wordId = wm.wordId
					  WHERE wm.wordId = "' . $result->fetch_object()->wordId . '"';

			if ($result->num_rows > 0) 
			{
				$data = array("errState" => "NG", 
							  "errCode" => "00001", 
							  "msg" => "Duplicated word!", 
							  "htmlContent" => ""
							 );
				header("Content-Type: application/json");
				echo json_encode($data);

				return true;
			}
			else
				return false;
		}
		return false;
	}

	function execQuery( $query, $errMsg )
	{
		global $mysqli;

		$result = $mysqli->query( $query );

		if( !$result )
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00002", 
						  "msg" => $errMsg, 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return 0;
		}
		else
			return 1;
	}

	// function updateWordList($oldVal, $newVal)
	// {
	// 	global $mysqli;

	// 	$query = 'SELECT wordlistName FROM wordlist WHERE wordlistName="' . $newVal . '";';

	// 	$result = $mysqli->query( $query );

	// 	if ($result->num_rows > 0) 
	// 	{
	// 		$data = array("errState" => "NG", 
	// 					  "errCode" => "00001", 
	// 					  "msg" => "Duplicated wordlist!", 
	// 					  "htmlContent" => ""
	// 					 );
	// 		header("Content-Type: application/json");
	// 		echo json_encode($data);

	// 		return;
	// 	}

	// 	$query = 'UPDATE wordlist SET wordlistName = "' . $newVal . '" WHERE wordlistName="' . $oldVal . '";';

	// 	$result = $mysqli->query( $query );

	// 	if( !$result )
	// 	{
	// 		$data = array("errState" => "NG", 
	// 					  "errCode" => "00002", 
	// 					  "msg" => "Updating wordlist failed!", 
	// 					  "htmlContent" => ""
	// 					 );
	// 		header("Content-Type: application/json");
	// 		echo json_encode($data);

	// 		return;
	// 	}

	// 	$data = array("errState" => "OK", 
	// 				  "errCode" => "FFFF", 
	// 				  "msg" =>  $oldVal . " was updated to " . $newVal, 
	// 				  "htmlContent" => ""
	// 				 );

	// 	header("Content-Type: application/json");

	// 	echo json_encode($data);
	// }

	// function updateSelectedWordLists()
	// {
	// 	global $mysqli;

	// 	$cntWordlistTotal = 0;
	// 	$cntDuplicatedWordlist = 0;
	// 	$duplicatedWordlist = "";

	// 	foreach( $_POST['wordlistArr'] as $check ) {
	// 		$cntWordlistTotal++;
	// 		$startIndex = strpos($check, ":") + 1;
	// 		$len = strpos($check, ";") - $startIndex;

	// 		$oldWordlist = substr($check, $startIndex, $len);
	// 		$newWordlist = substr($check, strrpos($check, ":") + 1);

	// 		$query = 'SELECT wordlistName FROM wordlist WHERE wordlistName="' . $newWordlist . '";';

	// 		$result = $mysqli->query( $query );

	// 		if ($result->num_rows > 0) 
	// 		{
	// 			if( empty( $duplicatedWordlist ) )
	// 				$duplicatedWordlist = $newWordlist;
	// 			else
	// 				$duplicatedWordlist = $duplicatedWordlist . ", " . $newWordlist;

	// 			$cntDuplicatedWordlist++;
	// 			continue;
	// 		}

	// 		$query = 'UPDATE wordlist SET wordlistName = "' . $newWordlist . '" WHERE wordlistName="' . $oldWordlist . '";';

	// 		$result = $mysqli->query( $query );

	// 		if( !$result )
	// 		{
	// 			$data = array("errState" => "NG", 
	// 						  "errCode" => "00002", 
	// 						  "msg" => "Updating selected wordlist failed!", 
	// 						  "htmlContent" => ""
	// 						 );
	// 			header("Content-Type: application/json");
	// 			echo json_encode($data);

	// 			return;
	// 		}			
	// 	}

	// 	if ( !empty($duplicatedWordlist) ) 
	// 	{
	// 		$msg = "";
	// 		$range = $cntWordlistTotal - $cntDuplicatedWordlist;

	// 		if ( $range == 1 )
	// 			$msg = "Duplicated wordlist: " . $duplicatedWordlist . "! Remaining wordlist is updated successfully!";
	// 		else if ( $range > 1 )
	// 			$msg = "Duplicated wordlist: " . $duplicatedWordlist . "! Remaining wordlist are updated successfully!";
	// 		else
	// 			$msg = "Duplicated wordlist: " . $duplicatedWordlist;

	// 		$data = array("errState" => "NG", 
	// 					  "errCode" => "00001", 
	// 					  "msg" => $msg, 
	// 					  "htmlContent" => ""
	// 					 );
	// 		header("Content-Type: application/json");
	// 		echo json_encode($data);

	// 		return;
	// 	}
	// 	else
	// 	{
	// 		ob_start();
	// 		require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/wordlist/wordlistView.php';
	// 		$html = ob_get_contents();
	// 		ob_end_clean();

	// 		$data = array("errState" => "OK", 
	// 					  "errCode" => "FFFF", 
	// 					  "msg" => "Selected wordlist updated!", 
	// 					  "htmlContent" => $html
	// 					 );

	// 		header("Content-Type: application/json");

	// 		echo json_encode($data);
	// 	}
	// }
?>
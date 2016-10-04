<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'addWord' ) 
	{
		addWord( $_POST[ "wordName" ], $_POST[ "wordlistId" ] );
	}

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'delSelectedWords' ) 
	{
		delSelectedWords();
	}

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'updateWordAndWordlist' )
	{
		updateWordAndWordlist( $_POST["oldWordVal"], $_POST["newWordVal"], $_POST["oldWordlistIdVal"], $_POST["newWordlistIdVal"] );
	}

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'updateSelectedWords' )
	{
		updateSelectedWords();
	}

	function addWord( $wordTitle, $wordlistId )
	{
		global $mysqli;

		$query = 'SELECT word FROM word WHERE word="' . $wordTitle . '" AND wordlistId="' . $wordlistId . '";';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00001", 
						  "msg" => "Duplicated  in specific wordlist!", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return;
		}

		$query = 'INSERT INTO word(word, wordlistId) values("' . $wordTitle . '", ' . $wordlistId . ');';

		$result = $mysqli->query( $query );

		if( $result )
		{
			ob_start();
			require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/wordView.php';
			$html = ob_get_contents();
			ob_end_clean();

			$data = array("errState" => "OK", 
						  "errCode" => "FFFF", 
						  "msg" => $wordTitle . " added wordlist", 
						  "htmlContent" => $html
						 );
			header("Content-Type: application/json");
			echo json_encode($data);
		}
		else
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00002", 
						  "msg" => "Adding word failed!", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return;
		}
	}

	function delSelectedWords()
	{
		global $mysqli;

		foreach( $_POST['wordArr'] as $check ) {
			$pieces = explode( '-', $check );

			$oldWord = $pieces[1];

			$oldWordlist = $pieces[5];

			$query = 'DELETE word FROM word INNER JOIN wordlist ON word.wordlistId = wordlist.wordlistId WHERE word="' . $oldWord . '" AND wordlistName="' . $oldWordlist . '";';

			$result = $mysqli->query( $query );

			if( !$result )
			{
				$data = array("errState" => "NG", 
							  "errCode" => "00002", 
							  "msg" => "Deleting word failed!", 
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

	function updateWordAndWordlist($oldWordVal, $newWordVal, $oldWordlistIdVal, $newWordlistIdVal)
	{
		global $mysqli;

		$query = 'SELECT * FROM word, wordlist WHERE word="' . $newWordVal . '" AND wordlistName="' . $newWordlistIdVal . '" AND word.wordlistId=wordlist.wordlistId;';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00001", 
						  "msg" => "Duplicated new word in selected wordlist!", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return;
		}

		if( $oldWordVal != $newWordVal && $oldWordlistIdVal != $newWordlistIdVal )
		{
			$query = 'DELETE word FROM word INNER JOIN wordlist ON word.wordlistId = wordlist.wordlistId WHERE word="' . $oldWordVal . '" AND wordlistName="' . $oldWordlistIdVal . '";';

			$result = $mysqli->query( $query );

			if( !$result )
			{
				$data = array("errState" => "NG", 
							  "errCode" => "00002", 
							  "msg" => "Updating word with specified wordlist failed!", 
							  "htmlContent" => ""
							 );
				header("Content-Type: application/json");
				echo json_encode($data);

				return;
			}

			addWord( $newWordVal, $newWordlistIdVal );
		}
		else if ( $oldWordVal != $newWordVal )
		{
			$query = 'update word w inner join wordlist wl on w.wordlistId = wl.wordlistId set w.word = "' . $newWordVal . '" where w.word="' . $oldWordVal . '";';

			$result = $mysqli->query( $query );

			if( !$result )
			{
				$data = array("errState" => "NG", 
							  "errCode" => "00002", 
							  "msg" => $query, 
							  "htmlContent" => ""
							 );
				header("Content-Type: application/json");
				echo json_encode($data);

				return;
			}
		}
		else if ( $oldWordlistIdVal != $newWordlistIdVal )
		{
			$query = 'update word w inner join wordlist wl on w.wordlistId = wl.wordlistId set w.wordlistId = "' . $newWordVal . '" where w.word="' . $oldWordVal . '";';

			$result = $mysqli->query( $query );

			if( !$result )
			{
				$data = array("errState" => "NG", 
							  "errCode" => "00002", 
							  "msg" => "Updating wordlist of word failed!", 
							  "htmlContent" => ""
							 );
				header("Content-Type: application/json");
				echo json_encode($data);

				return;
			}
		}

		$data = array("errState" => "OK", 
					  "errCode" => "FFFF", 
					  "msg" =>  $oldVal . " was updated to " . $newVal, 
					  "htmlContent" => ""
					 );

		header("Content-Type: application/json");

		echo json_encode($data);
	}

	function updateSelectedWordLists()
	{
		global $mysqli;

		$cntWordlistTotal = 0;
		$cntDuplicatedWordlist = 0;
		$duplicatedWordlist = "";

		foreach( $_POST['wordlistArr'] as $check ) {
			$cntWordlistTotal++;
			$startIndex = strpos($check, ":") + 1;
			$len = strpos($check, ";") - $startIndex;

			$oldWordlist = substr($check, $startIndex, $len);
			$newWordlist = substr($check, strrpos($check, ":") + 1);

			$query = 'SELECT wordlistName FROM wordlist WHERE wordlistName="' . $newWordlist . '";';

			$result = $mysqli->query( $query );

			if ($result->num_rows > 0) 
			{
				if( empty( $duplicatedWordlist ) )
					$duplicatedWordlist = $newWordlist;
				else
					$duplicatedWordlist = $duplicatedWordlist . ", " . $newWordlist;

				$cntDuplicatedWordlist++;
				continue;
			}

			$query = 'UPDATE wordlist SET wordlistName = "' . $newWordlist . '" WHERE wordlistName="' . $oldWordlist . '";';

			$result = $mysqli->query( $query );

			if( !$result )
			{
				$data = array("errState" => "NG", 
							  "errCode" => "00002", 
							  "msg" => "Updating selected wordlist failed!", 
							  "htmlContent" => ""
							 );
				header("Content-Type: application/json");
				echo json_encode($data);

				return;
			}			
		}

		if ( !empty($duplicatedWordlist) ) 
		{
			$msg = "";
			$range = $cntWordlistTotal - $cntDuplicatedWordlist;

			if ( $range == 1 )
				$msg = "Duplicated wordlist: " . $duplicatedWordlist . "! Remaining wordlist is updated successfully!";
			else if ( $range > 1 )
				$msg = "Duplicated wordlist: " . $duplicatedWordlist . "! Remaining wordlist are updated successfully!";
			else
				$msg = "Duplicated wordlist: " . $duplicatedWordlist;

			$data = array("errState" => "NG", 
						  "errCode" => "00001", 
						  "msg" => $msg, 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return;
		}
		else
		{
			ob_start();
			require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/wordlist/wordlistView.php';
			$html = ob_get_contents();
			ob_end_clean();

			$data = array("errState" => "OK", 
						  "errCode" => "FFFF", 
						  "msg" => "Selected wordlist updated!", 
						  "htmlContent" => $html
						 );

			header("Content-Type: application/json");

			echo json_encode($data);
		}
	}
?>
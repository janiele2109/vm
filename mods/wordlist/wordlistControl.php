<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'addWordList') 
	{
		addWordList( $_POST[ "wordlistName" ] );
	}

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'delSelectedWordLists') 
	{
		delSelectedWordLists();
	}

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'updateWordList')
	{
		updateWordList( $_POST["oldVal"], $_POST["newVal"]);
	}

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'updateSelectedWordLists')
	{
		updateSelectedWordLists();
	}

	function addWordList( $wordlistTitle )
	{
		global $mysqli;

		$query = 'SELECT wordlistName FROM wordlist WHERE wordlistName="' . $wordlistTitle . '";';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00001", 
						  "msg" => "Duplicated word", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return;
		}

		$query = 'INSERT INTO wordlist(wordlistName) values("' . $wordlistTitle . '");';

		$result = $mysqli->query( $query );

		if( $result )
		{
			ob_start();
			require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/wordlist/wordlistView.php';
			$html = ob_get_contents();
			ob_end_clean();

			$data = array("errState" => "OK", 
						  "errCode" => "FFFF", 
						  "msg" => $wordlistTitle . " added wordlist", 
						  "htmlContent" => $html
						 );
			header("Content-Type: application/json");
			echo json_encode($data);
		}
		else
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00002", 
						  "msg" => "Adding wordlist failed!", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return;
		}
	}

	function delSelectedWordLists()
	{
		global $mysqli;

		foreach( $_POST['wordlistArr'] as $check ) {
			$startIndex = strrpos($check, ":") + 1;
			$len = strlen($check) - $startIndex;

			$word = substr($check, $startIndex, $len);

			$query = 'DELETE FROM wordlist WHERE wordlistName="' . $word . '";';

			$result = $mysqli->query( $query );

			if( !$result )
			{
				$data = array("errState" => "NG", 
							  "errCode" => "00002", 
							  "msg" => "Deleting wordlist failed!", 
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

	function updateWordList($oldVal, $newVal)
	{
		global $mysqli;

		$query = 'UPDATE wordlist SET wordlistName = "' . $newVal . '" WHERE wordlistName="' . $oldVal . '";';

		$result = $mysqli->query( $query );

		if( !$result )
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00002", 
						  "msg" => "Updating wordlist failed!", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return;
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

		foreach( $_POST['wordlistArr'] as $check ) {
			$startIndex = strpos($check, ":") + 1;
			$len = strpos($check, ";") - $startIndex;

			$oldWord = substr($check, $startIndex, $len);
			$newWord = substr($check, strrpos($check, ":") + 1);

			$query = 'UPDATE wordlist SET wordlistName = "' . $newWord . '" WHERE wordlistName="' . $oldWord . '";';

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
?>
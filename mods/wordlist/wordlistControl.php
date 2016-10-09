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
						  "msg" => "Duplicated wordlist!", 
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

		foreach( $_POST['wordlistArr'] as $wordlist ) {

			$query = 'DELETE FROM wordlist WHERE wordlistName="' . $wordlist . '";';

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

		$query = 'SELECT wordlistName FROM wordlist WHERE wordlistName="' . $newVal . '";';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00001", 
						  "msg" => "Duplicated wordlist!", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return;
		}

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
		
		$params = array('cntWordlistTotal' => 0, 
						'cntDuplicatedWordlist' =>0,
						'duplicatedWordlist' => '' );
			
		array_walk_recursive($_POST['wordlistMap'], 'updateWordlistInDB', $params);

		if ( !empty($params['duplicatedWordlist']) ) 
		{
			$msg = "";
			$range = $params['cntWordlistTotal'] - $params['cntDuplicatedWordlist'];

			if ( $range == 1 )
				$msg = "Duplicated wordlist: " . $params['duplicatedWordlist'] . "! Remaining wordlist is updated successfully!";
			else if ( $range > 1 )
				$msg = "Duplicated wordlist: " . $params['duplicatedWordlist'] . "! Remaining wordlist are updated successfully!";
			else
				$msg = "Duplicated wordlist: " . $params['duplicatedWordlist'];

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

	function updateWordlistInDB($item, $key, $params)
	{	
		global $mysqli;		

		$params['cntWordlistTotal']++;
		
		$query = 'SELECT wordlistName FROM wordlist WHERE wordlistName="' . $item . '";';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			if( empty( $params['duplicatedWordlist'] ) )
				$params['duplicatedWordlist'] = $item;
			else
				$params['duplicatedWordlist'] = $params['duplicatedWordlist'] . ", " . $item;

			$params['cntDuplicatedWordlist']++;
			continue;
		}

		$query = 'UPDATE wordlist SET wordlistName = "' . $item . '" WHERE wordlistName="' . $key . '";';

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
?>
<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'addWord') 
	{
		addWord( $_POST[ "wordName" ], $_POST[ "wordlistId" ] );
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

	function addWord( $wordTitle, $wordListId )
	{
		global $mysqli;

		$query = 'SELECT word FROM word WHERE word="' . $wordTitle . '" AND wordlistId="' . $wordListId . '";';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			$data = array("errState"=>"NG", 
						  "errCode"=>"00001", 
						  "msg"=>( "Duplicated word"), 
						  "htmlContent"=>""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return;
		}

		$query = 'INSERT INTO word(word, wordlistId) values("' . $wordTitle . '", "' . $wordListId . '");';

		$result = $mysqli->query( $query );

		if( $result )
		{
			ob_start();
			require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/wordView.php';
			$html = ob_get_contents();
			ob_end_clean();

			$data = array("errState"=>"OK", 
						  "errCode"=>"FFFF", 
						  "msg"=>( $wordTitle . " added"), 
						  "htmlContent"=>$html
						 );
			header("Content-Type: application/json");
			echo json_encode($data);
		}
		else
		{
			$data = array("errState"=>"NG", 
						  "errCode"=>"00002", 
						  "msg"=>( "Adding word failed!"), 
						  "htmlContent"=>""
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
			$startIndex = strpos($check, ":") + 1;
			$len = strpos($check, ";") - $startIndex;

			$oldWord = substr($check, $startIndex, $len);

			$query = 'DELETE FROM wordlist WHERE wordlistName="' . $oldWord . '";';

			$result = $mysqli->query( $query );

			if( !$result )
			{
				echo "Deleting wordlist failed!";
			}
		}
	}

	function updateWordList($oldVal, $newVal)
	{
		global $mysqli;

		$query = 'UPDATE wordlist SET wordlistName = "' . $newVal . '" WHERE wordlistName="' . $oldVal . '";';

		$result = $mysqli->query( $query );

		if( !$result )
		{
			echo "Updating wordlist failed!";
		}
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
				echo "Updating selected wordlist failed!";
				return;
			}
		}

		ob_start();
		require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/wordlist/wordlistView.php';
		$html = ob_get_contents();
		ob_end_clean();

		$data = array("errState"=>"OK", 
					  "errCode"=>"FFFF", 
					  "msg"=>( "Selected wordlist updated"), 
					  "htmlContent"=>$html
					 );

		header("Content-Type: application/json");

		echo json_encode($data);
	}
?>
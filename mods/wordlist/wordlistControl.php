<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'addWordList') 
	{
		addWordList( $_POST[ "wordlistName" ] );
	}

	if ( isset( $_POST[ "delAllWordlist" ] ) && !empty( $_POST[ 'wordList' ] ) )
	{
		delAllWordList();
	}

	if ( isset( $_POST['updateWordlist'] ) && $_POST['updateWordlist'] == true )
	{
		updateWordList( $_POST["oldVal"], $_POST["newVal"]);
	}

	if ( isset( $_POST[ "UpdateAllWordlist" ] ) )
	{
		updateAllWordList();
	}

	function addWordList( $wordlistTitle )
	{
		global $mysqli;

		$query = 'SELECT wordlistName FROM wordlist WHERE wordlistName="' . $wordlistTitle . '";';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			echo "<span class='Err'>Duplicated wordlist!</span>";
			return;
		}

		$query = 'INSERT INTO wordlist(wordlistName) values("' . $wordlistTitle . '");';

		$result = $mysqli->query( $query );

		if( $result )
		{
			//echo $wordlistTitle . " added wordlist";

			require_once $_SERVER['DOCUMENT_ROOT'] . "/mods/wordlist/wordlistView.php";
		}
		else
		{
			echo "Adding wordlist failed!";
		}
	}

	function delAllWordList()
	{
		global $mysqli;

		foreach( $_POST['wordList'] as $check ) {
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

	function updateAllWordList()
	{
		global $mysqli;

		foreach( $_POST['wordList'] as $check ) {
			$startIndex = strpos($check, ":") + 1;
			$len = strpos($check, ";") - $startIndex;

			$oldWord = substr($check, $startIndex, $len);
			$newWord = substr($check, strrpos($check, ":") + 1);

			$query = 'UPDATE wordlist SET wordlistName = "' . $newWord . '" WHERE wordlistName="' . $oldWord . '";';

			$result = $mysqli->query( $query );

			if( !$result )
			{
				echo "Updating wordlist failed!";
			}
		}
	}
?>
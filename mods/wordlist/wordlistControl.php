<?php
	include_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	if ( isset($_POST[ "AddWL" ] ) ) 
	{
		addWordList( $_POST[ "wordlistTitle" ] );
	}

	if ( isset( $_POST[ "delNewWordlist" ] ) && !empty( $_POST[ 'words' ] ) )
	{
		global $mysqli;

		foreach( $_POST['words'] as $check ) {
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

	if ( isset( $_POST[ "UpdateWordlist" ] ) )
	{
		global $mysqli;

		$startIndex = strpos($_POST['words'][0], ":") + 1;
		$len = strpos($_POST['words'][0], ";") - $startIndex;

		$oldWord = substr($_POST['words'][0], $startIndex, $len);
		$newWord = substr($_POST['words'][0], strrpos($_POST['words'][0], ":") + 1);

		$query = 'UPDATE wordlist SET wordlistName = "' . $newWord . '" WHERE wordlistName="' . $oldWord . '";';

		$result = $mysqli->query( $query );

		if( !$result )
		{
			echo "Updating wordlist failed!";
		}
	}

	if ( isset( $_POST[ "UpdateAllWordlist" ] ) )
	{
		global $mysqli;

		foreach( $_POST['words'] as $check ) {
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

	function addWordList( $wordlistTitle )
	{
		global $mysqli;

		$query = 'INSERT INTO wordlist(wordlistName) values("' . $wordlistTitle . '");';

		$result = $mysqli->query( $query );

		if( $result )
		{
			echo $_POST["wordlistTitle"] . " added wordlist";
		}
		else
		{
			echo "Adding wordlist failed!";
		}
	}

	function delWordList( $wordlistTitle )
	{
		global $mysqli;

		$query = 'DELETE FROM wordlist(wordlistName) WHERE wordlistName="' . $wordlistTitle . '");';

		$result = $mysqli->query( $query );

		if( $result )
		{
			echo $_POST["wordlistTitle"] . " added wordlist";
		}
		else
		{
			echo "Adding wordlist failed!";
		}

	}
?>
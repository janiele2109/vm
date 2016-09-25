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
			$query = 'DELETE FROM wordlist WHERE wordlistName="' . $check . '";';

			$result = $mysqli->query( $query );

			if( !$result )
			{
				echo "Deleting wordlist failed!";
			}
		}
	}

	if ( isset( $_POST[ "UpdateWordlist" ] ) )
	{
		// global $mysqli;

		// $query = 'UPDATE wordlist SET wordlistName = "' .  . '" WHERE wordlistName="' . $_POST[ "UpdateWordlist" ] . '";';

		// $result = $mysqli->query( $query );

		// if( !$result )
		// {
		// 	echo "Deleting wordlist failed!";
		// }
		print_r($_POST);
	}

	if ( isset( $_POST[ "UpdateAllWordlist" ] ) )
	{
		// global $mysqli;

		// foreach( $_POST['words'] as $check ) {
		// 	$query = 'UPDATE wordlist SET wordlistName = "' . $_POST[ 'UpdateWordlist' ] ) . '" WHERE wordlistName="' . $_POST[ "UpdateWordlist" ] ) . '";';

		// 	$result = $mysqli->query( $query );

		// 	if( !$result )
		// 	{
		// 		echo "Deleting wordlist failed!";
		// 	}
		// }
		print_r($_POST);
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
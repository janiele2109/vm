<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	if ( isset($_POST[ "AddW" ] ) ) 
	{
		echo $_POST[ "word" ];
		echo $_POST[ "wordlistId" ];
		addWord( $_POST[ "word" ], $_POST[ "wordlistId" ] );
	}

	if ( isset( $_POST[ "delNewWord" ] ) && !empty( $_POST[ 'words' ] ) )
	{
		delAllWord();
	}

	if ( isset( $_POST['updateWord'] ) && $_POST['updateWord'] == true )
	{
		updateWord( $_POST["oldVal"], $_POST["newVal"]);
	}

	if ( isset( $_POST[ "UpdateAllWord" ] ) )
	{
		updateAllWord();
	}

	function addWord( $wordTitle, $wordListId )
	{
		// global $mysqli;

		// $query = 'SELECT word FROM word WHERE word="' . $wordTitle . '";';

		// $result = $mysqli->query( $query );

		// if ($result->num_rows > 0) 
		// {
		// 	echo "<span class='Err'>Duplicated word!</span>";
		// 	return;
		// }

		// $query = 'INSERT INTO word(word, wordlistId) values("' . $wordTitle . '", "' . $wordListId . '");';

		// $result = $mysqli->query( $query );

		// if( $result )
		// {
		// 	echo $_POST["wordTitle"] . " added into list";
		// }
		// else
		// {
		// 	echo "Adding word failed!";
		// }
	}

	function delAllWordList()
	{
		// global $mysqli;

		// foreach( $_POST['words'] as $check ) {
		// 	$startIndex = strpos($check, ":") + 1;
		// 	$len = strpos($check, ";") - $startIndex;

		// 	$oldWord = substr($check, $startIndex, $len);

		// 	$query = 'DELETE FROM wordlist WHERE wordlistName="' . $oldWord . '";';

		// 	$result = $mysqli->query( $query );

		// 	if( !$result )
		// 	{
		// 		echo "Deleting wordlist failed!";
		// 	}
		// }
	}

	function updateWordList($oldVal, $newVal)
	{
		// global $mysqli;

		// $query = 'UPDATE wordlist SET wordlistName = "' . $newVal . '" WHERE wordlistName="' . $oldVal . '";';

		// $result = $mysqli->query( $query );

		// if( !$result )
		// {
		// 	echo "Updating wordlist failed!";
		// }
	}

	function updateAllWordList()
	{
		// global $mysqli;

		// foreach( $_POST['words'] as $check ) {
		// 	$startIndex = strpos($check, ":") + 1;
		// 	$len = strpos($check, ";") - $startIndex;

		// 	$oldWord = substr($check, $startIndex, $len);
		// 	$newWord = substr($check, strrpos($check, ":") + 1);

		// 	$query = 'UPDATE wordlist SET wordlistName = "' . $newWord . '" WHERE wordlistName="' . $oldWord . '";';

		// 	$result = $mysqli->query( $query );

		// 	if( !$result )
		// 	{
		// 		echo "Updating wordlist failed!";
		// 	}
		// }
	}
?>
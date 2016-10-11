<?php
	require_once $_SERVER['DOCUMENT_ROOT'] . "/db/mysql.connect.php";

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'getOptionData' ) 
	{
		getOptionData();
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'addWord' ) 
	{
		addWord( $_POST[ 'wordName' ], $_POST[ 'wordlistId' ], $_POST[ 'pronunciation' ], $_POST[ 'wordMeaning' ] );
	}

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'delSelectedWords' ) 
	{
		delSelectedWords();
	}

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'updateWord' )
	{
		updateWord( $_POST['modifiedControls'] );
	}

	if ( isset( $_POST[ "requestType" ] ) && $_POST[ "requestType" ] == 'updateSelectedWords' )
	{
		updateSelectedWords( $_POST['modifiedControlsList'] );
	}

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

		$wordArr = json_decode($_POST['wordArr']);

		foreach( $wordArr as $word )
		{	
			$query = 'SELECT w.wordId
					  FROM word w
					  INNER JOIN wordlist wl
					  ON w.wordlistId = wl.wordlistId
					  WHERE w.word = "' . $word->word . '" AND wl.wordlistName = "' . $word->wordlistName . '"';

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
				$data = array("errState" => "NG", 
							  "errCode" => "00002", 
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

	function updateWord( $modifiedControls, $inListFlag=false )
	{
		global $mysqli;

		$modifiedNewWordVal = '';

		$modifiedCtrls = json_decode( $modifiedControls );

		foreach( $modifiedCtrls as $ctrl )
		{
			switch( $ctrl->controlType )
			{
                case 'word':
                	$modifiedNewWordVal = $ctrl->newVal;

                    if( !updateWordField( $ctrl->orgVal, $ctrl->newVal ) )
                        return 0;

                    break;

                case 'pronunciation':
                	$result = false;

                	if( $modifiedNewWordVal != '' )
                    	$result = updatePronunciationField( $modifiedNewWordVal, $ctrl->orgVal, $ctrl->newVal );
                    else
                    	$result = updatePronunciationField( $ctrl->word, $ctrl->orgVal, $ctrl->newVal );

                    if( !$result )
                    	return 0;

                    break;
                    
                case 'wordlist':
                	$result = false;

                	if( $modifiedNewWordVal != '' )
                    	$result = updateWordlistField( $modifiedNewWordVal, $ctrl->orgVal, $ctrl->newVal );
                    else
                    	$result = updateWordlistField( $ctrl->word, $ctrl->orgVal, $ctrl->newVal );

                    if( !$result )
                    	return 0;
                    
                    break;
                case 'meaning':
                    $result = false;

                	if( $modifiedNewWordVal != '' )
                    	$result = updateMeaningField( $modifiedNewWordVal, $ctrl->orgVal, $ctrl->newVal );
                    else
                    	$result = updateMeaningField( $ctrl->word, $ctrl->orgVal, $ctrl->newVal );

                    if( !$result )
                    	return 0;
                    
                    break;

                default:
                    break;
			}
		}

		if( $inListFlag == false )
		{
			ob_start();
			require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/wordView.php';
			$html = ob_get_contents();
			ob_end_clean();

			$data = array("errState" => "OK", 
						  "errCode" => "FFFF", 
						  "msg" => "Updated successfully", 
						  "htmlContent" => $html
						 );
			header("Content-Type: application/json");
			echo json_encode($data);
		}

		return 1;
	}

	function updateSelectedWords( $modifiedControlsList )
	{
		global $mysqli;

		$modifiedCtrlsList = json_decode( $modifiedControlsList );

		foreach( $modifiedCtrlsList as $modifiedCtrls )
		{
			if( !updateWord( json_encode( $modifiedCtrls ), true ) )
				return;
		}

		ob_start();
		require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/wordView.php';
		$html = ob_get_contents();
		ob_end_clean();

		$data = array("errState" => "OK", 
					  "errCode" => "FFFF", 
					  "msg" => "Updated selected words successfully: ", 
					  "htmlContent" => $html
					 );
		header("Content-Type: application/json");
		echo json_encode($data);
	}

	function updateWordField($oldWord, $newWord)
	{
		global $mysqli;

		$query = 'UPDATE word SET word = "' . $newWord . '" WHERE word="' . $oldWord . '";';

		$result = $mysqli->query( $query );

		if ($result) 
		{
			return 1;
		}
		else
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00002", 
						  "msg" => "Update word field failed!", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return 0;
		}
	}

	function updatePronunciationField($word, $oldVal, $newVal)
	{
		global $mysqli;

		$query = 'UPDATE word SET pronunciation = "' . $newVal . '" WHERE word="' . $word . '" AND pronunciation="' . $oldVal . '";';

		$result = $mysqli->query( $query );

		if ($result) 
		{
			return 1;
		}
		else
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00002", 
						  "msg" => "Update pronunciation field failed!", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return 0;
		}
	}

	function updateWordlistField($word, $oldVal, $newVal)
	{
		global $mysqli;

		$query = 'SELECT wl.wordlistId FROM wordlist wl WHERE wl.wordlistName="' . $newVal . '"';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			$query = 'UPDATE word as w
					  INNER JOIN wordlist as wl
					  ON w.wordlistId = wl.wordlistId
					  SET w.wordlistId = ' . $result->fetch_object()->wordlistId . ' ' .
					  'WHERE w.word="' . $word . '" AND wl.wordlistName="' . $oldVal . '"';

			$result = $mysqli->query( $query );

			if ($result) 
			{
				return 1;
			}
			else
			{
				$data = array("errState" => "NG", 
							  "errCode" => "00002", 
							  "msg" => "Update wordlist field failed!", 
							  "htmlContent" => ""
							 );
				header("Content-Type: application/json");
				echo json_encode($data);

				return 0;
			}
		}
		else
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00002", 
						  "msg" => "Failed for searching wordlist!", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return 0;
		}
	}

	function updateMeaningField($word, $oldVal, $newVal)
	{
		global $mysqli;

		$query = 'SELECT w.wordId FROM word w WHERE w.word="' . $word . '"';

		$result = $mysqli->query( $query );

		if ($result->num_rows > 0) 
		{
			$query = 'UPDATE wordmeaning as wm
					  INNER JOIN word as w
					  ON wm.wordId = w.wordId
					  SET wm.meaning = "' . $newVal . '" ' .
					  'WHERE wm.wordId=' . $result->fetch_object()->wordId . ' AND wm.meaning="' . $oldVal . '"';

			$result = $mysqli->query( $query );

			if ($result) 
			{
				return 1;
			}
			else
			{
				$data = array("errState" => "NG", 
							  "errCode" => "00002", 
							  "msg" => "Update word meaning failed!", 
							  "htmlContent" => ""
							 );
				header("Content-Type: application/json");
				echo json_encode($data);

				return 0;
			}
		}
		else
		{
			$data = array("errState" => "NG", 
						  "errCode" => "00002", 
						  "msg" => "Failed for searching word!", 
						  "htmlContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return 0;
		}
	}

	function getOptionData()
	{
		global $mysqli;
		$data = []; 

		$query = 'SELECT * FROM wordlist';

		$result = $mysqli->query( $query );

		if ( $result )
		{
			while ( $row = mysqli_fetch_row( $result ) )
			{
				$data[ $row[0] ] = $row[1];
			}
		}

		$data = array("errState" => "OK", 
					  "errCode" => "FFFF", 
				  	  "msg" => "", 
					  "data" => $data
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
?>
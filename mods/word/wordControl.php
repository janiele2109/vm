<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'getWordlistList' )
	{
		getWordlistList();
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'addWord' )
	{
		addWord (
					$_POST[ 'word' ],
					$_POST[ 'partsOfSpeech' ],
					$_POST[ 'pronunciation' ],
					$_POST[ 'wordlistId' ],
					$_POST[ 'wordMeaning' ],
					$_POST[ 'wordExample' ]
				);
	}

	function getWordlistList()
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$data = [];

		$query = 'SELECT *
				  FROM wordlist';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			while ( $row = mysqli_fetch_row( $result ) )
			{
				$data[ $row[ 0 ] ] = $row[ 1 ];
			}
		}

		$responseData[ 'errState' ] = 'OK';
		$responseData[ 'dataContent' ] = $data;

		header( 'Content-Type: application/json' );
		echo json_encode( $responseData );
	}

	function addWord( $wordTitle,
					  $partsOfSpeech,
					  $pronunciation,
					  $wordlistId,
					  $wordMeaning,
					  $wordExample )
	{
		$result = validateSendingData( $wordTitle,
									   $partsOfSpeech,
									   $pronunciation,
									   $wordlistId,
									   $wordMeaning,
									   $wordExample );

		if ( $result[ 'errState' ] == 'OK' )
		{
			$retCode = checkDuplicateWord( $wordTitle,
										   $wordlistId,
										   $wordMeaning );

			/* Word is duplicated (includes word meaning) */
			if ( $retCode == 2 )
			{
				$result[ 'errState' ] = 'NG';
				$result[ 'errCode' ] = '1008';
				$result[ 'msg' ] = constant( $result[ 'errCode' ] );
			}
			else
			{
				if ( $retCode == 0 )
				{
					$result = addWordToDb( $wordTitle,
										   $partsOfSpeech,
										   $pronunciation,
										   $wordlistId );
				}

				if ( $result[ 'errState' ] == 'OK' )
				{
					$wordId = getWordId( $wordTitle, $wordlistId );

					$result = addWordMeaningToDb( $wordId, $wordMeaning );

					if ( $result[ 'errState' ] == 'OK' )
					{
						$wordMeaningId = getWordMeaningId( $wordId, $wordMeaning );

						$result = addWordExampleToDb( $wordMeaningId, $wordExample );

						if ( $result[ 'errState' ] == 'OK' )
						{
							$result[ 'dataContent' ] = reloadWordViewContent();
							$result[ 'msg' ] = constant( '1051' );
						}
					}
				}
			}
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	/* ===================== Word helper functions - START ===================== */

	function validateWord( $word )
	{
		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		if ( $word == '' )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1001';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function validatePartOfSpeech( $partOfSpeech )
	{
		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		if ( $partOfSpeech == '' )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1002';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function validatePronunciation( $pronunciation )
	{
		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		if ( $pronunciation == '' )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1003';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function validateWordlistId( $wordlistId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		if ( $wordlistId == '' )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1004';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
		{
			$query = 'SELECT *
					  FROM wordlist
					  WHERE wordlistId = "' . $wordlistId . '"';

			$result = $mysqli->query( $query );

			if ( $result != FALSE &&
				 $result->num_rows > 0 )
			{
				$responseData[ 'errState' ] = 'OK';
			}
			else
			{
				$responseData[ 'errState' ] = 'NG';
				$responseData[ 'errCode' ] = '1005';
				$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
			}
		}

		return $responseData;
	}

	function validateMeaning( $meaning )
	{
		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		if ( $meaning == '' )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1006';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function validateExample( $example )
	{
		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		if ( $example == '' )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1007';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function validateSendingData( $wordTitle,
								  $partsOfSpeech,
								  $pronunciation,
								  $wordlistId,
								  $wordMeaning,
								  $wordExample )
	{
		$result = validateWord( $wordTitle );

		if ( $result[ 'errState' ] == 'OK' )
		{
			$result = validatePartOfSpeech( $partsOfSpeech );

			if ( $result[ 'errState' ] == 'OK' )
			{
				$result = validatePronunciation( $pronunciation );

				if ( $result[ 'errState' ] == 'OK' )
				{
					$result = validateWordlistId( $wordlistId );

					if ( $result[ 'errState' ] == 'OK' )
					{
						$result = validateMeaning( $wordMeaning );

						if ( $result[ 'errState' ] == 'OK' )
						{
							$result = validateExample( $wordExample );
						}
					}
				}
			}
		}

		return $result;
	}

	function checkDuplicateWord( $wordTitle,
								 $wordlistId,
								 $wordMeaning )
	{
		global $mysqli;

		$query = 'SELECT w.wordId
				  FROM word w
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId
				  WHERE w.word = "' . $wordTitle . '" AND w.wordlistId = "' . $wordlistId . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			$query = 'SELECT *
					  FROM wordmeaning wm
					  INNER JOIN word w
					  ON w.wordId = wm.wordId
					  WHERE wm.wordId = "' . $result->fetch_object()->wordId . '" AND wm.meaning = "' . $wordMeaning . '"';

			$result = $mysqli->query( $query );

			if ( $result != FALSE &&
				 $result->num_rows > 0 )
			{
				return 2;
			}
			else
				return 1;
		}

		return 0;
	}

	function getWordId( $wordTitle, $wordlistId )
	{
		global $mysqli;

		$query = 'SELECT w.wordId
				  FROM word w
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId
				  WHERE w.word = "' . $wordTitle . '" AND w.wordlistId = "' . $wordlistId . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			return $result->fetch_object()->wordId;
		}

		return '';
	}

	function getWordMeaningId( $wordId, $meaning )
	{
		global $mysqli;

		$query = 'SELECT wm.wordMeaningId
				  FROM wordmeaning wm
				  INNER JOIN word w
				  ON wm.wordId = w.wordId
				  WHERE w.wordId = "' . $wordId . '" AND wm.meaning = "' . $meaning . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			return $result->fetch_object()->wordMeaningId;
		}

		return '';
	}

	function addWordToDb( $wordTitle,
						  $partOfSpeech,
						  $pronunciation,
						  $wordlistId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$query = 'INSERT INTO word( word, partOfSpeech, pronunciation, wordlistId )
				  VALUES ( "' . $wordTitle . '",' .
				  		 ' "' . $partOfSpeech . '",' .
				  		 ' "' . $pronunciation . '",' .
				  		 ' "' . $wordlistId . '")';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1009';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function addWordMeaningToDb( $wordId, $meaning )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$query = 'INSERT INTO wordMeaning( meaning, wordId )
				  VALUES ( "' . $meaning . '",' .
				         ' "' . $wordId . '")';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1010';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function addWordExampleToDb( $wordMeaningId, $wordExample )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$query = 'INSERT INTO wordexample( example, wordMeaningId )
				  VALUES ( "' . $wordExample . '",' .
				         ' "' . $wordMeaningId . '")';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1011';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function reloadWordViewContent()
	{
		ob_start();
		require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/word/wordView.php';
		$html = ob_get_contents();
		ob_end_clean();

		return $html;
	}

	/* ===================== Word helper functions - START ===================== */



















	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'delSelectedWords' )
	{
		delSelectedWords();
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'updateWord' )
	{
		updateWord( $_POST[ 'modifiedControls' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'updateSelectedWords' )
	{
		updateSelectedWords( $_POST[ 'modifiedControlsList' ] );
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

				if ( !execQuery( $query, "Delete selected words meaning failed!" ) )
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

					if ( !execQuery( $query, "Delete selected words failed!" ) )
						return;
				}
			}
			else
			{
				$data = array("errState" => "NG", 
							  "errCode" => "00002", 
							  "msg" => "Delete selected words failed!", 
							  "dataContent" => ""
							 );
				header("Content-Type: application/json");
				echo json_encode($data);

				return;
			}
		}

		$data = array("errState" => "OK", 
					  "errCode" => "FFFF", 
				  	  "msg" => "", 
					  "dataContent" => ""
					 );
		header("Content-Type: application/json");
		echo json_encode($data);

		return;
	}

	function updateWord( $modifiedControls, $inListFlag=false )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$modifiedNewWordVal = '';

		$modifiedCtrls = json_decode( $modifiedControls );

		foreach( $modifiedCtrls as $ctrl )
		{
			switch( $ctrl->controlType )
			{
                case 'word':
                	$modifiedNewWordVal = $ctrl->newVal;

                    if ( !updateWordField( $ctrl->orgVal, $ctrl->newVal ) )
                    {
						$responseData[ 'errState' ] = 'NG';
						$responseData[ 'errCode' ] = '10100';
						$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
                    }
                    else
                    	$responseData[ 'errState' ] = 'OK';

                    break;

                case 'pronunciation':
                	$result = false;

                	if ( $modifiedNewWordVal != '' )
                    	$result = updatePronunciationField( $modifiedNewWordVal, $ctrl->orgVal, $ctrl->newVal );
                    else
                    	$result = updatePronunciationField( $ctrl->word, $ctrl->orgVal, $ctrl->newVal );

                    if ( !$result )
                    {
						$responseData[ 'errState' ] = 'NG';
						$responseData[ 'errCode' ] = '10110';
						$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
                    }
                    else
                    	$responseData[ 'errState' ] = 'OK';

                    break;
                    
                case 'wordlist':
                	$result = false;

                	if ( $modifiedNewWordVal != '' )
                    	$result = updateWordlistField( $modifiedNewWordVal, $ctrl->orgVal, $ctrl->newVal );
                    else
                    	$result = updateWordlistField( $ctrl->word, $ctrl->orgVal, $ctrl->newVal );

                    if ( !$result )
                    {
						$responseData[ 'errState' ] = 'NG';
						$responseData[ 'errCode' ] = '10120';
						$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
                    }
                    else
                    	$responseData[ 'errState' ] = 'OK';
                    
                    break;

                case 'meaning':
                    $result = false;                    

                	if ( $modifiedNewWordVal != '' )
                    	$result = updateMeaningField( $modifiedNewWordVal, $ctrl->orgVal, $ctrl->newVal );
                    else
                    	$result = updateMeaningField( $ctrl->word, $ctrl->orgVal, $ctrl->newVal );

                    if ( !$result )
                    {
						$responseData[ 'errState' ] = 'NG';
						$responseData[ 'errCode' ] = '10130';
						$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
                    }
                    else
                    	$responseData[ 'errState' ] = 'OK';
                    
                    $modifiedNewMeaningVal = $ctrl->newVal;

                    break;

                case 'example':
                    $result = false;
                    $wordVal = '';

                	if ( $modifiedNewWordVal != '' )
                		$wordVal = $modifiedNewWordVal;
                	else
                		$wordVal = $ctrl->word;

                	foreach( $ctrl->exampleList as $ex )
                	{
                		$result = updateExampleField( $wordVal, $ex->meaning, $ex->orgVal, $ex->newVal );
                	}                    
                	
                    if ( $result[ 'errState' ] == 'NG' )
                    {
						$responseData[ 'errState' ] = $result[ 'errState' ];
						$responseData[ 'errCode' ] = $result[ 'errCode' ];
						$responseData[ 'msg' ] = $result[ 'msg' ];
                    }
                    else
                    	$responseData[ 'errState' ] = 'OK';
                    
                    break;

                default:
                    break;
			}
		}

		if ( $inListFlag == false )
		{
			$data = $responseData;
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
			if ( !updateWord( json_encode( $modifiedCtrls ), true ) )
				return;
		}

		ob_start();
		require_once $_SERVER['DOCUMENT_ROOT'] . '/mods/word/wordView.php';
		$html = ob_get_contents();
		ob_end_clean();

		$data = array("errState" => "OK", 
					  "errCode" => "FFFF", 
					  "msg" => "Updated selected words successfully: ", 
					  "dataContent" => $html
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
						  "dataContent" => ""
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
						  "dataContent" => ""
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
							  "dataContent" => ""
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
						  "dataContent" => ""
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
							  "dataContent" => ""
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
						  "dataContent" => ""
						 );
			header("Content-Type: application/json");
			echo json_encode($data);

			return 0;
		}
	}

	function updateExampleField($word, $meaning, $oldVal, $newVal)
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$query = 'SELECT wm.wordMeaningId 
				  FROM wordmeaning wm
				  INNER JOIN word w
				  ON wm.wordId = w.wordId
				  WHERE w.word="' . $word . '" AND wm.meaning="' . $meaning . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			$wordMeaningId = $result->fetch_object()->wordMeaningId;

			$query = 'SELECT we.wordExampleId 
					  FROM wordexample we
					  WHERE we.wordMeaningId="' . $wordMeaningId . '" AND we.example="' . $oldVal . '"';

			$result = $mysqli->query( $query );

			if ( $result != FALSE &&
				 $result->num_rows > 0 )
			{				
				$wordExampleId = $result->fetch_object()->wordExampleId;

				if ( $newVal != '' )
				{
					$query = 'UPDATE wordexample as we
							  SET we.example = "' . $newVal . '" ' .
							  'WHERE we.wordExampleId="' . $wordExampleId . '"';
				}
				else
				{
					$query = 'DELETE FROM wordexample
							  WHERE wordExampleId=' . $wordExampleId;
				}

				$result = $mysqli->query( $query );

				if ( $result != FALSE )
					$responseData[ 'errState' ] = 'OK';
				else
				{
					$responseData[ 'errState' ] = 'NG';
					$responseData[ 'errCode' ] = '10080';
					$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
				}
			}
			else
			{				
				$query = 'INSERT INTO wordexample(example, wordMeaningId)
						  VALUES("' . $newVal . '", "' . $wordMeaningId . '")';

				$result = $mysqli->query( $query );

				if ( $result != FALSE )
					$responseData[ 'errState' ] = 'OK';
				else
				{
					$responseData[ 'errState' ] = 'NG';
					$responseData[ 'errCode' ] = '10090';
					$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
				}
			}
		}
		else
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '10070';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}

		return $responseData;
	}

	function execQuery( $query )
	{
		global $mysqli;

		$result = $mysqli->query( $query );

		if ( !$result )
			return 0;
		else
			return $result;
	}




	function deleteExamplesBelongsToWordMeaningId( $wordMeaningId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$query = 'DELETE FROM wordexample
				  WHERE wordMeaningId = "' . $wordMeaningId . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '10150';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function deleteWordMeaningsBelongsToWordId( $wordId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$query = 'SELECT wm.wordMeaningId
				  FROM wordmeaning wm
				  WHERE wm.wordId = "' . $wordId . '"';

		$wordMeaningIds = $mysqli->query( $query );

		if ( $wordMeaningIds != FALSE &&
			 $wordMeaningIds->num_rows > 0 )
		{
			while ( $wordMeaningId = mysqli_fetch_row( $wordMeaningIds ) )
			{
				$responseData = deleteExamplesBelongsToWordMeaningId( $wordMeaningId[0] );

				if ( $responseData[ 'errState' ] == 'OK' )
				{
					$query = 'DELETE FROM wordmeaning
							  WHERE wordId = "' . $wordId . '"';

					$result = $mysqli->query( $query );

					if ( $result == FALSE )
					{
						$responseData[ 'errState' ] = 'NG';
						$responseData[ 'errCode' ] = '10160';
						$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
					}
					else
						$responseData[ 'errState' ] = 'OK';
				}
			}
		}
		else
			$responseData[ 'errState' ] = 'OK';		

		return $responseData;
	}

	function deleteWordsBelongToWordlistName( $wordlistName )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$query = 'SELECT w.wordId
				  FROM word w
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId
				  WHERE wl.wordlistName = "' . $wordlistName . '"';

		$rows = $mysqli->query( $query );

		if ( $rows != FALSE &&
			 $rows->num_rows > 0 )
		{
			while ( $row = mysqli_fetch_row( $rows ) )
			{
				$responseData = deleteWordMeaningsBelongsToWordId( $row[0] );

				if ( $responseData[ 'errState' ] == 'OK' )
				{
					$query = 'DELETE FROM word
							  WHERE wordId = "' . $row[0] . '"';

					$result = $mysqli->query( $query );

					if ( $result == FALSE )
					{
						$responseData[ 'errState' ] = 'NG';
						$responseData[ 'errCode' ] = '10140';
						$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
					}
					else
						$responseData[ 'errState' ] = 'OK';
				}
			}
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

?>
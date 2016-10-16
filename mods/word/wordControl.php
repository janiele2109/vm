<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'getOptionData' )
	{
		getOptionData();
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'addWord' )
	{
		addWord(
				 $_POST[ 'wordName' ],
				 $_POST[ 'partsOfSpeech' ],
				 $_POST[ 'wordlistId' ],
				 $_POST[ 'pronunciation' ],
				 $_POST[ 'wordMeaning' ],
				 $_POST[ 'wordExample' ]
			   );
	}

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

	function addWord( $wordTitle,
					  $partsOfSpeech,
					  $wordlistId,
					  $pronunciation,
					  $wordMeaning,
					  $wordExample )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 	=> '',
							   'errCode' 	=> '',
						  	   'msg' 		=> '',
							   'data' 		=> ''
							 );

		$result = FALSE;

		/* Check for adding duplicated word */
		if( checkDuplicateWord( $wordTitle,
								$wordlistId,
								$wordMeaning ) )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '0002';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
		{
			/* Add new word */
			$query = 'INSERT INTO word( word, partOfSpeech, pronunciation, wordlistId )
					  VALUES ( "' . $wordTitle . '",' .
					  		 ' "' . $partsOfSpeech . '",' .
					  		 ' "' . $pronunciation . '",' .
					  		 ' "' . $wordlistId . '")';

			if( !execQuery( $query ) )
			{
				$responseData[ 'errState' ] = 'NG';
				$responseData[ 'errCode' ] = '0003';
				$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
			}
			else
			{
				/* Get word Id of new added word for adding meaning of word */
				$query = 'SELECT w.wordId
						  FROM word w
						  WHERE w.word = "' . $wordTitle . '" AND w.wordlistId = "' . $wordlistId . '"';

				if( !( $result = execQuery( $query ) ) ||
				    ( $result && $result->num_rows <= 0 ) )
				{
					$responseData[ 'errState' ] = 'NG';
					$responseData[ 'errCode' ] = '0004';
					$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
				}
				else
				{
					$wordId = $result->fetch_object()->wordId;

					/* Add meaning of new word */
					$query = 'INSERT INTO wordMeaning( meaning, wordId )
							  VALUES ( "' . $wordMeaning . '",' .
							         ' "' . $wordId . '")';

					if( !execQuery( $query ) )
					{
						$responseData[ 'errState' ] = 'NG';
						$responseData[ 'errCode' ] = '0005';
						$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
					}
					else
					{
						/* Get word meaning Id of new added word meaning for adding example of added word meaning */
						$query = 'SELECT wm.wordMeaningId
								  FROM wordmeaning wm
								  INNER JOIN word w
								  ON wm.wordId = w.wordId
								  WHERE w.wordId = "' . $wordId . '" AND wm.meaning = "' . $wordMeaning . '"';

						if( !( $result = execQuery( $query ) ) ||
						    ( $result && $result->num_rows <= 0 ) )
						{
							$responseData[ 'errState' ] = 'NG';
							$responseData[ 'errCode' ] = '0006';
							$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
						}
						else
						{
							$wordMeaningId = $result->fetch_object()->wordMeaningId;
							
							/* Add example of new added word meaning */
							$query = 'INSERT INTO wordexample( example, wordMeaningId )
									  VALUES ( "' . $wordExample . '",' .
									         ' "' . $wordMeaningId . '")';

							if( !execQuery( $query ) )
							{
								$responseData[ 'errState' ] = 'NG';
								$responseData[ 'errCode' ] = '0007';
								$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
							}
							else
							{
								ob_start();
								require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/word/wordView.php';
								$html = ob_get_contents();
								ob_end_clean();

								$responseData[ 'errState' ] = 'OK';
								$responseData[ 'htmlContent' ] = $html;
							}
						}
					}
				}
			}
		}

		$data = $responseData;
		header( 'Content-Type: application/json' );
		echo json_encode( $data );
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
                    
                    $modifiedNewMeaningVal = $ctrl->newVal;

                    break;

                case 'example':
                    $result = false;
                    $wordVal = '';

                	if( $modifiedNewWordVal != '' )
                		$wordVal = $modifiedNewWordVal;
                	else
                		$wordVal = $ctrl->word;

                	foreach( $ctrl->exampleList as $ex )
                	{
                		$result = updateExampleField( $wordVal, $ex->meaning, $ex->orgVal, $ex->newVal );
                	}                    
                	
                    if( $result[ 'errState' ] == 'NG' )
                    	return 0;
                    
                    break;

                default:
                    break;
			}
		}

		if( $inListFlag == false )
		{
			$data = array("errState" => "OK", 
						  "errCode" => "FFFF", 
						  "msg" => "Updated successfully", 
						  "htmlContent" => ""
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

				if( $newVal != '' )
				{
					$query = 'UPDATE wordexample as we
							  SET we.example = "' . $newVal . '" ' .
							  'WHERE we.wordExampleId="' . $wordExampleId . '"';
				}
				else
				{
					$query = 'DELETE FROM wordexample as we
							  WHERE we.wordExampleId="' . $wordExampleId . '"';
				}

				$result = $mysqli->query( $query );

				if ( $result != FALSE )
					$responseData[ 'errState' ] = 'OK';
				else
				{
					$responseData[ 'errState' ] = 'NG';
					$responseData[ 'errCode' ] = '0009';
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
					$responseData[ 'errCode' ] = '0010';
					$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
				}
			}
		}
		else
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '0008';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}

		return $responseData;
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

		if ( $result->num_rows > 0 ) 
		{
			$query = 'SELECT *
					  FROM wordmeaning wm
					  INNER JOIN word w
					  ON w.wordId = wm.wordId
					  WHERE wm.wordId = "' . $result->fetch_object()->wordId . '" AND wm.meaning = "' . $wordMeaning . '"';

			$result = $mysqli->query( $query );

			if ( $result->num_rows > 0 ) 
				return true;
		}

		return false;
	}

	function execQuery( $query )
	{
		global $mysqli;

		$result = $mysqli->query( $query );

		if( !$result )
			return 0;
		else
			return $result;
	}
?>
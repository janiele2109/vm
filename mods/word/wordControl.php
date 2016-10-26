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

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'delSelectedWords' )
	{
		delSelectedWords( $_POST[ 'selectedWordArr' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'updateWord' )
	{
		updateWord( $_POST[ 'modifiedRow' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'updateSelectedWords' )
	{
		updateSelectedWords( $_POST[ 'modifiedWordRowList' ] );
	}

	function getWordlistList()
	{
		$result = getWordlistListInDb();

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	function addWord( $wordTitle,
					  $partsOfSpeech,
					  $pronunciation,
					  $wordlistId,
					  $wordMeaning,
					  $wordExample )
	{
		$result = validateClientData( $wordTitle,
									  $partsOfSpeech,
									  $pronunciation,
									  $wordlistId,
									  $wordMeaning,
									  $wordExample );

		if ( $result[ 'errState' ] == 'OK' )
		{
			$result = checkDuplicateWord( $wordTitle,
										  $partsOfSpeech,
										  $wordlistId,
										  $wordMeaning );

			/* Word is not duplicated (includes word meaning) */
			if ( $result[ 'errState' ] == 'OK' )
			{
				if ( $result[ 'dataContent' ] == 0 )
				{
					$result = addWordToDb( $wordTitle,
										   $partsOfSpeech,
										   $pronunciation,
										   $wordlistId );
				}

				if ( $result[ 'errState' ] == 'OK' )
				{
					$wordId = getWordId( $wordTitle,
										 $wordlistId,
										 $partsOfSpeech );

					$result = addWordMeaningToDb( $wordId, $wordMeaning );

					if ( $result[ 'errState' ] == 'OK' )
					{
						if ( $wordExample != '' )
						{
							$wordMeaningId = getWordMeaningId( $wordId, $wordMeaning );

							$result = addWordExampleToDb( $wordMeaningId, $wordExample );
						}
						
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

	function delSelectedWords( $selectedWordArr )
	{
		$decodedSelectedWordArr = json_decode( $selectedWordArr );

		foreach( $decodedSelectedWordArr as $word )
		{
			$result = checkExistedWord( $word->word,
										$word->partOfSpeech,
										$word->wordlistName,
										$word->meaning );

			if ( $result[ 'errState' ] == 'OK' )
			{
				$result = deleteWordInDb( $word->word,
										  $word->partOfSpeech,
										  $word->wordlistName,
										  $word->meaning );

				if ( $result[ 'errState' ] == 'OK' )
					$result[ 'msg' ] = constant( '1052' );
			}
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	function updateWord( $modifiedRow, $inListFlag = false )
	{
		$decodedModifiedRow = null;

		if ( $inListFlag )
			$decodedModifiedRow = $modifiedRow;
		else
			$decodedModifiedRow = json_decode( $modifiedRow );

		$result = checkExistedWord( $decodedModifiedRow[ 0 ]->word->orgVal,
									$decodedModifiedRow[ 0 ]->partOfSpeech->orgVal,
									$decodedModifiedRow[ 0 ]->wordlist->orgVal,
									$decodedModifiedRow[ 0 ]->meaning->orgVal );

		if ( $result[ 'errState' ] == 'OK' )
		{
			$wordlistId = getWordlistId( $decodedModifiedRow[ 0 ]->wordlist->orgVal );
			$wordId = getWordId( $decodedModifiedRow[ 0 ]->word->orgVal,
								 $wordlistId,
								 $decodedModifiedRow[ 0 ]->partOfSpeech->orgVal );

			$wordMeaningId = getWordMeaningId( $wordId, $decodedModifiedRow[ 0 ]->meaning->orgVal );

			/* Update word title */
			if ( $decodedModifiedRow[ 0 ]->word->orgVal != $decodedModifiedRow[ 0 ]->word->newVal )
				$result = updateWordFieldInDb( $wordId,
											   $decodedModifiedRow[ 0 ]->word->newVal );

			/* Update word class */
			if ( $result[ 'errState' ] == 'OK' && $decodedModifiedRow[ 0 ]->partOfSpeech->orgVal != $decodedModifiedRow[ 0 ]->partOfSpeech->newVal )
				$result = updateWordClassFieldInDb( $wordId,
													$decodedModifiedRow[ 0 ]->partOfSpeech->newVal );

			/* Update word pronunciation */
			if ( $result[ 'errState' ] == 'OK' && $decodedModifiedRow[ 0 ]->pronunciation->orgVal != $decodedModifiedRow[ 0 ]->pronunciation->newVal )
				$result = updateWordPronunciationFieldInDb( $wordId,
															$decodedModifiedRow[ 0 ]->pronunciation->newVal );

			/* Update wordlist */
			if ( $result[ 'errState' ] == 'OK' && $decodedModifiedRow[ 0 ]->wordlist->orgVal != $decodedModifiedRow[ 0 ]->wordlist->newVal )
				$result = updateWordlistFieldInDb( $wordId,
												   $decodedModifiedRow[ 0 ]->wordlist->newVal );

			/* Update word meaning */
			if ( $result[ 'errState' ] == 'OK' && $decodedModifiedRow[ 0 ]->meaning->orgVal != $decodedModifiedRow[ 0 ]->meaning->newVal )
				$result = updateWordMeaningFieldInDb( $wordMeaningId,
													  $decodedModifiedRow[ 0 ]->meaning->newVal );

			/* Update examples */
			foreach( $decodedModifiedRow[ 0 ]->exampleList as $ex )
			{
				if ( $ex->orgVal != $ex->newVal && $ex->orgVal == '' )
					$result = addWordExampleToDb( $wordMeaningId,
												  $ex->newVal );

				else if ( $ex->orgVal != $ex->newVal && $ex->newVal == '' )
				{
					$wordExampleId = getWordExampleId( $wordMeaningId,
													   $ex->orgVal );

					$result = deleteWordExampleInDb( $wordExampleId );
				}
				else if ( $ex->orgVal != $ex->newVal && $ex->orgVal != '' )
					$result = updateWordExampleFieldInDb( $wordMeaningId,
														  $ex->orgVal,
														  $ex->newVal );

				if ( $result[ 'errState' ] == 'NG' )
					break;
			}
		}

		if ( $result[ 'errState' ] == 'OK' )
			$result[ 'msg' ] = constant( '1053' );

		if ( $inListFlag == false )
		{
			header( 'Content-Type: application/json' );
			echo json_encode( $result );
		}
		else
			return $result;
	}

	function updateSelectedWords( $modifiedWordRowList )
	{
		$decodedModifiedWordRowList = json_decode( $modifiedWordRowList );

		foreach( $decodedModifiedWordRowList as $modifiedWordRow )
		{
			$result = updateWord( $modifiedWordRow, true );

			if ( $result[ 'errState' ] == 'NG' )
				break;
		}

		if ( $result[ 'errState' ] == 'OK' )
		{
			$result[ 'dataContent' ] = reloadWordViewContent();
			$result[ 'msg' ] = constant( '1054' );
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	/* ===================== Word helper functions - START ===================== */

	function getWordlistId( $wordlistName )
	{
		global $mysqli;

		$query = 'SELECT wl.wordlistId
				  FROM wordlist wl
				  WHERE wl.wordlistName = "' . $wordlistName . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			return $result->fetch_object()->wordlistId;
		}

		return '';
	}

	function getWordId( $wordTitle, $wordlistId, $partsOfSpeech )
	{
		global $mysqli;

		$query = 'SELECT w.wordId
				  FROM word w
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId
				  WHERE w.word = "' . $wordTitle . '" AND w.partOfSpeech = "' . $partsOfSpeech . '" AND w.wordlistId = "' . $wordlistId . '"';

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

	function getWordExampleId( $wordMeaningId, $example )
	{
		global $mysqli;

		$query = 'SELECT we.wordExampleId
				  FROM wordexample we
				  WHERE we.wordMeaningId = "' . $wordMeaningId . '" AND we.example = "' . $example . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			return $result->fetch_object()->wordExampleId;
		}

		return '';
	}

	function hasRemainingMeaningOfWord( $wordId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'SELECT wm.wordMeaningId
				  FROM wordmeaning wm
				  INNER JOIN word w
				  ON w.wordId = wm.wordId
				  WHERE w.wordId = "' . $wordId . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			$responseData[ 'errState' ] = 'OK';
		}
		else
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1025';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}

		return $responseData;
	}

	function validateWord( $word )
	{
		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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

	function validateClientData( $wordTitle,
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
					}
				}
			}
		}

		return $result;
	}

	function checkDuplicateWord( $wordTitle,
								 $partsOfSpeech,
								 $wordlistId,
								 $wordMeaning )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'SELECT w.wordId
				  FROM word w
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId
				  WHERE w.word = "' . $wordTitle . '" AND w.partOfSpeech = "' . $partsOfSpeech . '" AND w.wordlistId = "' . $wordlistId . '"';

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
				$responseData[ 'errState' ] = 'NG';
				$responseData[ 'errCode' ] = '1008';
				$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
			}
			else
			{
				$responseData[ 'errState' ] = 'OK';
				$responseData[ 'dataContent' ] = 1;
			}
		}
		else
		{
			$responseData[ 'errState' ] = 'OK';
			$responseData[ 'dataContent' ] = 0;
		}

		return $responseData;
	}

	function checkExistedWord( $wordTitle,
							   $partOfSpeech,
							   $wordlistName,
							   $wordMeaning )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'SELECT w.wordId
				  FROM word w
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId
				  WHERE w.word = "' . $wordTitle . '" AND w.partOfSpeech = "' . $partOfSpeech . '" AND wl.wordlistName = "' . $wordlistName . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			$wordId = $result->fetch_object()->wordId;

			$query = 'SELECT *
					  FROM wordmeaning wm
					  INNER JOIN word w
					  ON w.wordId = wm.wordId
					  WHERE wm.wordId = "' . $wordId . '" AND wm.meaning = "' . $wordMeaning . '"';

			$result = $mysqli->query( $query );

			if ( $result != FALSE &&
				 $result->num_rows > 0 )
			{
				$responseData[ 'errState' ] = 'OK';
			}
			else
			{
				$responseData[ 'errState' ] = 'NG';
				$responseData[ 'errCode' ] = '1012';
				$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
			}
		}
		else
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1013';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}

		return $responseData;
	}

	function getWordlistListInDb()
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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

		return $responseData;
	}

	function deleteExamplesBelongsToWordMeaningIdInDb( $wordMeaningId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'DELETE FROM wordexample
				  WHERE wordMeaningId = "' . $wordMeaningId . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1015';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function deleteWordMeaningInDb( $wordMeaningId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'DELETE FROM wordmeaning
				  WHERE wordMeaningId = "' . $wordMeaningId . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1018';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function deleteWordExampleInDb( $wordExampleId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'DELETE FROM wordexample
				  WHERE wordExampleId = "' . $wordExampleId . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1026';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function deleteWordMeaningsBelongsToWordIdInDb( $wordId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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
				$responseData = deleteExamplesBelongsToWordMeaningIdInDb( $wordMeaningId[ 0 ] );

				if ( $responseData[ 'errState' ] == 'OK' )
				{
					$query = 'DELETE FROM wordmeaning
							  WHERE wordId = "' . $wordId . '"';

					$result = $mysqli->query( $query );

					if ( $result == FALSE )
					{
						$responseData[ 'errState' ] = 'NG';
						$responseData[ 'errCode' ] = '1016';
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

	function deleteWordsBelongToWordlistNameInDb( $wordlistName )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'SELECT w.wordId
				  FROM word w
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId
				  WHERE wl.wordlistName = "' . $wordlistName . '"';

		$words = $mysqli->query( $query );

		if ( $words != FALSE &&
			 $words->num_rows > 0 )
		{
			while ( $word = mysqli_fetch_row( $words ) )
			{
				$responseData = deleteWordMeaningsBelongsToWordIdInDb( $word[ 0 ] );

				if ( $responseData[ 'errState' ] == 'OK' )
				{
					$query = 'DELETE FROM word
							  WHERE wordId = "' . $word[ 0 ] . '"';

					$result = $mysqli->query( $query );

					if ( $result == FALSE )
					{
						$responseData[ 'errState' ] = 'NG';
						$responseData[ 'errCode' ] = '1017';
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

	function addWordExampleToDb( $wordMeaningId, $wordExample )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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

	function addWordMeaningToDb( $wordId, $meaning )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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

	function addWordToDb( $wordTitle,
						  $partOfSpeech,
						  $pronunciation,
						  $wordlistId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
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

	function deleteWordInDb( $wordTitle,
							 $partOfSpeech,
							 $wordlistName,
							 $wordMeaning )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'SELECT w.wordId, w.wordlistId, wm.wordMeaningId
				  FROM word w
				  INNER JOIN wordlist wl
				  ON w.wordlistId = wl.wordlistId
				  INNER JOIN wordmeaning wm
				  ON w.wordId = wm.wordId
				  WHERE w.word = "' . $wordTitle . '" AND w.partOfSpeech = "' . $partOfSpeech . '" AND wl.wordlistName = "' . $wordlistName . '" AND wm.meaning = "' . $wordMeaning . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			$resultObj = $result->fetch_object();

			$responseData = deleteExamplesBelongsToWordMeaningIdInDb( $resultObj->wordMeaningId );

			if ( $responseData[ 'errState' ] == 'OK' )
			{
				$responseData = deleteWordMeaningInDb( $resultObj->wordMeaningId );

				if ( $responseData[ 'errState' ] == 'OK' )
				{
					$responseData = hasRemainingMeaningOfWord( $resultObj->wordId );

					if ( $responseData[ 'errState' ] == 'NG' )
					{
						$query = 'DELETE FROM word
								  WHERE wordId = "' . $resultObj->wordId . '" AND partOfSpeech = "' . $partOfSpeech . '"';

						$result = $mysqli->query( $query );

						if ( $result == FALSE )
						{
							$responseData[ 'errState' ] = 'NG';
							$responseData[ 'errCode' ] = '1014';
							$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
						}
						else
							$responseData[ 'errState' ] = 'OK';
					}
				}
			}
		}
		else
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1012';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}

		return $responseData;
	}

	function updateWordFieldInDb( $wordlId, $newWord )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'UPDATE word
				  SET word = "' . $newWord .
				  '" WHERE wordId="' . $wordlId . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1019';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function updateWordClassFieldInDb( $wordId, $newVal )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'UPDATE word
				  SET partOfSpeech = "' . $newVal .
				  '" WHERE wordId ="' . $wordId . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1020';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function updateWordPronunciationFieldInDb( $wordId, $newVal )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'UPDATE word
				  SET pronunciation = "' . $newVal .
				  '" WHERE wordId ="' . $wordId . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1021';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function updateWordlistFieldInDb( $wordId, $newVal )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$wordlistId = getWordlistId( $newVal );

		$query = 'UPDATE word
				  SET wordlistId = "' . $wordlistId .
				  '" WHERE wordId="' . $wordId . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1022';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function updateWordMeaningFieldInDb( $wordMeaningId, $newVal )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'UPDATE wordmeaning
				  SET meaning = "' . $newVal .
				  '" WHERE wordMeaningId="' . $wordMeaningId . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1023';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function updateWordExampleFieldInDb( $wordMeaningId,
										 $exOldVal,
										 $exNewVal )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'UPDATE wordexample
				  SET example = "' . $exNewVal .
				  '" WHERE wordMeaningId="' . $wordMeaningId . '" AND example = "' . $exOldVal . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '1024';
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
?>
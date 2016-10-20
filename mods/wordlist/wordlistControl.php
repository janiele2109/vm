<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/word/wordControl.php';

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'addWordListName' )
	{
		addWordListName( $_POST[ 'wordlistName' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'delSelectedWordListNames' )
	{
		delSelectedWordListNames( $_POST[ 'wordlistNameArr' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'updateWordListName' )
	{
		updateWordListName( $_POST[ 'oldVal' ], $_POST[ 'newVal' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'updateSelectedWordListNames' )
	{
		updateSelectedWordListNames( $_POST[ 'wordlistNamesMap' ] );
	}

	function addWordListName( $wordlistName )
	{
		$result = validateWordlistName( $wordlistName );

		if ( $result[ 'errState' ] == 'OK' )
		{
			$result = checkDuplicateWordlistName( $wordlistName );

			/* New wordlist name is not duplicated */
			if ( $result[ 'errState' ] == 'OK' )
			{
				$result = addWordlistNameToDb( $wordlistName );

				/* Adding wordlist to DB is successful */
				if ( $result[ 'errState' ] == 'OK' )
				{
					$result[ 'dataContent' ] = reloadWordlistViewContent();
					$result[ 'msg' ] = constant( '0051' );
				}
			}
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	function delSelectedWordListNames( $wordlistNameArr )
	{
		foreach( $wordlistNameArr as $wordlistName )
		{
			$result = checkExistedWordlistName( $wordlistName );

			if ( $result[ 'errState' ] == 'OK' )
			{
				$result = deleteWordsBelongToWordlistNameInDb( $wordlistName );

				if ( $result[ 'errState' ] == 'OK' )
				{
					$result = deleteWordlistNameInDb( $wordlistName );

					if ( $result[ 'errState' ] == 'OK' )
						$result[ 'msg' ] = constant( '0052' );
				}
			}
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	function updateWordListName( $oldVal, $newVal, &$params = null )
	{
		if ( $params )
			$params[ 'cntWordlistNameTotal' ]++;

		$result = checkExistedWordlistName( $oldVal );

		/* If selected wordlist name for updating exists */
		if ( $result[ 'errState' ] == 'OK' )
		{
			$result = validateWordlistName( $newVal );

			/* If new wordlist name is valid */
			if ( $result[ 'errState' ] == 'OK' )
			{
				$result = checkDuplicateWordlistName( $newVal );

				/* New wordlist name is not duplicated */
				if ( $result[ 'errState' ] == 'OK' )
				{
					$result = updateWordlistNameToDb( $oldVal, $newVal );

					/* Updating new wordlist name successfully */
					if ( $result[ 'errState' ] == 'OK' )
						$result[ 'msg' ] = constant( '0053' );
				}
				else
				{
					if ( $params )
					{
						$params[ 'cntDuplicatedWordlistName' ]++;

						if ( empty( $params['duplicatedWordlistName'] ) )
							$params['duplicatedWordlistName'] = $newVal;
						else
							$params['duplicatedWordlistName'] = $params['duplicatedWordlistName'] . ", " . $newVal;
					}
				}
			}
		}

		if ( $params == null )
		{
			header( 'Content-Type: application/json' );
			echo json_encode( $result );
		}
		else
			$params[ 'result' ] = $result;
	}

	function updateSelectedWordListNames( $wordlistNamesMap )
	{
		$params = array('cntWordlistNameTotal' => 0, 
						'cntDuplicatedWordlistName' =>0,
						'duplicatedWordlistName' => '',
						'result' => null
						);

		foreach( $wordlistNamesMap as $oldVal => $newVal )
		{
			updateWordListName( $oldVal, $newVal, $params );
		}

		$result = $params[ 'result' ];

		/* If there is error cause of duplicated wordlist names */
		if ( ( $result != null &&
			  $result[ 'errState' ] == 'NG' ) ||
			 $params[ 'cntDuplicatedWordlistName' ] > 0 )
		{
			if ( $result[ 'errCode' ] == '0001' )
			{
				$range = $params['cntWordlistNameTotal'] - $params['cntDuplicatedWordlistName'];

				if ( $range == 1 )
					$result[ 'msg' ] = "Duplicated wordlist: " . $params['duplicatedWordlistName'] . "! Remaining wordlist is updated successfully!";
				else if ( $range > 1 )
					$result[ 'msg' ] = "Duplicated wordlist: " . $params['duplicatedWordlistName'] . "! Remaining wordlist are updated successfully!";
				else
					$result[ 'msg' ] = "Duplicated wordlist: " . $params['duplicatedWordlistName'];
			}
		}
		else
		{
			$result[ 'dataContent' ] = reloadWordlistViewContent();
			$result[ 'msg' ] = constant( '0054' );
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	/* ===================== Wordlist helper functions - START ===================== */

	function validateWordlistName( $wordlistName )
	{
		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		if ( $wordlistName == '' )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '0001';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function checkDuplicateWordlistName( $wordlistName )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'SELECT wordlistName
				  FROM wordlist
				  WHERE wordlistName="' . $wordlistName . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '0002';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function checkExistedWordlistName( $wordlistName )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'SELECT wordlistName
				  FROM wordlist
				  WHERE wordlistName="' . $wordlistName . '"';

		$result = $mysqli->query( $query );

		if ( $result != FALSE &&
			 $result->num_rows > 0 )
		{
			$responseData[ 'errState' ] = 'OK';
		}
		else
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '0003';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}

		return $responseData;
	}

	function addWordlistNameToDb( $wordlistName )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'INSERT INTO wordlist( wordlistName )
				  VALUES("' . $wordlistName . '")';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '0004';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function deleteWordlistNameInDb( $wordlistName )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'DELETE FROM wordlist
				  WHERE wordlistName="' . $wordlistName . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '0005';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function updateWordlistNameToDb( $oldVal, $newVal )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'UPDATE wordlist
				  SET wordlistName = "' . $newVal .
				  '" WHERE wordlistName="' . $oldVal . '"';

		$result = $mysqli->query( $query );

		if ( $result == FALSE )
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '0006';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}
		else
			$responseData[ 'errState' ] = 'OK';

		return $responseData;
	}

	function reloadWordlistViewContent()
	{
		ob_start();
		require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/wordlist/wordlistView.php';
		$html = ob_get_contents();
		ob_end_clean();

		return $html;
	}

	/* ===================== Wordlist helper functions - END ===================== */	
?>
<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/word/wordControl.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/mods/libs/commonLib.php';

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'addWordListName' )
	{
		addWordListName( $_POST[ 'wordlistName' ], $_POST[ 'username' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'delSelectedWordListNames' )
	{
		delSelectedWordListNames( $_POST[ 'wordlistNameArr' ], $_POST[ 'username' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'updateWordListName' )
	{
		updateWordListName( $_POST[ 'oldVal' ], $_POST[ 'newVal' ], $_POST[ 'username' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'updateSelectedWordListNames' )
	{
		updateSelectedWordListNames( $_POST[ 'wordlistNamesMap' ], $_POST[ 'username' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'updateScore' )
	{
		updateScore( $_POST[ 'score' ], $_POST[ 'wordlistId' ], $_POST[ 'username' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'getTotalWordlistsNum' )
	{
		getTotalWordlistsNum( $_POST[ 'username' ] );
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'switchWordlistPage' )
	{
		switchWordlistPage();
	}

	if ( isset( $_POST[ 'requestType' ] ) && $_POST[ 'requestType' ] == 'searchWordlistItem' )
	{
		searchWordlistItem();
	}

	function addWordListName( $wordlistName, $username )
	{
		$result = checkUserNameExists( $username );

		if ( $result[ 'errState' ] == 'OK' )
		{
			$userId = $result[ 'dataContent' ];

			$result = validateWordlistName( $wordlistName );

			if ( $result[ 'errState' ] == 'OK' )
			{
				$result = checkDuplicateWordlistName( $wordlistName, $userId );

				/* New wordlist name is not duplicated */
				if ( $result[ 'errState' ] == 'OK' )
				{
					$result = addWordlistNameToDb( $wordlistName, $userId );

					/* Adding wordlist to DB is successful */
					if ( $result[ 'errState' ] == 'OK' )
					{
						$result[ 'dataContent' ] = reloadWordlistViewContent();
						$result[ 'msg' ] = constant( '0051' );
					}
				}
			}
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	function delSelectedWordListNames( $wordlistNameArr, $username )
	{
		$result = checkUserNameExists( $username );

		if ( $result[ 'errState' ] == 'OK' )
		{
			$userId = $result[ 'dataContent' ];

			foreach( $wordlistNameArr as $wordlistName )
			{
				$result = checkExistedWordlistName( $wordlistName, $userId );

				if ( $result[ 'errState' ] == 'OK' )
				{
					$result = deleteWordsBelongToWordlistNameInDb( $wordlistName, $userId );

					if ( $result[ 'errState' ] == 'OK' )
					{
						$result = deleteWordlistNameInDb( $wordlistName, $userId );

						if ( $result[ 'errState' ] == 'OK' )
							$result[ 'msg' ] = constant( '0052' );
					}
				}
			}
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	function updateWordListName( $oldVal, $newVal, $username, &$params = null )
	{
		$result = checkUserNameExists( $username );

		if ( $result[ 'errState' ] == 'OK' )
		{
			$userId = $result[ 'dataContent' ];

			if ( $params )
				$params[ 'cntWordlistNameTotal' ]++;

			$result = checkExistedWordlistName( $oldVal, $userId );

			/* If selected wordlist name for updating exists */
			if ( $result[ 'errState' ] == 'OK' )
			{
				$result = validateWordlistName( $newVal );

				/* If new wordlist name is valid */
				if ( $result[ 'errState' ] == 'OK' )
				{
					$result = checkDuplicateWordlistName( $newVal, $userId );

					/* New wordlist name is not duplicated */
					if ( $result[ 'errState' ] == 'OK' )
					{
						$result = updateWordlistNameToDb( $oldVal, $newVal, $userId );

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
		}

		if ( $params == null )
		{
			header( 'Content-Type: application/json' );
			echo json_encode( $result );
		}
		else
			$params[ 'result' ] = $result;
	}

	function updateSelectedWordListNames( $wordlistNamesMap, $username )
	{
		$result = checkUserNameExists( $username );

		if ( $result[ 'errState' ] == 'OK' )
		{
			$userId = $result[ 'dataContent' ];

			$params = array('cntWordlistNameTotal' => 0, 
							'cntDuplicatedWordlistName' =>0,
							'duplicatedWordlistName' => '',
							'result' => null
							);

			foreach( $wordlistNamesMap as $oldVal => $newVal )
			{
				updateWordListName( $oldVal, $newVal, $username, $params );
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
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	function updateScore( $score, $wordlistId, $username )
	{
		$result = checkUserNameExists( $username );

		if ( $result[ 'errState' ] == 'OK' )
		{
			$userId = $result[ 'dataContent' ];

			global $mysqli;

			$result = array(
				               'errState' 		=> '',
						       'errCode' 		=> '',
					  	       'msg' 			=> '',
						       'dataContent' 	=> ''
						   );

			$query = 'UPDATE wordlist
					  SET score = "' . $score .
					  '" WHERE wordlistId="' . $wordlistId . '" AND userId = "' . $userId . '"';

			$ret = $mysqli->query( $query );

			if ( $ret == FALSE )
			{
				$result[ 'errState' ] = 'NG';
				$result[ 'errCode' ] = '0008';
				$result[ 'msg' ] = constant( $responseData[ 'errCode' ] );
			}
			else
				$result[ 'errState' ] = 'OK';

			header( 'Content-Type: application/json' );
			echo json_encode( $result );
		}
	}

	function getTotalWordlistsNum( $username )
	{
		global $mysqli;

		$result = array(
			               'errState' 		=> '',
					       'errCode' 		=> '',
				  	       'msg' 			=> '',
					       'dataContent' 	=> ''
					   );

		$query = 'SELECT *
				  FROM wordlist wl
				  INNER JOIN users u
				  ON wl.userId = u.userId
				  WHERE u.userName = "' . $username . '" ';

		if ( isset( $_POST[ 'wordlistName' ] ) && $_POST[ 'wordlistName' ] != '' )
			$query = $query . 'AND wl.wordlistName = "' . $_POST[ 'wordlistName' ] . '" ';

		if ( isset( $_POST[ 'wordlistId' ] ) && $_POST[ 'wordlistId' ] != '' )
		{
			if ( $_POST[ 'wordlistId' ] != 'allWordlists' )
				$query = $query . 'AND wl.wordlistId = "' . $_POST[ 'wordlistId' ] . '" ';
		}

		$ret = $mysqli->query( $query );

		if ( $ret != null )
		{
			$result[ 'dataContent' ] = $ret->num_rows;
			$result[ 'msg' ] = '';
			$result[ 'errState' ] = 'OK';
		}

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	function switchWordlistPage()
	{
		$result = array(
			               'errState' 		=> '',
					       'errCode' 		=> '',
				  	       'msg' 			=> '',
					       'dataContent' 	=> ''
					   );

		$result[ 'dataContent' ] = reloadWordlistViewContent();
		$result[ 'msg' ] = '';
		$result[ 'errState' ] = 'OK';

		header( 'Content-Type: application/json' );
		echo json_encode( $result );
	}

	function searchWordlistItem()
	{
		$result = array(
			               'errState' 		=> '',
					       'errCode' 		=> '',
				  	       'msg' 			=> '',
					       'dataContent' 	=> ''
					   );

		$result[ 'dataContent' ] = reloadWordlistViewContent();
		$result[ 'msg' ] = '';
		$result[ 'errState' ] = 'OK';

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

	function checkDuplicateWordlistName( $wordlistName, $userId )
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
				  WHERE wordlistName="' . $wordlistName . '" AND userId = "' . $userId . '"';

		$result = $mysqli->query( $query );

		if ( $result != null &&
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

	function checkExistedWordlistName( $wordlistName, $userId )
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
				  WHERE wordlistName = "' . $wordlistName . '" AND userId = "' . $userId . '"';

		$result = $mysqli->query( $query );

		if ( $result != null &&
			 $result->num_rows > 0 )
		{
			$responseData[ 'errState' ] = 'OK';
		}
		else
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '0003';
			$responseData[ 'msg' ] = $wordlistName . ' - ' . $userId;
		}

		return $responseData;
	}

	function addWordlistNameToDb( $wordlistName, $userId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'INSERT INTO wordlist( wordlistName, userId )
				  VALUES("' . $wordlistName . '", "' . $userId . '")';

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

	function deleteWordlistNameInDb( $wordlistName, $userId )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'DELETE FROM wordlist
				  WHERE wordlistName = "' . $wordlistName . '" AND userId = "' . $userId . '"';

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

	function updateWordlistNameToDb( $oldVal, $newVal, $userId )
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
				  '" WHERE wordlistName="' . $oldVal . '" AND userId = "' . $userId . '"';

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
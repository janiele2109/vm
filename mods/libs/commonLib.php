<?php
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/db/mysql.connect.php';
	require_once $_SERVER[ 'DOCUMENT_ROOT' ] . '/config/constants.php';

	function checkUserNameExists( $username )
	{
		global $mysqli;

		$responseData = array(
					           'errState' 		=> '',
							   'errCode' 		=> '',
						  	   'msg' 			=> '',
							   'dataContent' 	=> ''
							 );

		$query = 'SELECT userId
				  FROM users
				  WHERE userName="' . $username . '"';

		$result = $mysqli->query( $query );

		if ( $result != null &&
			 $result->num_rows > 0 )
		{
			$responseData[ 'errState' ] = 'OK';
			$responseData[ 'dataContent' ] = $result->fetch_object()->userId;
		}
		else
		{
			$responseData[ 'errState' ] = 'NG';
			$responseData[ 'errCode' ] = '0007';
			$responseData[ 'msg' ] = constant( $responseData[ 'errCode' ] );
		}

		return $responseData;
	}
?>
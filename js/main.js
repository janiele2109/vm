$( document ).ready( function() {

/* =========================== Event functions - START =========================== */

	$( window ).on( 'load', function( event ) {
		$( this ).bindEventsToControls();

		$( this ).toggleActiveMenuItem( MENU_ITEM_TEST );

		$( '#testBtn' ).focus();
	} );

/* =========================== Event functions - END =========================== */



/* =========================== Ajax functions - START =========================== */

	$.fn.getTotalValueInStatistic = function( pageType, inSearch ) {
		var sendingData = {};
		var requestTypeData = '';
		var urlData = '';
		var pageIndexData = '';

		if ( inSearch == true )
		{
			if ( pageType == 'word' )
			{
				urlData = '/mods/word/wordControl.php';
				requestTypeData = 'getTotalWordsNum';
				pageIndexData = $( '#wordCurPage' ).val().trim();

		        sendingData = {
			        word: $( '#searchWordTextBox' ).val().trim(),
			        wordClass: $( '#searchPartOfSpeechTextBox' ).val().trim(),
			        wordlistName: $( '#searchWordlistTextBox' ).val().trim(),
			        nativeMeaning: $( '#searchNativeMeaningTextBox' ).val().trim(),
			        pageIndex: pageIndexData,
			        username: $( '#userName' ).text(),
			        requestType: requestTypeData
			    };
			}
			else if ( pageType == 'wordlist' )
			{
				urlData = '/mods/wordlist/wordlistControl.php';
				requestTypeData = 'getTotalWordlistsNum';
				pageIndexData = $( '#wordlistCurPage' ).val().trim();

				sendingData = {
			        wordlistName: $( '#searchWordlistTextBox' ).val().trim(),
			        pageIndex: pageIndexData,
			        username: $( '#userName' ).text(),
			        requestType: requestTypeData
			    };
			}
		}
		else
		{
			if ( pageType == 'word' )
			{
				urlData = '/mods/word/wordControl.php';
				requestTypeData = 'getTotalWordsNum';
				pageIndexData = $( '#wordCurPage' ).val().trim();
			}

			else if ( pageType == 'wordlist' )
			{
				urlData = '/mods/wordlist/wordlistControl.php';
				requestTypeData = 'getTotalWordlistsNum';
				pageIndexData = $( '#wordlistCurPage' ).val().trim();
			}

			sendingData = {
				username: $( '#userName' ).text(),
				pageIndex: pageIndexData,
				requestType: requestTypeData
			};
		}

		$.ajax( {
			url: urlData,
			type: 'post',
			dataType: 'json',
			cache: false,
			error:
				function( xhr, status, error ) {
					$( this ).displayErrMsg( xhr.responseText );
				},
			success:
				function( response, status ) {
					/* In case response from server is successful */
                    if ( $( this ).isServerResponseOk( response, status ) )
                    {
                    	if ( pageType == 'word' )
							$( this ).getTotalWordNumOnSuccess( response, status );
						else
							$( this ).getTotalWordlistNumOnSuccess( response, status );
					}
				},
			data: sendingData
		} );
	}

	$.fn.switchPageRequest = function( pageType, inSearch ) {
		var requestTypeData;
		var sendingData = {};
		var urlData = '';
		var pageIndexData = '';

		if ( inSearch == true )
		{
			if ( pageType == 'word' )
			{
				requestTypeData = 'switchWordPage';
				urlData = '/mods/word/wordControl.php';
				pageIndexData = $( '#wordCurPage' ).val().trim();

		        sendingData = {
			        word: $( '#searchWordTextBox' ).val().trim(),
			        wordClass: $( '#searchPartOfSpeechTextBox' ).val().trim(),
			        wordlistName: $( '#searchWordlistTextBox' ).val().trim(),
			        nativeMeaning: $( '#searchNativeMeaningTextBox' ).val().trim(),
			        pageIndex: pageIndexData,
			        username: $( '#userName' ).text(),
			        requestType: requestTypeData
			    };
			}
			else if ( pageType == 'wordlist' )
			{
				requestTypeData = 'switchWordlistPage';
				urlData = '/mods/wordlist/wordlistControl.php';
				pageIndexData = $( '#wordlistCurPage' ).val().trim();

				sendingData = {
			        wordlistName: $( '#searchWordlistTextBox' ).val().trim(),
			        pageIndex: pageIndexData,
			        username: $( '#userName' ).text(),
			        requestType: requestTypeData
			    };
			}
		}
		else
		{
			if ( pageType == 'word' )
			{
				requestTypeData = 'switchWordPage';
				urlData = '/mods/word/wordControl.php';
				pageIndexData = $( '#wordCurPage' ).val().trim();
			}

			else if ( pageType == 'wordlist' )
			{
				requestTypeData = 'switchWordlistPage';
				urlData = '/mods/wordlist/wordlistControl.php';
				pageIndexData = $( '#wordlistCurPage' ).val().trim();
			}

			sendingData = {
				username: $( '#userName' ).text(),
				pageIndex: pageIndexData,
				requestType: requestTypeData
			};
		}

		$.ajax( {
			url: urlData,
			type: 'post',
			dataType: 'json',
			cache: false,
			error:
				function( xhr, status, error ) {
					$( this ).displayErrMsg( xhr.responseText );
				},
			success:
				function( response, status ) {
					/* In case response from server is successful */
                    if ( $( this ).isServerResponseOk( response, status ) )
                    {
						$( this ).resetControlInfo( response[ 'msg' ] );

						if ( pageType == 'word' )
						{
                        	$( this ).reloadWordViewTbl( response[ 'dataContent' ] );

                        	$( this ).updateWordsOnCurrentPage( false );
						}
                        else if ( pageType == 'wordlist' )
                        {
                        	$( this ).reloadWordlistViewTbl( response[ 'dataContent' ] );

                        	$( this ).updateWordlistsStatistic( $( '#totalWordlistsSpan' ).text(), false );
                        }

                        $( this ).bindEventsToControls();
					}
				},
			data: sendingData
		} );
	}

	$.fn.switchMenuItem = function( event, requestMenuItem ) {
		event.preventDefault();

		var currentUri = window.location.pathname.split( '/' )[ 1 ];
		var requestUri = '';

		if ( requestMenuItem == MENU_ITEM_TEST )
			requestUri = '/mods/test/testForm.php';

		else if ( requestMenuItem == MENU_ITEM_WORD )
			requestUri = '/mods/word/wordForm.php';

		else if ( requestMenuItem == MENU_ITEM_WORDLIST )
			requestUri = '/mods/wordlist/wordlistForm.php';

		history.pushState( '', document.title, '/' + requestMenuItem );

		var sendingData = {
			username: $( '#userName' ).text(),
			requestType: 'getPageContent'
		};

		$.ajax( {
			url: requestUri,
			type: 'post',
			success:
				function( response, status ) {
					$( this ).getPageContentOnSuccess( response, status, currentUri, requestMenuItem );

					if ( requestMenuItem == MENU_ITEM_WORD )
					{
						$( this ).fillHiddenWordlistCb();
						$( this ).getTotalValueInStatistic( 'word', false );
						$( this ).updateTotalWordMeaningsValueInStatistic( false );
					}
					else if ( requestMenuItem == MENU_ITEM_WORDLIST )
					{
						$( this ).getTotalValueInStatistic( 'wordlist', false );
					}
				},
			data: sendingData
		} );
	}

/* =========================== Ajax functions - END =========================== */



/* =========================== Helper functions - START =========================== */

    $.fn.resetCheckboxOfRow = function( rowObj ) {
        var chkBoxObj = rowObj.find( 'input[type="checkbox"]' );

        $.each( chkBoxObj, function() {
            $( this ).prop( 'checked', false );
        } );
    }

	$.fn.displayErrMsg = function( errMsg ) {
		if ( $( '#msgDiv' ).length > 0 )
		{
			$( '#msgDiv' ).text( errMsg );
			$( '#msgDiv' ).css( 'visibility', 'visible' );
			$( '#msgDiv' ).addClass( 'err' );
		}
	}

	$.fn.toggleActiveMenuItem = function( menuItem ) {
		$( '.menuItem' ).removeClass( 'active' );

		if ( menuItem == MENU_ITEM_TEST )
			$( '#menuItemTest' ).addClass( 'active' );
		else if ( menuItem == MENU_ITEM_WORD )
			$( '#menuItemWord' ).addClass( 'active' );
		else if ( menuItem == MENU_ITEM_WORDLIST )
			$( '#menuItemWordlist' ).addClass( 'active' );
	}

	$.fn.isServerResponseOk = function( response, status ) {
		if ( status != 'success' || response[ 'errState' ] != 'OK' )
		{
			$( this ).displayErrMsg( response[ 'msg' ] );
			return false;
		}
		else
			return true;
	}

	$.fn.resetControlInfo = function( msg ) {
		/* Update message information */
		if ( $( '#msgDiv' ).length > 0 &&
			 msg != EMPTY_STRING )
		{
			$( '#msgDiv' ).text( msg );
			$( '#msgDiv' ).css( 'visibility', 'visible' );
			$( '#msgDiv' ).removeClass( 'err' );
		}

		/* Reset checkbox 'Select all' */
		$( '#selectAllChkbox' ).prop( 'checked', false );
	}

	$.fn.removeRedundantBrTag = function() {
		var tempObj = null;

		while ( ( tempObj = $( this ).prev() ) )
			if ( tempObj.length > 0 && tempObj.prop( 'tagName' ) == 'BR' )
				tempObj.remove();
			else
				break;

		while ( ( tempObj = $( this ).next() ) )
			if ( tempObj.length > 0 && tempObj.prop( 'tagName' ) == 'BR' )
				tempObj.remove();
			else
				break;
	}

	$.fn.checkAndBindEventForEle = function( control,
											 requestEvents,
											 bindFunction,
											 param = null )
	{
		if ( control != null && control != undefined )
		{
			var bindedEvents = undefined;
			var keysArr = null;

			/* If passing control is element ID */
			if ( typeof control == 'string' )
			{
				var eleId = control.replace( '#', '' );
				var eleObj = document.getElementById( eleId );

				if ( eleObj != null )
					bindedEvents = $._data( eleObj, 'events' );
			}
			else if ( typeof control == 'object' )
			{
				bindedEvents = $._data( control, 'events' );
			}

			for ( var i = 0; i < requestEvents.length; i++ )
			{
				var exist = false;

				if( bindedEvents !== undefined )
				{
					keysArr = Object.keys( bindedEvents );

					keysArr.forEach( function( curVal ) {
										if ( requestEvents[ i ] == 'mouseenter' )
											requestEvents[ i ] = 'mouseover';

										if ( curVal == requestEvents[ i ] )
											exist = true;
									 } );

					if ( exist )
						continue;
				}

				if ( bindedEvents === undefined || !exist )
					if ( param )
						$( control ).bind( requestEvents[ i ], param, bindFunction );
					else
						$( control ).bind( requestEvents[ i ], bindFunction );
			}
		}
	}

	$.fn.checkAndbindEventsForSelectors = function( selectors,
													requestEvents,
													bindFunction,
													param = null )
	{
		$.each( $( selectors ), function() {
									$( this ).checkAndBindEventForEle( $( this ),
																	   requestEvents,
																	   bindFunction,
																	   param );
								} );
	}

	$.fn.bindInputTextEvents = function() {
		var eventArr = new Array();

		( eventArr = [] ).push( 'blur' );
		$( this ).checkAndbindEventsForSelectors( 'input[type=text][data-controltranstype]',
												  eventArr,
												  $.fn.toSpanControl,
												  { spanControlTranstype: 'input-text' } );

		( eventArr = [] ).push( 'keypress' );
		$( this ).checkAndbindEventsForSelectors( 'input[type=text][data-controltranstype]',
												  eventArr,
												  $.fn.editableControlOnKeyPress );

		eventArr = null;
	}

	$.fn.bindSelectEvents = function() {
		var eventArr = new Array();

		( eventArr = [] ).push( 'blur' );
		$( this ).checkAndbindEventsForSelectors( 'select[data-controltranstype]',
												  eventArr,
												  $.fn.toSpanControl,
												  { spanControlTranstype: 'select' } );

		$( this ).checkAndbindEventsForSelectors( 'select[data-controltranstype]',
												  eventArr,
												  $.fn.editableControlOnKeyPress );

		eventArr = null;
	}

	$.fn.bindTextAreaEvents = function() {
		var eventArr = new Array();

		( eventArr = [] ).push( 'blur' );
		$( this ).checkAndbindEventsForSelectors( 'textarea[data-controltranstype]',
												  eventArr,
												  $.fn.toNonEditableControl,
												  {
													  spanControlTranstype: 'textarea',
													  divControlTranstype: 'button'
												  } );

		eventArr = null;
	}

	$.fn.bindSpanEvents = function() {
		var eventArr = new Array();

		( eventArr = [] ).push( 'mouseenter' );
		$( this ).checkAndbindEventsForSelectors( 'span[data-controltranstype]',
												  eventArr,
												  $.fn.toggleControlOnHover );

		eventArr = null;
	}

	$.fn.bindGeneralEvents = function() {
		var eventArr = new Array();

		( eventArr = [] ).push( 'change' );
		$( this ).checkAndBindEventForEle( '#selectAllChkbox',
										   eventArr,
										   $.fn.selectAllChkboxOnChange );

		( eventArr = [] ).push( 'mouseenter', 'mouseleave' );
		$( this ).checkAndbindEventsForSelectors( '.toggleEnabled',
												  eventArr,
												  $.fn.toggleControlOnHover );

		eventArr = null;
	}

	$.fn.bindEventsToControls = function() {
		/* Bind events to controls of new wordlist rows */
		$( this ).bindGeneralEvents();

		$( this ).bindTestEvents();

		$( this ).bindWordlistEvents();

		$( this ).bindWordEvents();
	}

	$.fn.getTagDisplayVal = function() {
		var returnVal = '';

		switch( $( this ).prop( 'tagName' ) )
		{
			case 'SPAN':
			case 'DIV':
			case 'BUTTON':
				returnVal = $( this ).text();
				break;

			case 'SELECT':
				returnVal = $( this ).find( ':selected' ).text();
				break;

			case 'INPUT':
			case 'TEXTAREA':
				returnVal = $( this ).val();
				break;

			default:
				break;
		}

		return returnVal;
	}

	$.fn.toInputTextControl = function( displayVal, controlTranstype ) {
		var inputTag = document.createElement( 'INPUT' );
		var parentPadding = $( this ).parent().css( 'padding-right' ).replace( 'px', '' );
		var parentWidth = $( this ).parent().width();

		$.each( this[ 0 ].attributes, function( i, attrib ) {
										  if ( attrib.name != 'id' )
											  $( inputTag ).attr( attrib.name, attrib.value );
									  } );

		inputTag.type = 'text';

		$( inputTag ).attr( 'data-controltranstype', controlTranstype );

		inputTag.style.width = parentWidth - parentPadding - 1 + 'px';

		$( this ).replaceWith( inputTag );

		$( inputTag ).focus();
		$( inputTag ).val( displayVal );

		$( this ).bindInputTextEvents();

		return inputTag;
	}

	$.fn.toSelectControl = function( displayVal,
									 controlTranstype,
									 dataSource ) 
	{
		var selectTag = document.createElement( 'SELECT' );

		$.each( this[ 0 ].attributes, function( i, attrib ) {
										  if ( attrib.name != 'id' )
											  $( selectTag ).attr( attrib.name, attrib.value );
									  } );

		$( selectTag ).attr( 'data-controltranstype', controlTranstype );

		selectTag.style.width = $( this ).parent().width() + 'px';

		dataSource.clone().appendTo( selectTag );

		$.each( $( selectTag ).children().filter( function() {
													  return $( this ).text() == displayVal;
												  } ),
												  function() {
													  $( this ).prop( 'selected', true );
												  } );

		$( selectTag ).css( 'display', 'block' );

		$( selectTag ).find( 'option' ).css( 'color', 'black' );
		$( selectTag ).find( 'option:selected' ).css( 'color', $( this ).css( 'color' ) );

		$( this ).replaceWith( selectTag );

		$( selectTag  ).focus();

		$( this ).bindSelectEvents();

		return selectTag;
	}

	$.fn.toTextAreaControl = function( displayVal, controlTranstype ) {
		var textarea = document.createElement( 'TEXTAREA' );

		$.each( this[ 0 ].attributes, function( i, attrib ) {
										  if ( attrib.name != 'id' )
											  $( textarea ).attr( attrib.name, attrib.value );
									  } );

		$( textarea ).attr( 'data-controltranstype', controlTranstype );

		$( this ).replaceWith( textarea );

		if ( $( this ).prop( 'tagName' ) == 'BUTTON' )
			$( textarea ).addClass( 'exampleTextArea' );

		$( textarea ).focus();
		$( textarea ).val( displayVal );

		$( this ).bindTextAreaEvents();

		return textarea;
	}

	$.fn.toButtonControl = function( buttonId, buttonLabel ) {
		var buttonTag = document.createElement( 'BUTTON' );

		$.each( this[ 0 ].attributes, function( i, attrib ) {
										  if ( attrib.name != 'id' )
											  $( buttonTag ).attr( attrib.name, attrib.value );
									  } );

		$( buttonTag ).prop( 'id', buttonId );
		$( buttonTag ).html( buttonLabel );

		$( buttonTag ).removeAttr( 'style' );
		$( buttonTag ).removeClass( 'transEffect' );

		$( buttonTag ).addClass( 'exampleBtn' );

		return buttonTag;
	}

	$.fn.toSpanControl = function( param ) {
		var spanTag = document.createElement( 'SPAN' );
		var chkboxObj = $( this ).parent().parent().find( 'input[type="checkbox"]' );
		var displayVal = $( this ).getTagDisplayVal().trim();
		var classString = $( this ).attr( 'class' );
		var dataSourceName = '';

		$.each( $( this )[ 0 ].attributes, function( i, attrib ) {
											   if ( attrib.name != 'id' )
												   $( spanTag ).attr( attrib.name, attrib.value );
										   } );

		$( spanTag ).attr( 'data-controltranstype', param.data.spanControlTranstype );

		if ( classString.search( 'partOfSpeech' ) != -1 )
			dataSourceName = 'data-sourcepos';

		else if ( classString.search( 'pronunciation' ) != -1 )
			dataSourceName = 'data-sourcepron';

		else if ( classString.search( 'wordlist' ) != -1 )
			dataSourceName = 'data-sourcewordlistname';

		else if ( classString.search( 'nativemeaning' ) != -1 )
			dataSourceName = 'data-sourcenativemeaning';

		else if ( classString.search( 'meaning' ) != -1 )
			dataSourceName = 'data-sourcemeaning';

		else if ( classString.search( 'word' ) != -1 )
			dataSourceName = 'data-sourceword';

		if ( $( spanTag ).attr( dataSourceName ).trim() != displayVal )
		{
			$( spanTag ).addClass( 'modified' );
			spanTag.style.color = 'red';
			chkboxObj.first().prop( 'checked', true );
		}
		else
		{
			$( spanTag ).removeClass( 'modified' );
			spanTag.style.color = 'black';
		}

		spanTag.innerHTML = displayVal;

		$( this ).replaceWith( spanTag );

		$( this ).bindSpanEvents();

		return spanTag;
	}

	$.fn.toDivControl = function( param ) {
		var divTag = document.createElement( 'DIV' );
		var chkboxObj = $( this ).parent().parent().find( 'input[type="checkbox"]' );
		var displayVal = $( this ).getTagDisplayVal().trim();
		var classString = $( this ).attr( 'class' );
		var parentPadding = $( this ).parent().css( 'padding-right' ).replace( 'px', '' );
		var parentWidth = $( this ).parent().width();
		var dataSourceName = '';

		$.each( $( this )[ 0 ].attributes, function( i, attrib ) {
											   if ( attrib.name != 'id' )
												   $( divTag ).attr( attrib.name, attrib.value );
										   } );

		$( divTag ).attr( 'data-controltranstype', param.data.divControlTranstype );

		$( divTag ).removeAttr( 'style' );
		$( divTag ).addClass( 'transEffect' );
		$( divTag ).removeClass( 'exampleTextArea ' );

		if ( classString.search( 'example' ) != -1 )
			dataSourceName = 'data-sourceexample';

		if ( classString.search( 'exampleTd' ) != -1 )
		{
			$( divTag ).addClass( 'exampleEntry' );
			$( divTag ).removeClass( 'exampleTd' );
		}

		if ( $( divTag ).attr( dataSourceName ).trim() != displayVal )
		{
			$( divTag ).addClass( 'modified' );
			divTag.style.color = 'red';
			chkboxObj.first().prop( 'checked', true );
		}
		else
		{
			$( divTag ).removeClass( 'modified' );
			divTag.style.color = 'black';
		}

		$( divTag ).text( displayVal );

		$( this ).replaceWith( divTag );

		$( this ).bindExampleEvents();

		return divTag;
	}

	$.fn.toEditableControls = function() {
		if ( $( '#enableEditting' ).prop( 'checked' ) == true )
		{
			switch( $( this ).attr( 'data-controlTransType' ) )
			{
				case 'input-text':
					$( this ).toInputTextControl( $( this ).getTagDisplayVal(), 'span' );
					break;

				case 'select':
					var dataSource = null;

					if ( $( this ).attr( 'class' ).indexOf( 'partOfSpeech' ) != -1 )
						dataSource = $( '#wordClassCb option' );

					else if ( $( this ).attr( 'class' ).indexOf( 'wordlist' ) != -1 )
						dataSource = $( '#hiddenWordlistCb option' );

					$( this ).toSelectControl( $( this ).getTagDisplayVal(),
											   'span',
											   dataSource );
					break;

				case 'textarea':
					var controlTranstype = 'span';

					if ( $( this ).attr( 'class' ).indexOf( 'exampleEntry' ) != -1 )
						controlTranstype = 'div';

					$( this ).toTextAreaControl( $( this ).getTagDisplayVal(), controlTranstype );
					break;

				default:
					break;
			}
		}
	}

	$.fn.toNonEditableControl = function( param ) {
		switch( $( this ).attr( 'data-controlTransType' ) )
		{
			case 'span':
				$( this ).toSpanControl( param );
				break;

			case 'div':
				if ( $( this ).val() == '' &&
					 $( this ).attr( 'data-sourceexample' ) == $( this ).val() )
				{
					var prevEle = $( this ).prev();

					while ( prevEle.length > 0 && prevEle.prop( 'tagName' ) == 'BR' )
						prevEle = $( prevEle ).prev();

					$( this ).remove();
					$( prevEle ).removeRedundantBrTag();
				}

				else
				{
					var divTag = $( this ).toDivControl( param );

					$( divTag ).removeRedundantBrTag();

					var nextEle = $( divTag ).next();
					var prevEle = $( divTag ).prev();

					if ( prevEle.length > 0 &&
						 prevEle.prop( 'tagName' ) == 'DIV' )
						$( '<br/>' ).insertBefore( divTag );

					if ( nextEle.length > 0 &&
						 nextEle.prop( 'tagName' ) == 'DIV' )
						$( '<br/>' ).insertAfter( divTag );
				}
				break;

			default:
				break;
		}
	}

	$.fn.toggleControlOnHover = function( event ) {

		if ( event.type == 'mouseenter' && $( this ).prop( 'tagName' ) == 'TD' )
			$.each( $( this ).find( '[data-controlTransType]' ), $.fn.toEditableControls );

		if ( $( this ).prop( 'tagName' ) == 'SPAN' )
			$( this ).toEditableControls();
	}

	$.fn.getPageContentOnSuccess = function( response, status, currentUri, requestMenuItem ) {
		var pageType = '';
		var focusControl = '';

		if ( currentUri == MENU_ITEM_TEST )
			pageType = 'testForm';

		else if ( currentUri == MENU_ITEM_WORD )
			pageType = 'wordForm';

		else if ( currentUri == MENU_ITEM_WORDLIST )
			pageType = 'wordlistForm';

		if ( $( '#' + pageType ).length > 0 )
			$( '#' + pageType ).replaceWith( response );

		if ( requestMenuItem == MENU_ITEM_TEST )
			focusControl = '#testBtn';

		else if ( requestMenuItem == MENU_ITEM_WORD )
			focusControl = '#addNewWordTextBox';

		else if ( requestMenuItem == MENU_ITEM_WORDLIST )
			focusControl = '#addNewWordlistTextBox';

		$( focusControl ).focus();

		$( this ).bindEventsToControls();
	}

	$.fn.selectAllChkboxOnChange = function( event ) {
		var checkedStatus = $( this ).prop( 'checked' );

		$( 'tbody tr td input[type="checkbox"]' ).each( function() {
															$( this ).prop( 'checked', checkedStatus );
														} );
	}

	$.fn.editableControlOnKeyPress = function( event ) {
		if ( event.which == 13 )
			$( this ).toSpanControl( { data: { spanControlTranstype: 'input-text' } } );
	}


	/* -------- Paging helper functions - START -------- */

    $.fn.validatePageIndex = function( pageType, pageIndex )
    {
    	var totalPageEleId;

    	if ( pageType == 'word' )
    		totalPageEleId = '#wordTotalPage';
    	else if ( pageType == 'wordlist' )
    		totalPageEleId = '#wordlistTotalPage';

        if ( pageIndex == EMPTY_STRING ||
             pageIndex < 0 ||
             pageIndex > $( totalPageEleId ).text() )
            return ERR_1005;
        else
            return EMPTY_STRING;
    }

	$.fn.updateStatisticValue = function( id, value ) {
		$( '#' + id ).html( value );
	}

    $.fn.updateRecordNumOnCurPage = function( pageType, resetCurPage ) {
    	var curPageTextboxEleId, curPageSpanEleId;

        if ( pageType == 'word' )
        {
        	curPageTextboxEleId = '#wordCurPage';
        	curPageSpanEleId = '#wordsCurrentPageSpan';
        }
        else
        {
        	curPageTextboxEleId = '#wordlistCurPage';
        	curPageSpanEleId = '#wordlistsCurrentPageSpan';
        }

        $( curPageSpanEleId ).html( $( '#totalRowsInTable' ).text() );

        if ( $( '#totalRowsInTable' ).text() == '0' )
            $( curPageTextboxEleId ).val( 0 );
        
        if ( resetCurPage )
            $( curPageTextboxEleId ).val( 1 );
    }

    $.fn.firstPageBtnClicked = function( event, pageType ) {
        event.preventDefault();

        var totalPageEleId, curPageEleId, enableSearchEleId;

        if ( pageType == 'word' )
        {
        	totalPageEleId = '#wordTotalPage';
        	curPageEleId = '#wordCurPage';
        	enableSearchEleId = '#enableWordSearch';
        }
        else if ( pageType == 'wordlist' )
        {
        	totalPageEleId = '#wordlistTotalPage';
        	curPageEleId = '#wordlistCurPage';
        	enableSearchEleId = '#enableWordlistSearch';
        }

        if( $( totalPageEleId ).text() == '0' )
            $( curPageEleId ).val( 0 );
        else
            $( curPageEleId ).val( 1 );

        $( this ).switchPageRequest( pageType, $( enableSearchEleId ).prop( 'checked' ) );
    }

    $.fn.prevPageBtnClicked = function( event, pageType ) {
        event.preventDefault();

        var totalPageEleId, curPageEleId, enableSearchEleId;

        if ( pageType == 'word' )
        {
        	totalPageEleId = '#wordTotalPage';
        	curPageEleId = '#wordCurPage';
        	enableSearchEleId = '#enableWordSearch';
        }
        else if ( pageType == 'wordlist' )
        {
        	totalPageEleId = '#wordlistTotalPage';
        	curPageEleId = '#wordlistCurPage';
        	enableSearchEleId = '#enableWordlistSearch';
        }

        if( $( totalPageEleId ).text() == '0' )
            $( curPageEleId ).val( 0 );
        else if ( $( curPageEleId ).val() > 1 )
            $( curPageEleId ).val( $( curPageEleId ).val() - 1 );

        $( this ).switchPageRequest( pageType, $( enableSearchEleId ).prop( 'checked' ) );
    }

    $.fn.nextPageBtnClicked = function( event, pageType ) {
        event.preventDefault();

        var totalPageEleId, curPageEleId, enableSearchEleId;

        if ( pageType == 'word' )
        {
        	totalPageEleId = '#wordTotalPage';
        	curPageEleId = '#wordCurPage';
        	enableSearchEleId = '#enableWordSearch';
        }
        else if ( pageType == 'wordlist' )
        {
        	totalPageEleId = '#wordlistTotalPage';
        	curPageEleId = '#wordlistCurPage';
        	enableSearchEleId = '#enableWordlistSearch';
        }

        if( $( totalPageEleId ).text() == '0' )
            $( curPageEleId ).val( 0 );
        else if ( $( curPageEleId ).val() < parseInt( $( totalPageEleId ).text() ) )
            $( curPageEleId ).val( parseInt( $( curPageEleId ).val() ) + 1 );

        $( this ).switchPageRequest( pageType, $( enableSearchEleId ).prop( 'checked' ) );
    }

    $.fn.lastPageBtnClicked = function( event, pageType ) {
        event.preventDefault();

        var totalPageEleId, curPageEleId, enableSearchEleId;

        if ( pageType == 'word' )
        {
        	totalPageEleId = '#wordTotalPage';
        	curPageEleId = '#wordCurPage';
        	enableSearchEleId = '#enableWordSearch';
        }
        else if ( pageType == 'wordlist' )
        {
        	totalPageEleId = '#wordlistTotalPage';
        	curPageEleId = '#wordlistCurPage';
        	enableSearchEleId = '#enableWordlistSearch';
        }

        if( $( totalPageEleId ).text() == '0' )
            $( curPageEleId ).val( 0 );
        else
            $( curPageEleId ).val( parseInt( $( totalPageEleId ).text().trim() ) );

        $( this ).switchPageRequest( pageType, $( enableSearchEleId ).prop( 'checked' ) );
    }

    $.fn.curPageKeydowned = function( event, pageType ) {
    	var enableSearchEleId;

        if ( pageType == 'word' )
        	enableSearchEleId = '#enableWordSearch';
        else if ( pageType == 'wordlist' )
        	enableSearchEleId = '#enableWordlistSearch';

    	if ( event.which == 13 )
            $( this ).switchPageRequest( pageType, $( enableSearchEleId ).prop( 'checked' ) );
    }

	/* -------- Paging helper functions - END -------- */


	/* -------- Search helper functions - START -------- */

    $.fn.enableSearchOnClick = function( pageType ) {
    	var enableSearchEleId;

    	if ( pageType == 'word' )
    		enableSearchEleId = '#enableWordSearch';
    	else if ( pageType == 'wordlist' )
    		enableSearchEleId = '#enableWordlistSearch';

        if ( $( enableSearchEleId ).prop( 'checked' ) )
        {
        	if ( pageType == 'word' )
        	{
	            $( this ).createSearchTextBoxes( 'searchWordSpan', 'searchWordTextBox' );
	            $( this ).createSearchTextBoxes( 'searchPartOfSpeechSpan', 'searchPartOfSpeechTextBox' );
	            $( this ).createSearchTextBoxes( 'searchWordlistSpan', 'searchWordlistTextBox' );
	            $( this ).createSearchTextBoxes( 'searchNativeMeaningSpan', 'searchNativeMeaningTextBox' );
	        }
	        else
	        	$( this ).createSearchTextBoxes( 'searchWordlistNameSpan', 'searchWordlistTextBox' );
        }
        else
        {
        	if ( pageType == 'word' )
        	{
	            $( this ).removeSearchTextBoxes( 'searchWordTextBox', 'searchWordSpan' );
	            $( this ).removeSearchTextBoxes( 'searchPartOfSpeechTextBox', 'searchPartOfSpeechSpan' );
	            $( this ).removeSearchTextBoxes( 'searchWordlistTextBox', 'searchWordlistSpan' );
	            $( this ).removeSearchTextBoxes( 'searchNativeMeaningTextBox', 'searchNativeMeaningSpan' );

	            $( '#wordCurPage' ).val( 1 );

	            $( this ).updateTotalWordMeaningsValueInStatistic( false );
	        }
	        else
	        {
	        	$( this ).removeSearchTextBoxes( 'searchWordlistTextBox', 'searchWordlistNameSpan' );

	        	$( '#wordlistCurPage' ).val( 1 );
	        }

            $( this ).getTotalValueInStatistic( pageType, false );
            $( this ).switchPageRequest( pageType, false );
        }
    }

    $.fn.searchItemOnKeydown = function( event ) {
        if ( event.which == 13 )
        {
        	var pageType = window.location.pathname.split( '/' )[ 1 ];

        	$( this ).getTotalValueInStatistic( pageType, true );

        	if ( pageType == 'word' )
        	{
        		$( this ).loadWordViewOnSearch( true );
        		$( this ).updateTotalWordMeaningsValueInStatistic( true );
        	}
        	else if ( pageType == 'wordlist' )
        		$( this ).loadWordlistViewOnSearch( true );
        }
    }

	$.fn.createSearchTextBoxes = function( spanId, textboxId ) {
		var inputTag = document.createElement( 'INPUT' );
		var parentPadding = $( '#' + spanId ).parent().css( 'padding-right' ).replace( 'px', '' );
		var parentWidth = $( '#' + spanId ).parent().width();
		var parentHeight = $( '#' + spanId ).parent().height();

		$.each( $( '#' + spanId )[ 0 ].attributes, function( i, attrib ) {
																			 if ( attrib.name != 'id' )
																				 $( inputTag ).attr( attrib.name, attrib.value );
																		 } );

		inputTag.type = 'text';

		inputTag.id = textboxId;
		inputTag.style.width = '100%';
		inputTag.style.height = '100%';
		$( inputTag ).css( 'font-style', 'italic' );
		$( inputTag ).css( 'font-size', '12px' );
		$( inputTag ).css( 'box-sizing', 'border-box' );
		$( inputTag ).css( 'padding-top', '0px' );
		$( inputTag ).css( 'padding-bottom', '0px' );

		switch( spanId )
		{
			case 'searchWordSpan':
				$( inputTag ).attr( 'placeholder', 'Search word' );
				break;

			case 'searchWordlistNameSpan':
				$( inputTag ).attr( 'placeholder', 'Search wordlist name' );
				break;

			case 'searchPartOfSpeechSpan':
				$( inputTag ).attr( 'placeholder', 'Search word class' );
				break;

			case 'searchWordlistSpan':
				$( inputTag ).attr( 'placeholder', 'Search wordlist' );
				break;

			case 'searchNativeMeaningSpan':
				$( inputTag ).attr( 'placeholder', 'Search native meaning' );
				break;
		}

		$( '#' + spanId ).replaceWith( inputTag );

		var eventArr = new Array();

		( eventArr = [] ).push( 'keydown' );
		$( this ).checkAndBindEventForEle( '#' + inputTag.id,
										   eventArr,
										   $.fn.searchItemOnKeydown );

		eventArr = null;
	}

	$.fn.removeSearchTextBoxes = function( textboxId, spanId ) {
		var spanTag = document.createElement( 'SPAN' );
		var displayVal = '';

		$( spanTag ).attr( 'class', 'searchItem' );
		spanTag.id = spanId;

		switch( textboxId )
		{
			case 'searchWordTextBox':
				displayVal = 'Word Title';
				break;

			case 'searchPartOfSpeechTextBox':
				displayVal = 'Word class';
				break;

			case 'searchWordlistTextBox':
				displayVal = 'Wordlist';
				break;

			case 'searchNativeMeaningTextBox':
				displayVal = 'Native meaning';
				break;
		}

		spanTag.innerHTML = displayVal;

		$( '#' + textboxId ).replaceWith( spanTag );
	}

	/* -------- Search helper functions - END -------- */

} );

/* =========================== Helper functions - END =========================== */
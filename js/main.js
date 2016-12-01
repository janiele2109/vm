$( document ).ready( function() {

/* =========================== Event functions - START =========================== */

	$( window ).on( 'load', function( event ) {
		$( this ).bindEventsToControls();

		$( this ).toggleActiveMenuItem( MENU_ITEM_TEST );

		$( '#testBtn' ).focus();
	} );

/* =========================== Event functions - END =========================== */



/* =========================== Ajax functions - START =========================== */

	$.fn.fillHiddenWordlistCb = function( event ) {
		var sendingData = {
			username: $( '#userName' ).text(),
			requestType: 'getWordlistList'
		};

		$.ajax( {
			url: '/mods/word/wordControl.php',
			type: 'post',
			dataType: 'json',
			cache: false,
			error:
				function( xhr, status, error ) {
					$( this ).displayErrMsg( xhr.responseText );
				},
			success:
				function( response, status ) {
					$( this ).getWordlistListOnSuccess( response, status );
				},
			data: sendingData
		} );
	}

	$.fn.updateTotalWordPage = function() {
		var sendingData = {
			username: $( '#userName' ).text(),
			requestType: 'getTotalWordsNum'
		};

		$.ajax( {
			url: '/mods/word/wordControl.php',
			type: 'post',
			dataType: 'json',
			cache: false,
			error:
				function( xhr, status, error ) {
					$( this ).displayErrMsg( xhr.responseText );
				},
			success:
				function( response, status ) {
					$( this ).getTotalWordNumOnSuccess( response, status );
				},
			data: sendingData
		} );
	}

	$.fn.updateTotalWordMeanings = function( event ) {
		var sendingData = {
			username: $( '#userName' ).text(),
			requestType: 'getTotalWordMeaningsNum'
		};

		$.ajax( {
			url: '/mods/word/wordControl.php',
			type: 'post',
			dataType: 'json',
			cache: false,
			error:
				function( xhr, status, error ) {
					$( this ).displayErrMsg( xhr.responseText );
				},
			success:
				function( response, status ) {
					$( this ).getTotalWordMeaningsNumOnSuccess( response, status );
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
						$( this ).updateTotalWordPage();
						$( this ).updateTotalWordMeanings();
					}
				},
			data: sendingData
		} );
	}

/* =========================== Ajax functions - END =========================== */



/* =========================== Helper functions - START =========================== */

    $.fn.updateWordsOnCurrentPage = function() {
	    $( '#wordsCurrentPageSpan' ).html( $( '#totalRowsInTable' ).text() );
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

	$.fn.bindExampleEvents = function() {
		var eventArr = new Array();

		( eventArr = [] ).push( 'mouseenter', 'mouseleave' );
		$( this ).checkAndbindEventsForSelectors( '.exampleTd',
												  eventArr,
												  $.fn.exampleTdOnMouseEvents );

		( eventArr = [] ).push( 'mouseenter' );
		$( this ).checkAndbindEventsForSelectors( '.exampleEntry',
												  eventArr,
												  $.fn.exampleEntryOnMouseEnter );

		( eventArr = [] ).push( 'mouseleave' );
		$( this ).checkAndbindEventsForSelectors( 'div.exampleBtnlDiv',
												  eventArr,
												  $.fn.exampleBtnlDivMouseOut );

		( eventArr = [] ).push( 'click' );
		$( this ).checkAndBindEventForEle( '#addExampleBtn',
										   eventArr,
										   $.fn.addExampleBtnClick );

		$( this ).checkAndBindEventForEle( '#updateExampleBtn',
										   eventArr,
										   $.fn.updateExampleBtnClick );

		$( this ).checkAndBindEventForEle( '#deleteExampleBtn',
										   eventArr,
										   $.fn.deleteExampleBtnClick );

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

	$.fn.bindTestEvents = function() {
		var eventArr = new Array();

		( eventArr = [] ).push( 'click' );
		$( this ).checkAndBindEventForEle( '#testBtn',
										   eventArr,
										   $.fn.testBtnOnClick );

		$( this ).checkAndBindEventForEle( '#menuItemTest',
										   eventArr,
										   $.fn.menuItemTestOnClick );

		$( this ).checkAndBindEventForEle( '#checkWordBtn',
										   eventArr,
										   $.fn.checkWordBtnOnClick );

		$( this ).checkAndBindEventForEle( '#showWordBtn',
										   eventArr,
										   $.fn.showWordBtnOnClick );

		$( this ).checkAndBindEventForEle( '#nextWordBtn',
										   eventArr,
										   $.fn.nextWordBtnOnClick );

		$( this ).checkAndBindEventForEle( '#retestBtn',
										   eventArr,
										   $.fn.retestBtnOnClick );

		$( this ).checkAndBindEventForEle( '#displayPron',
										   eventArr,
										   $.fn.displayPronOnClick );

		$( this ).checkAndBindEventForEle( '#displayExample',
										   eventArr,
										   $.fn.displayExampleOnClick );

		$( this ).checkAndBindEventForEle( '#displayNativeMeaning',
										   eventArr,
										   $.fn.displayNativeMeaningOnClick );

		eventArr = null;
	}

	$.fn.bindWordlistEvents = function() {
		var eventArr = new Array();

		( eventArr = [] ).push( 'click' );
		$( this ).checkAndBindEventForEle( '#addNewWordlistBtn',
										   eventArr,
										   $.fn.addNewWordlistBtnOnClick );

		$( this ).checkAndBindEventForEle( '#delSelectedWordListsBtn',
										   eventArr,
										   $.fn.delSelectedWordListsBtnOnClick );

		$( this ).checkAndBindEventForEle( '#updateSelectedWordListsBtn',
										   eventArr,
										   $.fn.updateSelectedWordListsBtnOnClick );

		$( this ).checkAndBindEventForEle( '#menuItemWordlist',
										   eventArr,
										   $.fn.menuItemWordlistOnClick );

		$( this ).checkAndbindEventsForSelectors( '.updateWordlistNameBtn',
												  eventArr,
												  $.fn.updateWordlistNameBtnOnClick );

		eventArr = null;
	}

	$.fn.bindWordEvents = function() {
		var eventArr = new Array();

		( eventArr = [] ).push( 'click' );
		$( this ).checkAndBindEventForEle( '#addNewWordBtn',
										   eventArr,
										   $.fn.addNewWordBtnOnClick );

		$( this ).checkAndBindEventForEle( '#delSelectedWordsBtn',
										   eventArr,
										   $.fn.delSelectedWordsBtnOnClick );

		$( this ).checkAndBindEventForEle( '#updateSelectedWordsBtn',
										   eventArr,
										   $.fn.updateSelectedWordsBtnOnClick );

		$( this ).checkAndBindEventForEle( '#menuItemWord',
										   eventArr,
										   $.fn.menuItemWordOnClick );

		$( this ).checkAndbindEventsForSelectors( '.updateWordBtn',
												  eventArr,
												  $.fn.updateWordBtnOnClick );

		$( this ).checkAndBindEventForEle( '#firstPage',
										   eventArr,
										   $.fn.firstPageBtnOnClick );

		$( this ).checkAndBindEventForEle( '#prevPage',
										   eventArr,
										   $.fn.prevPageBtnOnClick );

		$( this ).checkAndBindEventForEle( '#nextPage',
										   eventArr,
										   $.fn.nextPageBtnOnClick );

		$( this ).checkAndBindEventForEle( '#lastPage',
										   eventArr,
										   $.fn.lastPageBtnOnClick );

		$( this ).checkAndBindEventForEle( '#enableSearch',
										   eventArr,
										   $.fn.enableSearchOnClick );

		( eventArr = [] ).push( 'keydown' );
		$( this ).checkAndBindEventForEle( '#curPage',
										   eventArr,
										   $.fn.curPageBtnOnKeydown );

		$( this ).bindExampleEvents();

		eventArr = null;
	}

	$.fn.bindEventsToControls = function() {
		/* Bind events to controls of new wordlist rows */
		$( this ).bindGeneralEvents();

		$( this ).bindTestEvents();

		$( this ).bindWordlistEvents();

		$( this ).bindWordEvents();
	}

	$.fn.createExampleControlsDiv = function() {
		var divTag = document.createElement( 'DIV' );

		/* Create add, update, delete buttons to add into div */
		var addButton = $( this ).toButtonControl( 'addExampleBtn', 'Add' );
		var updateButton = $( this ).toButtonControl( 'updateExampleBtn', 'Update' );
		var deleteButton = $( this ).toButtonControl( 'deleteExampleBtn', 'Delete' );

		/* Get position of element which div will be overlapped */
		var thisPos = $( this ).position();
		var topPosBtn, leftPosBtn;

		/* Add buttons into div */
		divTag.append( addButton );

		/* Word already has examples */
		if ( $( this ).prop( 'tagName' ) != 'TD' )
		{
			divTag.append( updateButton );
			divTag.append( deleteButton );
		}

		$( divTag ).addClass( 'exampleBtnlDiv' );

		$( divTag ).css( 'display', 'none' );

		/* Update location of div */
		$( divTag ).css( 'top', thisPos.top + 'px' );
		$( divTag ).css( 'left', thisPos.left + 'px' );

		/* Update size of div */
		if ( $( this ).prop( 'tagName' ) == 'TD' )
		{
			$( divTag ).css( 'width', $( this ).width() + $( this ).css( 'padding-right' ).replace( 'px', '' ) * 2 + 'px' );
			$( divTag ).css( 'height', $( this ).height() + $( this ).css( 'padding-bottom' ).replace( 'px', '' ) * 2 + 'px' );
		}
		else
		{
			$( divTag ).css( 'width', $( this ).parent().width() );
			$( divTag ).css( 'height', $( this ).height() );
		}

		/* Update location for buttons */
		if ( $( this ).prop( 'tagName' ) == 'TD' )
		{
			$( addButton ).css( 'width', $( this ).width() * 0.7 + 'px' );
			$( addButton ).css( 'height', $( this ).height() * 0.7 + 'px' );

			topPosBtn = $( divTag ).css( 'height' ).replace( 'px', '' ) / 2 - $( addButton ).css( 'height' ).replace( 'px', '' ) / 2;
			leftPosBtn = ( $( divTag ).css( 'width' ).replace( 'px', '' ) - ( $( addButton ).css( 'width' ).replace( 'px', '' ) ) ) / 2;

			$( addButton ).css( 'top', topPosBtn + 'px' );
			$( addButton ).css( 'left', leftPosBtn + 'px' );
		}
		else
		{
			topPosBtn = $( divTag ).css( 'height' ).replace( 'px', '' ) / 3 - $( updateButton ).css( 'height' ).replace( 'px', '' ) / 2;

			$( addButton ).css( 'top', topPosBtn + 'px' );
			$( updateButton ).css( 'top', topPosBtn + 'px' );
			$( deleteButton ).css( 'top', topPosBtn + 'px' );

			leftPosBtn = ( $( divTag ).css( 'width' ).replace( 'px', '' ) - ( $( addButton ).css( 'width' ).replace( 'px', '' ) * 3 + 15 * 2 ) ) / 2;

			$( addButton ).css( 'left', leftPosBtn + 'px' );

			leftPosBtn += 15;
			$( updateButton ).css( 'left', leftPosBtn + 'px' );

			leftPosBtn += 15;
			$( deleteButton ).css( 'left', leftPosBtn + 'px' );
		}

		if ( $( this ).prop( 'tagName') == 'TD' )
			$( this ).append( divTag );
		else
			$( this ).parent().append( divTag );
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

	$.fn.getWordlistListOnSuccess = function( response, status ) {
		$( '#hiddenWordlistCb' ).empty();

		Object.keys( response[ 'dataContent' ] ).forEach( function ( key ) {
															  var option = '<option value="' + key + '">' + response[ 'dataContent' ][ key ] + '</option>';
															  $( '#hiddenWordlistCb' ).append( option );
														  } );
	}

	$.fn.getTotalWordNumOnSuccess = function( response, status ) {
		$( '#totalWordsSpan' ).html( response[ 'dataContent' ] );

		$( this ).updateWordsOnCurrentPage();
	}

	$.fn.getTotalWordMeaningsNumOnSuccess = function( response, status ) {
		var numWordPerPage = 10;

		$( '#totalPage' ).html( Math.ceil( response[ 'dataContent' ] / numWordPerPage ) );

		if( $( '#totalPage' ).text() == '0' )
		{
			$( '#curPage' ).val( 0 );
			$( '#wordsCurrentPageSpan' ).html( '0' );
		}

		$( '#totalWordMeaningsSpan' ).html( response[ 'dataContent' ] );
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
} );

/* =========================== Helper functions - END =========================== */
$( document ).ready( function() {

    /* =========================== Event functions - START =========================== */

    $( window ).on( 'load', function( event ) {
        $( this ).bindEventsToControls();

        $( this ).toggleActiveMenuItem( MENU_ITEM_TEST );
    } );

    /* =========================== Event functions - END =========================== */



    /* =========================== Ajax functions - START =========================== */

    $.fn.fillHiddenWordlistCb = function( event ) {
        var sendingData = {
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
            requestType: 'getPageContent'
        };

        $.ajax( {
            url: requestUri,
            type: 'post',
            success:
                function( response, status ) {
                    $( this ).getPageContentOnSuccess( response, status, currentUri );

                    if ( requestMenuItem == MENU_ITEM_WORD )
                        $( this ).fillHiddenWordlistCb();
                },
            data: sendingData
        } );
    }

    /* =========================== Ajax functions - END =========================== */



    /* =========================== Helper functions - START =========================== */

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
        if ( $( '#msgDiv' ).length > 0 )
        {
            $( '#msgDiv' ).text( msg );
            $( '#msgDiv' ).css( 'visibility', 'visible' );
            $( '#msgDiv' ).removeClass( 'err' );
        }

        /* Reset checkbox 'Select all' */
        $( '#selectAllChkbox' ).prop( 'checked', false );
    }

    $.fn.checkAndBindEvent = function( controlId,
                                       requestEvents,
                                       bindFunction ) {
        if ( $( controlId ).length > 0 )
        {
            var bindedEvents = undefined;
            var keysArr = null;

            if ( controlId.indexOf( '#' ) != -1 )
            {
                var eleId = controlId.replace( '#', '' );
                bindedEvents = $._data( document.getElementById( eleId ), 'events');
            }

            else if ( controlId.indexOf( '.' ) != -1 )
                bindedEvents = $._data( $( controlId )[ 0 ], 'events' );

            for ( var i = 0; i < requestEvents.length; i++ )
            {
                var exist = false;

                if( bindedEvents !== undefined )
                {
                    keysArr = Object.keys( bindedEvents );

                    keysArr.forEach( function( curVal ) {
                                         if ( curVal == requestEvents[ i ] )
                                             exist = true;
                                     }
                                   );

                    if ( exist )
                        continue;
                }
                
                if ( bindedEvents === undefined || !exist )
                    $( controlId ).bind( requestEvents[ i ], bindFunction );
            }
        }
    }

    $.fn.bindGeneralEvents = function() {
        var eventArr = new Array();

        ( eventArr = [] ).push( 'change' );
        $( this ).checkAndBindEvent( '#selectAllChkbox',
                                     eventArr,
                                     $.fn.selectAllChkboxOnChange );

        ( eventArr = [] ).push( 'mouseenter', 'mouseleave' );
        $( this ).checkAndBindEvent( '.toggleEnabled',
                                     eventArr,
                                     $.fn.toggleControlOnHover );

        ( eventArr = [] ).push( 'blur', 'mouseleave' );
        $( this ).checkAndBindEvent( 'select[data-controltranstype]',
                                     eventArr,
                                     $.fn.toSpanControl );

        ( eventArr = [] ).push( 'blur' );
        $( this ).checkAndBindEvent( 'input[type=text]',
                                     eventArr,
                                     $.fn.toSpanControl );

        $( this ).checkAndBindEvent( 'textarea[data-controltranstype]',
                                     eventArr,
                                     $.fn.toSpanControl );

        ( eventArr = [] ).push( 'keypress' );
        $( this ).checkAndBindEvent( 'input[type=text][data-controltranstype]',
                                     eventArr,
                                     $.fn.editableControlOnKeyPress );

        $( this ).checkAndBindEvent( 'select[data-controltranstype]',
                                     eventArr,
                                     $.fn.editableControlOnKeyPress );

        $( this ).checkAndBindEvent( 'textarea[data-controltranstype]',
                                     eventArr,
                                     $.fn.editableControlOnKeyPress );

        eventArr = null;
    }

    $.fn.bindTestEvents = function() {
        var eventArr = new Array();

        ( eventArr = [] ).push( 'click' );
        $( this ).checkAndBindEvent( '#testBtn',
                                     eventArr,
                                     $.fn.testBtnOnClick );

        $( this ).checkAndBindEvent( '#menuItemTest',
                                     eventArr,
                                     $.fn.menuItemTestOnClick );

        eventArr = null;
    }

    $.fn.bindWordlistEvents = function() {
        var eventArr = new Array();

        ( eventArr = [] ).push( 'click' );
        $( this ).checkAndBindEvent( '#addNewWordlistBtn',
                                     eventArr,
                                     $.fn.addNewWordlistBtnOnClick );

        $( this ).checkAndBindEvent( '#delSelectedWordListsBtn',
                                     eventArr,
                                     $.fn.delSelectedWordListsBtnOnClick );

        $( this ).checkAndBindEvent( '#updateSelectedWordListsBtn',
                                     eventArr,
                                     $.fn.updateSelectedWordListsBtnOnClick );

        $( this ).checkAndBindEvent( '#menuItemWordlist',
                                     eventArr,
                                     $.fn.menuItemWordlistOnClick );

        $( this ).checkAndBindEvent( '.updateWordlistNameBtn',
                                     eventArr,
                                     $.fn.updateWordlistNameBtnOnClick );

        eventArr = null;
    }

    $.fn.bindWordEvents = function() {
        var eventArr = new Array();

        ( eventArr = [] ).push( 'click' );
        $( this ).checkAndBindEvent( '#addNewWordBtn',
                                     eventArr,
                                     $.fn.addNewWordBtnOnClick );

        $( this ).checkAndBindEvent( '#delSelectedWordsBtn',
                                     eventArr,
                                     $.fn.delSelectedWordsBtnOnClick );

        $( this ).checkAndBindEvent( '#updateSelectedWordsBtn',
                                     eventArr,
                                     $.fn.updateSelectedWordsBtnOnClick );

        $( this ).checkAndBindEvent( '#menuItemWord',
                                     eventArr,
                                     $.fn.menuItemWordOnClick );

        $( this ).checkAndBindEvent( '#addExampleBtn',
                                     eventArr,
                                     $.fn.addExampleBtnClick );

        $( this ).checkAndBindEvent( '#updateExampleBtn',
                                     eventArr,
                                     $.fn.updateExampleBtnClick );

        $( this ).checkAndBindEvent( '.updateWordBtn',
                                     eventArr,
                                     $.fn.updateWordBtnOnClick );

        ( eventArr = [] ).push( 'mouseenter' );
        $( this ).checkAndBindEvent( '.exampleEntry',
                                     eventArr,
                                     $.fn.exampleEntryOnMouseEnter );

        eventArr = null;
    }

    $.fn.bindEventsToControls = function() {
        /* Bind events to controls of new wordlist rows */
        $( this ).bindGeneralEvents();

        $( this ).bindTestEvents();

        $( this ).bindWordlistEvents();

        $( this ).bindWordEvents();
    }

    $.fn.unbindAllEventsOfToggleFieldsInViewTable = function() {
        $( 'td.toggleEnabled' ).unbind();
        $( '.exampleEntry' ).unbind();
    }

    $.fn.getTagDisplayVal = function() {
        var returnVal = '';

        switch( $( this ).prop( 'tagName' ) )
        {
            case 'SPAN':
            case 'DIV':
            case 'TEXTAREA':
            case 'BUTTON':
                returnVal = $( this ).text();
                break;

            case 'SELECT':
                $( this ).find( ':selected' ).text();
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

        $( this ).bindEventsToControls();

        return inputTag;
    }

    $.fn.toSelectControl = function( displayVal,
                                     controlTranstype,
                                     dataSource ) {
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
                function() { $( this ).prop( 'selected', true ) } );

        $( selectTag ).css( 'display', 'block' );
        
        $( selectTag ).find( 'option' ).css( 'color', 'black' );
        $( selectTag ).find( 'option:selected' ).css( 'color', $( this ).css( 'color' ) );

        $( this ).replaceWith( selectTag );

        $( selectTag  ).focus();

        $( this ).bindEventsToControls();

        return selectTag;
    }

    $.fn.toTextAreaControl = function( displayVal, controlTranstype ) {
        var textarea = document.createElement( 'TEXTAREA' );
        var parentPadding = $( this ).parent().css( 'padding-right' ).replace( 'px', '' );
        var parentWidth = $( this ).parent().width();

        $.each( this[ 0 ].attributes, function( i, attrib ) {
            if ( attrib.name != 'id' )
                $( textarea ).attr( attrib.name, attrib.value );
        } );

        $( textarea ).attr( 'data-controltranstype', controlTranstype );

        textarea.style.width = parentWidth - parentPadding - 1 + 'px';

        $( this ).replaceWith( textarea );

        $( textarea ).focus();
        $( textarea ).val( displayVal );

        $( this ).bindEventsToControls();

        return textarea;
    }

    $.fn.toEditableControls = function() {
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

    $.fn.getWordlistListOnSuccess = function( response, status ) {
        $( '#hiddenWordlistCb' ).empty();

        Object.keys( response[ 'dataContent' ] ).forEach( function ( key ) {
                                                              var option = '<option value="' + key + '">' + response[ 'dataContent' ][ key ] + '</option>';
                                                              $( '#hiddenWordlistCb' ).append( option );
                                                          } );
    }

    $.fn.getPageContentOnSuccess = function( response, status, currentUri ) {
        var pageType = '';

        if ( currentUri == MENU_ITEM_TEST )
            pageType = 'testForm';

        else if ( currentUri == MENU_ITEM_WORD )
            pageType = 'wordForm';

        else if ( currentUri == MENU_ITEM_WORDLIST )
            pageType = 'wordlistForm';

        if ( $( '#' + pageType ).length > 0 )
            $( '#' + pageType ).replaceWith( response );

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
            $( this ).toSpanControl();
    }

    /* =========================== Helper functions - END =========================== */



    $.fn.toSpanControl = function() {
        var dataSourceName = "";
        var spanTag = document.createElement('SPAN');
        var chkboxEle = $(this).parent().parent().find('input[type="checkbox"]');

        $.each($(this)[0].attributes, function(i, attrib){
            $(spanTag).attr(attrib.name, attrib.value);

            if (attrib.name == 'class')
            {
                if ( attrib.value.search('wordlist') != -1 )
                    dataSourceName = "data-sourcewordlistname";

                else if ( attrib.value.indexOf('word') != -1 )
                    dataSourceName = "data-sourceword";

                else if ( attrib.value.indexOf('partOfSpeech') != -1 )
                    dataSourceName = "data-sourcepos";

                else if ( attrib.value.indexOf('pronunciation') != -1 )
                    dataSourceName = "data-sourcepron";

                else if ( attrib.value.indexOf('meaning') != -1 )
                    dataSourceName = "data-sourcemeaning";

                else if ( attrib.value.indexOf('exampleEntry') != -1 )
                    dataSourceName = "data-sourceexample";
            }
        });

        switch( $(this).prop('tagName') )
        {
            case 'SELECT':
                $(spanTag).attr('data-controltranstype', 'select');
                spanTag.innerHTML = $(this).find(":selected").text().trim();
                break;

            case 'INPUT':
                $(spanTag).attr('data-controltranstype', 'input-text');
                spanTag.innerHTML = $(this).prop('value').trim();                
                break;

            case 'TEXTAREA':
                if ( $(this).attr('class').indexOf('example') == -1 )
                    $(spanTag).attr('data-controltranstype', 'textarea');
                else
                    $(spanTag).attr('data-controltranstype', 'button');

                spanTag.innerHTML = $(this).prop('value').trim();                
                break;

            default:
                break;
        }

        if ( $(spanTag).attr(dataSourceName).trim() != spanTag.innerHTML.trim() )
        {
            $(spanTag).addClass('modified');
            spanTag.style.color = 'red';
            chkboxEle.first().prop('checked', true);
        }    
        else
        {
            $(spanTag).removeClass('modified');
            spanTag.style.color = 'black';
        }    

        $(this).replaceWith(spanTag);

        return spanTag;
    }

    $.fn.toDivControl = function() {
        var divTag = document.createElement('DIV');
        var chkboxEle = $(this).parent().parent().find('input[type="checkbox"]');
        var dataSourceName = '';

        $.each(this[0].attributes, function(i, attrib){
            $(divTag).attr(attrib.name, attrib.value);

            if (attrib.name == 'class')
            {
                if ( attrib.value.indexOf('wordlist') != -1 )
                    dataSourceName = "data-sourcewordlistname";

                else if ( attrib.value.indexOf('word') != -1 )
                    dataSourceName = "data-sourceword";

                else if ( attrib.value.indexOf('partOfSpeech') != -1 )
                    dataSourceName = "data-sourcepos";

                else if ( attrib.value.indexOf('pronunciation') != -1 )
                    dataSourceName = "data-sourcepron";

                else if ( attrib.value.indexOf('meaning') != -1 )
                    dataSourceName = "data-sourcemeaning";

                else if ( attrib.value.indexOf('exampleEntry') != -1 )
                    dataSourceName = "data-sourceexample";
            }
        });

        $(divTag).text($(this).prop('value'));

        $(divTag).attr('data-controltranstype', 'button');

        if ( $(this).prop('value') == '' )
        {
            $(divTag).css('display', 'none');
            $(this).next('br').remove();
        }    

        divTag.style.width = $(this).parent().width() - 6 + "px";

        if ( $(divTag).attr(dataSourceName) != $(divTag).text() )
        {
            $(divTag).addClass('modified');
            divTag.style.color = 'red';
            chkboxEle.first().prop('checked', true);
        }    
        else
        {
            $(divTag).removeClass('modified');
            divTag.style.color = 'black';
        }   

        $(divTag).bind('mouseenter', function ( event ) { 
                                                            if ( $('textarea.exampleEntry').length == 0 )
                                                            {
                                                                $(this).createExampleControlsDiv();
                                                                $('.exampleBtnlDiv').fadeIn().find('#updateExampleBtn').focus();
                                                                $(this).addClass('transEffectHover');
                                                            }
                                                        } );

        $(this).replaceWith(divTag);

        return divTag;
    }

    $.fn.createExampleControlsDiv = function() {
        var divTag = document.createElement('DIV');
        var updateButton = $(this).toButtonControl('updateExampleBtn', 'Update');
        var addButton = $(this).toButtonControl('addExampleBtn', 'Add');
        var thisPos = $(this).position();
        var topPosBtn, leftPosBtn;

        if ($(this).prop("tagName") != 'TD')
            divTag.append(updateButton);
        
        divTag.append(addButton);

        $(divTag).addClass('exampleBtnlDiv');

        $(divTag).css('top', thisPos.top + 'px' );
        $(divTag).css('left', thisPos.left + 'px' );
        $(divTag).css('display', 'none' );

        if ($(this).prop("tagName") == 'TD')
        {
            $(divTag).css('width', $(this).width() + $(this).css('padding-right').replace('px', '') * 2 + 'px' );
            $(divTag).css('height', $(this).height() + $(this).css('padding-bottom').replace('px', '') * 2 + 'px' );
        }
        else
        {
            $(divTag).css('width', $(this).parent().width() );
            $(divTag).css('height', $(this).height() );
        }

        topPosBtn = $(divTag).css('height').replace('px', '') / 2 - $(updateButton).css('height').replace('px', '') / 2;
        leftPosBtn = $(divTag).css('width').replace('px', '') / 2 - $(updateButton).css('width').replace('px', '') - 10;

        $(updateButton).css('top', topPosBtn + 'px' );
        $(updateButton).css('left', leftPosBtn + 'px' );
        $(updateButton).css('margin-right', '5px' );

        $(addButton).css('top', topPosBtn + 'px' );

        if ($(this).prop("tagName") == 'TD')
            $(addButton).css('left', $(divTag).css('width').replace('px', '') / 2 - $(addButton).css('width').replace('px', '') / 2 + 10 );
        else
            $(addButton).css('left', $(updateButton).css('width').replace('px', '') + 'px' );

        $(divTag).bind('mouseleave', function (event){ $(this).exampleBtnlDivMouseOut(); });

        if ($(this).prop("tagName") == 'TD')
            $(this).append(divTag);
        else
            $(this).parent().append(divTag);
    }

    $.fn.toggleControlOnHover = function( event ) {

        switch( $( this ).prop('tagName') )
        {
            case 'TD':
                $.each( $( this ).find( '[data-controlTransType]' ), $.fn.toEditableControls );
                break;

            case 'INPUT':
            case 'SELECT':
            case 'TEXTAREA':
            case 'BUTTON':

                if ( event.type == 'keypress' && event.which != 13 )
                    break;

                if ( $(this).attr('class').indexOf('exampleBtn') != -1 )
                {
                    var divTag = $(this).toDivControl();
                    $(divTag).removeClass('exampleBtn');
                    $(divTag).next('br').remove();

                    if ($(this).attr('class').indexOf('exampleTd') != -1)
                    {
                        $(divTag).removeClass('exampleTd');
                        $(divTag).addClass('exampleEntry transEffect');
                    }
                }
                else
                    $( this ).toSpanControl();

                break;

            default:
                break;
        }
    }
});

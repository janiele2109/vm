
$( document ).ready( function() {

    $( window ).on( 'load', function( event ) {
        $( this ).bindEventsToControls();

        $( this ).toggleActiveMenuItem( MENU_ITEM_TEST );
    } );

    $.fn.getWordlistList = function( event ) {
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
                    $( this ).errRequestServerData( xhr, status, error );
                },
            success:
                function( response, status ) {
                        $( '#hiddenWordlistCb' ).empty();
                        Object.keys( response[ 'dataContent' ] ).forEach( function ( key ) {
                            var option = '<option value="' + key + '">' + response[ 'dataContent' ][ key ] + '</option>';
                            $( '#hiddenWordlistCb' ).append( option );
                        } );
                },
            data: sendingData
        });
    }

    $.fn.checkServerResponse = function( response, status ) {
        if ( status != "success" || response[ 'errState' ] != 'OK' )
        {
            if ( $("#msgDiv").length > 0 )
            {
                $("#msgDiv").text(response['msg']);
                $("#msgDiv").css('visibility', 'visible');
                $("#msgDiv").addClass("err");
            }

            return false;
        }
        else
            return true;
    }

    $.fn.errRequestServerData = function( xhr, status, error ) {
        if ( $( '#msgDiv' ).length > 0 )
        {
            $("#msgDiv").text( 'Request for data from server failed!' );
            $("#msgDiv").css('visibility', 'visible');
            $("#msgDiv").addClass("err");
        }
    }

    $.fn.resetControlInfo = function( msg ) {
        /* Update message information */
        if ( $( '#msgDiv' ).length > 0 )
        {
            $("#msgDiv").text( msg );
            $("#msgDiv").css('visibility', 'visible');
            $("#msgDiv").removeClass("err");
        }

        /* Reset checkbox 'Select all' */
        $( '#selectAllChkbox' ).prop( 'checked', false );
    }

    $.fn.switchMenuItem = function( event, menuItem ) {
        event.preventDefault();

        var currentUriVal = window.location.pathname.split( '/' )[ 1 ];
        var newUriVal = '';
        var userName = $( '#userName' ).text();

        if ( menuItem == MENU_ITEM_TEST )
            newUriVal = '/mods/test/testForm.php';
        else if ( menuItem == MENU_ITEM_WORD )
            newUriVal = '/mods/word/wordForm.php';
        else if ( menuItem == MENU_ITEM_WORDLIST )
            newUriVal = '/mods/wordlist/wordlistForm.php';

        history.pushState( '', document.title, '/' + menuItem );

        var sendingData = {
            menuItem: menuItem,
            userName: userName
        }

        $.ajax( {
            url: newUriVal,
            type: 'post',
            success:
                function( response, status ) {
                    var pageType = '';

                    if ( currentUriVal == MENU_ITEM_TEST )
                        pageType = 'testForm';
                    else if ( currentUriVal == MENU_ITEM_WORD )
                        pageType = 'wordForm';
                    else if ( currentUriVal == MENU_ITEM_WORDLIST )
                        pageType = 'wordlistForm';

                    if ( $( '#' + pageType ).length > 0 )
                        $( '#' + pageType ).replaceWith( response );

                    $( this ).bindEventsToControls();
                },
            data: sendingData
        } );
    }

    $.fn.bindEventsToControls = function() {
        /* Bind events to controls of new wordlist rows */

        /* General events - START */
        {
            if ( $( '#selectAllChkbox' ).length > 0 )
            {
                var ev = $._data( document.getElementById( 'selectAllChkbox' ), 'events');

                if ( typeof ev === 'undefined' || !ev.change )
                {
                    $( '#selectAllChkbox' ).bind( 'change',
                                                  function ( event ) {
                                                  if ( $( this ).prop( 'checked' ) ) {
                                                      $( 'tbody tr td input[type="checkbox"]' ).each( function() {
                                                                                                          $(this).prop('checked', true);
                                                                                                      } );
                                                  }
                                                  else
                                                  {
                                                      $( 'tbody tr td input[type="checkbox"]' ).each( function() {
                                                                                                          $(this).prop('checked', false);
                                                                                                      } );
                                                  }
                    } );
                }
            }

            if ( $( '.toggleEnabled' ).length > 0 )
            {
                var ev = $._data( $( '.toggleEnabled' )[ 0 ], 'events' );

                if ( typeof ev === 'undefined' || ( !ev.mouseenter && !ev.mouseleave ) )
                {
                    $( '.toggleEnabled' ).bind( 'mouseenter mouseleave',
                                                function( event ) { $( this ).toggleControl( event ); 
                    } );
                }
            }
        }

        /* General events - END */


        /* Test events - START */
        {
            if ( $( '#testBtn' ).length > 0 )
            {
                var ev = $._data( document.getElementById( 'testBtn' ), 'events');

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '#testBtn' ).bind( 'click',
                                          function( event) {
                                            $( this ).testBtnClicked( event );
                                          } );
                }
            }

            if ( $( '#menuItemTest' ).length > 0 )
            {
                var ev = $._data( document.getElementById( 'menuItemTest' ), 'events');

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '#menuItemTest' ).bind( 'click',
                                               function ( event ) {
                                                    $( this ).toggleActiveMenuItem( MENU_ITEM_TEST );
                                                    $( this ).switchMenuItem( event, MENU_ITEM_TEST );
                                               } );
                }
            }
        }
        /* Test events - END */


        /* Wordlist events - START */
        {
            if ( $( '#addNewWordlistBtn' ).length > 0 )
            {
                var ev = $._data( document.getElementById( 'addNewWordlistBtn' ), 'events');

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '#addNewWordlistBtn' ).bind( 'click',
                                                    function( event) {
                                                        $( this ).addNewWordlistBtnClicked( event );
                                                    } );
                }
            }

            if ( $( '#delSelectedWordListsBtn' ).length > 0 )
            {
                var ev = $._data( document.getElementById( 'delSelectedWordListsBtn' ), 'events');

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '#delSelectedWordListsBtn' ).bind( 'click',
                                                          function( event) {
                                                              $( this ).delSelectedWordListsBtnClicked( event );
                                                          } );
                }
            }

            if ( $( '.updateWordlistNameBtn' ).length > 0 )
            {
                var ev = $._data( $( '.updateWordlistNameBtn' )[ 0 ], 'events' );

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '.updateWordlistNameBtn' ).bind( 'click',
                                                        function( event) {
                                                            $( this ).updateWordlistNameBtnClicked( event );
                                                        } );
                }
            }

            if ( $( '#updateSelectedWordListsBtn' ).length > 0 )
            {
                var ev = $._data( document.getElementById( 'updateSelectedWordListsBtn' ), 'events');

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '#updateSelectedWordListsBtn' ).bind( 'click',
                                                              function( event) {
                                                                  $( this ).updateSelectedWordListsBtnClicked( event );
                                                              } );
                }
            }

            if ( $( '#menuItemWordlist' ).length > 0 )
            {
                var ev = $._data( document.getElementById( 'menuItemWordlist' ), 'events');

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '#menuItemWordlist' ).bind( 'click',
                                                    function ( event ) {
                                                        $( this ).toggleActiveMenuItem( MENU_ITEM_WORDLIST );
                                                        $( this ).switchMenuItem( event, MENU_ITEM_WORDLIST );
                                                    } );
                }
            }
        }
        /* Wordlist events - END */


        /* Word events - START */
        {
            if ( $( '.exampleEntry' ).length > 0 )
            {
                var ev = $._data( $( '.exampleEntry' )[ 0 ], 'events' );

                if ( typeof ev === 'undefined' || !ev.mouseenter )
                {
                    $( '.exampleEntry' ).bind( 'mouseenter',
                                                function() {
                                                                if ( $( 'textarea.exampleEntry' ).length == 0 )
                                                                {
                                                                    $( this ).createExampleControlsDiv();
                                                                    $( '.exampleBtnlDiv' ).fadeIn().find( '#updateExampleBtn' ).focus();
                                                                    $( this ).addClass( 'transEffectHover' );
                                                                }

                                                                if ( $('.exampleBtnlDiv').length == 0 && $('textarea.exampleEntry').length == 0 )
                                                                {
                                                                    $(this).createExampleControlsDiv();
                                                                    $('.exampleBtnlDiv').fadeIn().find('#updateExampleBtn').focus();
                                                                    $(this).addClass('transEffectHover');
                                                                }
                                                           } );
                }
            }

            if ( $( '.exampleTd' ).length > 0 )
            {
                var ev = $._data( $( '.exampleTd' )[ 0 ], 'events' );

                if ( typeof ev === 'undefined' || !ev.mouseenter )
                {
                    $( '.exampleTd' ).bind( 'mouseenter',
                                            function() {
                                                var div = $(this).find('div.exampleEntry');

                                                if ( $('.exampleBtnlDiv').length == 0 && $('textarea.exampleEntry').length == 0 && $('textarea.exampleTd').length == 0 && div.length == 0 )
                                                {
                                                    $(this).createExampleControlsDiv();
                                                    $('.exampleBtnlDiv').fadeIn().find('#updateExampleBtn').focus();
                                                }
                                            } );
                }
            }

            if ( $( '#addNewWordBtn' ).length > 0 )
            {
                var ev = $._data( document.getElementById( 'addNewWordBtn' ), 'events');

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '#addNewWordBtn' ).bind( 'click',
                                                function ( event ) {
                                                    $( this ).addNewWord( event );
                                                } );
                }
            }

            if ( $( '#delSelectedWordsBtn' ).length > 0 )
            {
                var ev = $._data( document.getElementById( 'delSelectedWordsBtn' ), 'events');

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '#delSelectedWordsBtn' ).bind( 'click',
                                                      function ( event ) {
                                                          $( this ).delSelectedWords( event );
                                                      } );
                }
            }

            if ( $( '.updateWordBtn' ).length > 0 )
            {
                var ev = $._data( $( '.updateWordBtn' )[ 0 ], 'events' );

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '.updateWordBtn' ).bind( 'click',
                                                function ( event ) {
                                                                       var rowObj = $( this ).parent().parent();

                                                                       $( this ).updateWord( event, rowObj );
                                                                   } );
                }
            }

            if ( $( '#updateSelectedWordsBtn' ).length > 0 )
            {
                var ev = $._data( document.getElementById( 'updateSelectedWordsBtn' ), 'events');

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '#updateSelectedWordsBtn' ).bind( 'click',
                                                         function ( event ) {
                                                            $( this ).updateSelectedWords( event );
                                                         } );
                }
            }

            if ( $( '#menuItemWord' ).length > 0 )
            {
                $( this ).getWordlistList();

                var ev = $._data( document.getElementById( 'menuItemWord' ), 'events');

                if ( typeof ev === 'undefined' || !ev.click )
                {
                    $( '#menuItemWord' ).bind( 'click',
                                               function ( event ) {
                                                  $( this ).toggleActiveMenuItem( MENU_ITEM_WORD );
                                                  $( this ).switchMenuItem( event, MENU_ITEM_WORD );
                                               } );
                }
            }
        }
        /* Word events - END */
    }

    $.fn.err = function( errMsg ) {
        /* Update and show error message */
        if ( $( '#msgDiv' ).length > 0 )
        {
            $("#msgDiv").text( errMsg );
            $("#msgDiv").css('visibility', 'visible');
            $("#msgDiv").addClass("err");
        }
    }

    $.fn.toInputTextControl = function() {
        var inputTag = document.createElement('INPUT');

        $.each(this[0].attributes, function(i, attrib){
            $(inputTag).attr(attrib.name, attrib.value);
        });

        inputTag.type = 'text';
        inputTag.value = $(this).text();

        $(inputTag).attr('data-controltranstype', 'span');

        inputTag.style.width = $(this).parent().width() - 6 + "px";
        inputTag.style.color = $(this).css("color");

        $(inputTag).bind('blur', function ( event ) { $(this).toggleControl( event ); } );

        $(inputTag).bind('keypress', function ( event ) { $(this).toggleControl( event ); } );

        $(this).replaceWith(inputTag);

        return inputTag;
    }

    $.fn.toTextAreaControl = function(text) {
        var textarea = document.createElement('TEXTAREA');

        $.each(this[0].attributes, function(i, attrib){
            $(textarea).attr(attrib.name, attrib.value);
        });

        textarea.value = text;

        $(textarea).attr('data-controltranstype', 'span');

        textarea.style.width = $(this).parent().width() - 6 + "px";
        textarea.style.color = $(this).css("color");

        $(textarea).bind('blur', function ( event ) { $(this).toggleControl( event ); } );

        $(textarea).bind('keypress', function ( event ) { $(this).toggleControl( event ); } );

        return textarea;
    }

    $.fn.toSelectControl = function() {
        var selectTag = document.createElement('SELECT');
        var selectedText = $(this).text();

        $.each(this[0].attributes, function(i, attrib){
            if ( attrib.name != 'id' )
                $(selectTag).attr(attrib.name, attrib.value);
        });

        switch( $(selectTag).attr('class').replace('modified', '').trim() )
        {
            case 'wordlist':
                $('#hiddenWordlistCb option').clone().appendTo(selectTag);
                break;

            case 'partOfSpeech':
                $('#wordClassCb option').clone().appendTo(selectTag);
                break;

            default:
                break;
        }

        $(selectTag).children().filter(function() { return $(this).text() == selectedText; } ).prop('selected', true);

        $(selectTag).attr('data-controltranstype', 'span');

        $(selectTag).css('display', 'block');

        selectTag.style.width = $(this).parent().width() + "px";

        $(selectTag).find('option').css('color', 'black');
        $(selectTag).find('option:selected').css('color', $(this).css("color"));

        $(selectTag).bind('blur', function ( event ) { $(this).toggleControl( event ); } );

        $(selectTag).bind('keypress', function ( event ) { $(this).toggleControl( event ); } );

        $(this).replaceWith(selectTag);

        return selectTag;
    }

    $.fn.toSpanControl = function() {
        var dataSourceName = "";
        var spanTag = document.createElement('SPAN');
        var chkboxEle = $(this).parent().parent().find('input[type="checkbox"]');

        $.each(this[0].attributes, function(i, attrib){
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

        switch( this.prop('tagName') )
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

    $.fn.toButtonControl = function(buttonId, buttonLabel) {
        var buttonTag = document.createElement('BUTTON');

        $.each(this[0].attributes, function(i, attrib){
            $(buttonTag).attr(attrib.name, attrib.value);
        });

        $(buttonTag).prop('id', buttonId);
        $(buttonTag).html(buttonLabel);

        $(buttonTag).removeAttr('style');
        $(buttonTag).removeClass('transEffect');
        $(buttonTag).attr('data-controltranstype', 'textarea');

        $(buttonTag).addClass('exampleBtn');

        $(buttonTag).bind('click', function ( event ) { 
                                                        if ( buttonId == 'updateExampleBtn' )
                                                            $(this).updateExampleBtnClick(event);

                                                        else if ( buttonId == 'addExampleBtn' )
                                                            $(this).addExampleBtnClick(event);
                                                      });

        return buttonTag;
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

    $.fn.toggleControl = function( event ) {

        switch( this.prop('tagName') )
        {
            case 'TD':

                var childTag = this.children( '[data-controlTransType]' );

                if ( childTag.length > 0 )
                {
                    switch( childTag.first().attr( 'data-controlTransType' ) )
                    {
                        case 'input-text':
                            var textbox = childTag.toInputTextControl();
                            $(textbox).focus();

                            var tmpStr = $(textbox).val();
                            $(textbox).val( "" );
                            $(textbox).val( tmpStr );

                            break;

                        case 'select':
                            var select = childTag.toSelectControl();
                            $(select).focus();

                            break;

                        case 'textarea':
                            var textarea = childTag.toTextAreaControl($(this).text());
                            $(childTag).replaceWith(textarea);
                            $(textarea).focus();

                            break;

                        default:
                            break;
                    }
                }

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
                    this.toSpanControl();

                break;

            default:
                break;
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
});


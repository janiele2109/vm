$( document ).ready( function() {

/* =========================== Callback functions - START =========================== */

    $.fn.addNewWordBtnOnClick = function( event ) {
        event.preventDefault();

        var wordTitle = $( '#addNewWordTextBox' ).val().trim();
        var partOfSpeech = $( '#wordClassCb' ).find( ':selected' ).val().trim();
        var pronunciation = $( '#pronunciationTextBox' ).val().trim();
        var wordlistId = $( '#wordlistCb' ).find( ':selected' ).val().trim();
        var meaning = $( '#meaningTextArea' ).val().trim();
        var nativeMeaning = $( '#nativemeaningTextArea' ).val().trim();
        var example = $( '#exampleTextArea' ).val().trim();

        var result = $( this ).validateInputData( wordTitle,
                                                  pronunciation,
                                                  meaning );

        if ( result == EMPTY_STRING )
        {
            var sendingData = {
                word: wordTitle,
                partsOfSpeech: partOfSpeech,
                pronunciation: pronunciation,
                wordlistId: wordlistId,
                wordMeaning: meaning,
                nativeMeaning: nativeMeaning,
                wordExample: example,
                username: $( '#userName' ).text(),
                requestType: 'addWord'
            }

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
                        /* In case response from server is successful */
                        if ( $( this ).isServerResponseOk( response, status ) )
                        {
                            $( '#wordCurPage' ).val( 1 );

                            $( this ).getTotalValueInStatistic( 'word', false );

                            $( this ).updateTotalWordMeaningsValueInStatistic( false );

                            $( this ).resetControlInfo( response[ 'msg' ] );

                            $( this ).reloadWordViewTbl( response[ 'dataContent' ] );

                            $( this ).addNewWordTextBoxFocus();

                            $( this ).bindEventsToControls();
                        }
                    },
                data: sendingData
            } );
        }
        else
            $( this ).displayErrMsg( result );
    }

    $.fn.delSelectedWordsBtnOnClick = function( event ) {
        event.preventDefault();

        var selectedWord = new Array();

        $.each( $( 'input[name="word[]"]:checked' ), function() {
            var rowObj = $( this ).parent().parent();
            var word, partOfSpeech, pron, wordlistName, meaning;
            var wordMap = {};

            rowObj.find( '.word[data-controltranstype]' ).each( function() {
                word = $( this ).attr( 'data-sourceword' );
            } );

            rowObj.find( '.partOfSpeech[data-controltranstype]' ).each( function() {
                partOfSpeech = $( this ).attr( 'data-sourcepos' );
            } );

            rowObj.find( '.pronunciation[data-controltranstype]' ).each( function() {
                pron = $( this ).attr( 'data-sourcepron' );
            } );

            rowObj.find( '.wordlist[data-controltranstype]' ).each( function() {
                wordlistName = $( this ).attr( 'data-sourcewordlistname' );
            } );

            rowObj.find( '.meaning[data-controltranstype]' ).each( function() {
                meaning = $( this ).attr( 'data-sourcemeaning' );
            });

            wordMap[ 'word' ] = word;
            wordMap[ 'partOfSpeech' ] = partOfSpeech;
            wordMap[ 'pron' ] = pron;
            wordMap[ 'wordlistName' ] = wordlistName;
            wordMap[ 'meaning' ] = meaning;

            selectedWord.push( wordMap );
        } );

        if ( selectedWord.length > 0 ) {
            var sendingData = {
                'selectedWordArr': JSON.stringify( selectedWord ),
                username: $( '#userName' ).text(),
                requestType: 'delSelectedWords'
            }

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
                        /* In case response from server is successful */
                        if ( $( this ).isServerResponseOk( response, status ) )
                        {
                            $( this ).resetControlInfo( response[ 'msg' ] );

                            $( this ).reloadWordViewTbl( response[ 'dataContent' ], true );

                            $( this ).addNewWordlistTextBoxFocus();
                        }
                    },
                data: sendingData
            } );
        }
    }

    $.fn.updateWordBtnOnClick = function( event ) {
        var rowObj = $( this ).parent().parent();

        $( this ).updateWord( event, rowObj );
    }

    $.fn.updateSelectedWordsBtnOnClick = function( event ) {
        event.preventDefault();

        var modifiedWordRowList = new Array();

        $.each( $( 'input[name="word[]"]:checked' ), function() {
            var rowObj = $( this ).parent().parent();

            var modifiedRow = [];
            var exampleList = [];
            var data = {};

            $.each( rowObj.find( 'span[data-controltranstype]' ), function() {
                var classString = $( this ).attr( 'class' );
                var ctrlType = EMPTY_STRING;
                var result = EMPTY_STRING;
                var valObj = {};

                if ( classString.search( /\bword\b/ ) != -1 )
                {
                    ctrlType = 'word';
                    valObj[ 'orgVal' ] = $( this ).attr( 'data-sourceword' );

                    if ( ( result = $( this ).validateWordTitle( $( this ).text() ) ) != EMPTY_STRING )
                    {
                        $( this ).displayErrMsg( result );
                        return;
                    }
                }

                else if ( classString.search( /\bpartOfSpeech\b/ ) != -1 )
                {
                    ctrlType = 'partOfSpeech';
                    valObj[ 'orgVal' ] = $( this ).attr( 'data-sourcepos' );
                }

                else if ( classString.search( /\bpronunciation\b/ ) != -1 )
                {
                    ctrlType = 'pronunciation';
                    valObj[ 'orgVal' ] = $( this ).attr( 'data-sourcepron' );

                    if ( ( result = $( this ).validatePronunciation( $( this ).text() ) ) != EMPTY_STRING )
                    {
                        $( this ).displayErrMsg( result );
                        return;
                    }
                }

                else if ( classString.search( /\bwordlist\b/ ) != -1 )
                {
                    ctrlType = 'wordlist';
                    valObj[ 'orgVal' ] = $( this ).attr( 'data-sourcewordlistname' );
                }

                else if ( classString.search( /\bmeaning\b/ ) != -1 )
                {
                    ctrlType = 'meaning';
                    valObj[ 'orgVal' ] = $( this ).attr( 'data-sourcemeaning' );

                    if ( ( result = $( this ).validateWordMeaning( $( this ).text() ) ) != EMPTY_STRING )
                    {
                        $( this ).displayErrMsg( result );
                        return;
                    }
                }

                else if ( classString.search( /\bnativemeaning\b/ ) != -1 )
                {
                    ctrlType = 'nativemeaning';
                    valObj[ 'orgVal' ] = $( this ).attr( 'data-sourcenativemeaning' );
                }

                valObj[ 'newVal' ] = $( this ).text();
                data[ ctrlType ] = valObj;
            } );

            $.each( rowObj.find( 'div.exampleEntry' ), function() {
                var ex = {};

                ex[ 'orgVal' ] = $( this ).attr( 'data-sourceexample' );
                ex[ 'newVal' ] = $( this ).text();

                exampleList.push( ex );
            } );

            data[ 'exampleList' ] = exampleList;

            modifiedRow.push( data );

            modifiedWordRowList.push( modifiedRow );
        } );

        if ( modifiedWordRowList.length > 0 ) {
            var sendingData = {
                'modifiedWordRowList': JSON.stringify( modifiedWordRowList ),
                username: $( '#userName' ).text(),
                requestType: 'updateSelectedWords'
            }

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
                    function( response, status) {
                        /* In case response from server is successful */
                        if ( $( this ).isServerResponseOk( response, status ) )
                        {
                            $( this ).resetControlInfo( response[ 'msg' ] );

                            $( this ).reloadWordViewTbl( response[ 'dataContent' ] );

                            $( this ).addNewWordTextBoxFocus();

                            $( this ).bindEventsToControls();
                        }
                    },
                data: sendingData
            } );
        }
    }

    $.fn.addExampleBtnClick = function( event ) {
        var textarea = null;
        var tdTag = null;

        if ( $( this ).is( '[data-exId]' ) )
            tdTag = $( 'div[data-exId=' + $( this ).attr( 'data-exId' ) + ']' ).parent();
        else
            tdTag = $( this ).parent().parent();

        textarea = $( this ).toTextAreaControl( '', 'div' );

        $( textarea ).removeAttr( 'id' );
        $( textarea ).removeAttr( 'style' );

        $( textarea ).removeClass( 'exampleBtn' );

        textarea.style.width = $( this ).parent().width() - 6 + 'px';
        textarea.style.color = 'red';
        $( textarea ).css( 'left', '5px' );
        $( textarea ).css( 'width', $( tdTag ).width() - 10 + 'px' );

        $( textarea ).attr( 'data-controltranstype', 'div' );
        $( textarea ).attr( 'data-exId', 'ex_' + $( 'div[data-exId]' ).length + 1 );
        $( textarea ).attr( 'data-sourceexample', '' );

        $( tdTag ).append( textarea );

        $( '<br/>' ).insertBefore( textarea );

        $( '<br/>' ).insertAfter( textarea );

        $( '<br/>' ).insertAfter( textarea );

        $( textarea ).focus();

        $( '.exampleBtnlDiv' ).remove();

        if ( $( 'div.exampleEntry' ).length > 0 )
            $( 'div.exampleEntry' ).removeClass( 'transEffectHover' );
    };

    $.fn.updateExampleBtnClick = function( event ) {
        var displayVal = $( 'div[data-exId=' + $( this ).attr( 'data-exId' ) + ']' ).text();
        var textarea = $( this ).toTextAreaControl( displayVal, 'div' );
        var tdTag = $( 'div[data-exId=' + $( this ).attr( 'data-exId' ) + ']' ).parent();

        $( textarea ).removeAttr( 'id' );
        $( textarea ).removeAttr( 'style' );

        $( textarea ).removeClass( 'exampleBtn' );

        textarea.style.width = $( this ).parent().width() - 6 + 'px';
        textarea.style.color = $( this ).css( 'color' );
        $( textarea ).css( 'left', '5px' );
        $( textarea ).css( 'width', $( tdTag ).width() - 10 + 'px' );

        $( textarea ).attr( 'data-controltranstype', 'div' );

        $( textarea ).addClass( 'transEffect' );

        $( 'div[data-exId=' + $( textarea ).attr( 'data-exId' ) + ']' ).replaceWith( textarea );

        $( '<br/>' ).insertAfter( textarea );

        $( textarea ).focus();

        $( '.exampleBtnlDiv' ).remove();

        if ( $( 'div.exampleEntry' ).length > 0 )
            $( 'div.exampleEntry' ).removeClass( 'transEffectHover' );
    };

    $.fn.deleteExampleBtnClick = function( event ) {
        var curDiv = $( 'div[data-exId=' + $( this ).attr( 'data-exId' ) + ']' );
        var tdTag = curDiv.parent().parent();
        var checkboxObj = tdTag.find( 'input[type="checkbox"]' );

        $( '.exampleBtnlDiv' ).remove();

        curDiv.removeRedundantBrTag();

        var nextEle = curDiv.next();
        var prevEle = curDiv.prev();

        if ( nextEle.length > 0 &&
             prevEle.length > 0 )
            $( '<br/>' ).insertBefore( curDiv );

        /* Remove div itself */
        if ( curDiv.attr( 'data-sourceexample' ) == '' )
            curDiv.remove();
        else
        {
            curDiv.text( '' );
            checkboxObj.first().prop( 'checked', true );
            curDiv.css( 'display', 'none' );
        }
    };

    $.fn.exampleEntryOnMouseEnter = function( event ) {
        if ( event.type == 'mouseenter' &&
             $( '#wordViewTbl' ).find( 'textarea' ).length == 0 &&
             $( '.exampleBtnlDiv' ).length == 0 )
        {
            $( this ).createExampleControlsDiv();
            $( '.exampleBtnlDiv' ).fadeIn().find( '#updateExampleBtn' ).focus();
            $( this ).addClass( 'transEffectHover' );

            $( this ).bindExampleEvents();
        }
    }

    $.fn.exampleTdOnMouseEvents = function( event ) {
        if ( event.type == 'mouseenter' &&
             $( this ).find( 'textarea' ).length == 0 &&
             $( '.exampleBtnlDiv' ).length == 0 )
        {
            var exampleEntry = $( this ).find( 'div.exampleEntry' );

            if ( exampleEntry.length > 0 )
            {
                $( this ).unbind( 'mouseenter' );
                return;
            }

            $( this ).createExampleControlsDiv();
            $( '.exampleBtnlDiv' ).fadeIn().find( '#updateExampleBtn' ).focus();

            $( this ).bindExampleEvents();
        }
        else if ( event.type == 'mouseleave' )
        {
            $( '.exampleBtnlDiv' ).remove();
            $( 'div.exampleEntry' ).removeClass( 'transEffectHover' );
        }
    }

    $.fn.exampleBtnlDivMouseOut = function( event ) {
        $( '.exampleBtnlDiv' ).remove();

        if ( $( 'div.exampleEntry' ).length != 0)
            $( 'div.exampleEntry' ).removeClass( 'transEffectHover' );
    };

    $.fn.wordFirstPageBtnOnClick = function( event ) {
        $( this ).firstPageBtnClicked( event, 'word' );
    }

    $.fn.wordPrevPageBtnOnClick = function( event ) {
        $( this ).prevPageBtnClicked( event, 'word' );
    }

    $.fn.wordNextPageBtnOnClick = function( event ) {
        $( this ).nextPageBtnClicked( event, 'word' );
    }

    $.fn.wordLastPageBtnOnClick = function( event ) {
        $( this ).lastPageBtnClicked( event, 'word' );
    }

    $.fn.wordCurPageBtnOnKeydown = function( event ) {
        $( this ).curPageKeydowned( event, 'word' );
    }

    $.fn.enableWordSearchOnClick = function( event ) {
        $( this ).enableSearchOnClick( 'word' );
    }

    $.fn.menuItemWordOnClick = function( event ) {
        $( this ).toggleActiveMenuItem( MENU_ITEM_WORD );
        $( this ).switchMenuItem( event, MENU_ITEM_WORD );
    }

/* =========================== Callback functions - END =========================== */


/* =========================== Helper functions - START =========================== */

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

        $( this ).checkAndBindEventForEle( '#wordFirstPage',
                                           eventArr,
                                           $.fn.wordFirstPageBtnOnClick );

        $( this ).checkAndBindEventForEle( '#wordPrevPage',
                                           eventArr,
                                           $.fn.wordPrevPageBtnOnClick );

        $( this ).checkAndBindEventForEle( '#wordNextPage',
                                           eventArr,
                                           $.fn.wordNextPageBtnOnClick );

        $( this ).checkAndBindEventForEle( '#wordLastPage',
                                           eventArr,
                                           $.fn.wordLastPageBtnOnClick );

        $( this ).checkAndBindEventForEle( '#enableWordSearch',
                                           eventArr,
                                           $.fn.enableWordSearchOnClick );

        ( eventArr = [] ).push( 'keydown' );
        $( this ).checkAndBindEventForEle( '#wordCurPage',
                                           eventArr,
                                           $.fn.wordCurPageBtnOnKeydown );

        $( this ).bindExampleEvents();

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

    $.fn.updateWord = function( event, rowObj ) {
        event.preventDefault();

        var modifiedRow = [];
        var exampleList = [];
        var data = {};

        $.each( rowObj.find( 'span[data-controltranstype]' ), function() {
            var classString = $( this ).attr( 'class' );
            var ctrlType = EMPTY_STRING;
            var result = EMPTY_STRING;
            var valObj = {};

            if ( classString.search( /\bword\b/ ) != -1 )
            {
                ctrlType = 'word';
                valObj[ 'orgVal' ] = $( this ).attr( 'data-sourceword' );

                if ( ( result = $( this ).validateWordTitle( $( this ).text() ) ) != EMPTY_STRING )
                {
                    $( this ).displayErrMsg( result );
                    return;
                }
            }

            else if ( classString.search( /\bpartOfSpeech\b/ ) != -1 )
            {
                ctrlType = 'partOfSpeech';
                valObj[ 'orgVal' ] = $( this ).attr( 'data-sourcepos' );
            }

            else if ( classString.search( /\bpronunciation\b/ ) != -1 )
            {
                ctrlType = 'pronunciation';
                valObj[ 'orgVal' ] = $( this ).attr( 'data-sourcepron' );

                if ( ( result = $( this ).validatePronunciation( $( this ).text() ) ) != EMPTY_STRING )
                {
                    $( this ).displayErrMsg( result );
                    return;
                }
            }

            else if ( classString.search( /\bwordlist\b/ ) != -1 )
            {
                ctrlType = 'wordlist';
                valObj[ 'orgVal' ] = $( this ).attr( 'data-sourcewordlistname' );
            }

            else if ( classString.search( /\bmeaning\b/ ) != -1 )
            {
                ctrlType = 'meaning';
                valObj[ 'orgVal' ] = $( this ).attr( 'data-sourcemeaning' );

                if ( ( result = $( this ).validateWordMeaning( $( this ).text() ) ) != EMPTY_STRING )
                {
                    $( this ).displayErrMsg( result );
                    return;
                }
            }

            else if ( classString.search( /\bnativemeaning\b/ ) != -1 )
            {
                ctrlType = 'nativemeaning';
                valObj[ 'orgVal' ] = $( this ).attr( 'data-sourcenativemeaning' );
            }

            valObj[ 'newVal' ] = $( this ).text();
            data[ ctrlType ] = valObj;
        } );

        $.each( rowObj.find( 'div.exampleEntry' ), function() {
            var ex = {};

            ex[ 'orgVal' ] = $( this ).attr( 'data-sourceexample' );
            ex[ 'newVal' ] = $( this ).text();

            exampleList.push( ex );
        } );

        data[ 'exampleList' ] = exampleList;

        modifiedRow.push( data );

        if( modifiedRow.length > 0 )
        {
            var sendingData = {
                'modifiedRow': JSON.stringify( modifiedRow ),
                username: $( '#userName' ).text(),
                requestType: 'updateWord'
            }

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
                    function(response,status) {
                        /* In case response from server is successful */
                        if ( $( this ).isServerResponseOk( response, status ) )
                        {
                            $( this ).resetControlInfo( response[ 'msg' ] );

                            $( this ).updateModifiedWordRow( rowObj );

                            $( this ).resetCheckboxOfRow( rowObj );

                            $( this ).addNewWordTextBoxFocus();
                        }
                    },
                data: sendingData
            } );
        }
    }

    $.fn.validateWordTitle = function( wordTitle ) {
        if ( wordTitle == EMPTY_STRING )
            return ERR_1001;
        else
            return EMPTY_STRING;
    }

    $.fn.validatePronunciation = function( pronunciation ) {
        if ( pronunciation == EMPTY_STRING )
            return ERR_1002;
        else
            return EMPTY_STRING;
    }

    $.fn.validateWordMeaning = function( wordMeaning ) {
        if ( wordMeaning == EMPTY_STRING )
            return ERR_1003;
        else
            return EMPTY_STRING;
    }

    $.fn.validateWordExample = function( wordExample ) {
        if ( wordExample == EMPTY_STRING )
            return ERR_1004;
        else
            return EMPTY_STRING;
    }

    $.fn.validateInputData = function( wordTitle,
                                       pronunciation,
                                       wordMeaning,
                                       nativeMeaning )
    {
        var result = $( this ).validateWordTitle( wordTitle );

        if ( result != EMPTY_STRING )
            return result;

        result = $( this ).validatePronunciation( pronunciation );

        if ( result != EMPTY_STRING )
            return result;

        result = $( this ).validateWordMeaning( wordMeaning );

        if ( result != EMPTY_STRING )
            return result;

        return EMPTY_STRING;
    }

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

    $.fn.addNewWordTextBoxFocus = function() {
        /* Set focus to the add new word text box with whole text is selected */
        $( '#addNewWordTextBox' ).focus();
        document.getElementById( 'addNewWordTextBox' ).setSelectionRange( 0, $( '#addNewWordTextBox' ).val().length );
    }

    $.fn.updateModifiedWordRow = function( rowObj ) {
        var modifiedControls = rowObj.find( '.modified' );

        $.each( modifiedControls, function() {
            var classString = $( this ).attr( 'class' );

            if ( classString.search( /\bword\b/ ) != -1 )
                $( this ).attr( 'data-sourceword', $( this ).text() );

            else if ( classString.search( /\bpartOfSpeech\b/ ) != -1 )
                $( this ).attr( 'data-sourcepos', $( this ).text() );

            else if ( classString.search( /\bpronunciation\b/ ) != -1 )
                $( this ).attr( 'data-sourcepron', $( this ).text() );

            else if ( classString.search( /\bwordlist\b/ ) != -1 )
                $( this ).attr( 'data-sourcewordlistname', $( this ).text() );

            else if ( classString.search( /\bmeaning\b/ ) != -1 )
                $( this ).attr( 'data-sourcemeaning', $( this ).text() );

            else if ( classString.search( /\bnativemeaning\b/ ) != -1 )
                $( this ).attr( 'data-sourcenativemeaning', $( this ).text() );

            $( this ).css( 'color', 'black' );
            $( this ).removeClass( 'modified' );
        } );

        $.each( rowObj.find( 'div.exampleEntry.modified' ), function() {
            $( this ).attr( 'data-sourceexample', $( this ).text() );
        } );
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

    $.fn.reloadWordViewTbl = function( dataContent, isRemoveSelectedItems = false ) {
        /* Remove old rows in wordlist table and update new content */
        if ( isRemoveSelectedItems )
        {
            $( '.dynRowWord' ).filter( function() {
                return ( $( this ).children().children( 'input[type=checkbox]:checked' ).length != 0 );
            } ).remove();
        }
        else
        {
            $( '.dynRowWord' ).remove();
            $( '#wordViewTbl' ).children().append( dataContent );
        }
    }

    $.fn.updateTotalWordMeaningsValueInStatistic = function( inSearch ) {
        var sendingData = {};
        var requestTypeData = 'getTotalWordMeaningsNum';

        if ( inSearch == true )
        {
            sendingData = {
                word: $( '#searchWordTextBox' ).val().trim(),
                wordClass: $( '#searchPartOfSpeechTextBox' ).val().trim(),
                wordlistName: $( '#searchWordlistTextBox' ).val().trim(),
                nativeMeaning: $( '#searchNativeMeaningTextBox' ).val().trim(),
                pageIndex: $( '#wordCurPage' ).val().trim(),
                username: $( '#userName' ).text(),
                requestType: requestTypeData
            };
        }
        else
        {
            sendingData = {
                username: $( '#userName' ).text(),
                requestType: requestTypeData
            };
        }

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
                    /* In case response from server is successful */
                    if ( $( this ).isServerResponseOk( response, status ) )
                        $( this ).getTotalWordMeaningsNumOnSuccess( response, status );
                },
            data: sendingData
        } );
    }

    $.fn.getTotalWordMeaningsNumOnSuccess = function( response, status ) {
        var numWordPerPage = 10;

        $( '#wordTotalPage' ).html( Math.ceil( response[ 'dataContent' ] / numWordPerPage ) );

        if( $( '#wordTotalPage' ).text() == '0' )
        {
            $( '#wordCurPage' ).val( 0 );
            $( '#wordsCurrentPageSpan' ).html( '0' );
        }

        $( '#totalWordMeaningsSpan' ).html( response[ 'dataContent' ] );
    }

    $.fn.getTotalWordNumOnSuccess = function( response, status ) {
        $( this ).updateStatisticValue( 'totalWordsSpan', response[ 'dataContent' ] );

        $( this ).updateWordsOnCurrentPage( true );
    }

    $.fn.reloadCounterInfo = function( isInSearch ) {
        var getTotalWordsNumSendingData, getTotalWordMeaningsNumSendingData;

        if ( isInSearch )
        {
            getTotalWordsNumSendingData = {
                word: $( '#searchWordTextBox' ).val().trim(),
                wordClass: $( '#searchPartOfSpeechTextBox' ).val().trim(),
                wordlistName: $( '#searchWordlistTextBox' ).val().trim(),
                nativeMeaning: $( '#searchNativeMeaningTextBox' ).val().trim(),
                username: $( '#userName' ).text(),
                requestType: 'getTotalWordsNum'
            }

            getTotalWordMeaningsNumSendingData = {
                word: $( '#searchWordTextBox' ).val().trim(),
                wordClass: $( '#searchPartOfSpeechTextBox' ).val().trim(),
                wordlistName: $( '#searchWordlistTextBox' ).val().trim(),
                nativeMeaning: $( '#searchNativeMeaningTextBox' ).val().trim(),
                username: $( '#userName' ).text(),
                requestType: 'getTotalWordMeaningsNum'
            }
        }
        else
        {
            getTotalWordsNumSendingData = {
                username: $( '#userName' ).text(),
                requestType: 'getTotalWordsNum'
            }

            getTotalWordMeaningsNumSendingData = {
                username: $( '#userName' ).text(),
                requestType: 'getTotalWordMeaningsNum'
            }
        }

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
                    /* In case response from server is successful */
                    if ( $( this ).isServerResponseOk( response, status ) )
                    {
                        $( this ).getTotalWordNumOnSuccess( response, status );
                    }
                },
            data: getTotalWordsNumSendingData
        } );

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
                    /* In case response from server is successful */
                    if ( $( this ).isServerResponseOk( response, status ) )
                    {
                        $( this ).getTotalWordMeaningsNumOnSuccess( response, status );
                    }
                },
            data: getTotalWordMeaningsNumSendingData
        } );
    };

    $.fn.loadWordViewOnSearch = function( isNewSearch ) {
        var sendingData = {
            word: $( '#searchWordTextBox' ).val().trim(),
            wordClass: $( '#searchPartOfSpeechTextBox' ).val().trim(),
            wordlistName: $( '#searchWordlistTextBox' ).val().trim(),
            nativeMeaning: $( '#searchNativeMeaningTextBox' ).val().trim(),
            pageIndex: $( '#wordCurPage' ).val().trim(),
            username: $( '#userName' ).text(),
            requestType: 'searchWordItem'
        }

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
                    /* In case response from server is successful */
                    if ( $( this ).isServerResponseOk( response, status ) )
                    {
                        $( this ).resetControlInfo( response[ 'msg' ] );

                        $( this ).reloadWordViewTbl( response[ 'dataContent' ] );

                        $( this ).updateRecordNumOnCurPage( 'word', isNewSearch );

                        $( this ).addNewWordTextBoxFocus();

                        $( this ).bindEventsToControls();
                    }
                },
            data: sendingData
        } );
    }

/* =========================== Helper functions - END =========================== */

} );
$( document ).ready( function() {

/* =========================== Callback functions - START =========================== */

    $.fn.addNewWordlistBtnOnClick = function( event ) {
        event.preventDefault();

        var wordlistName = $( '#addNewWordlistTextBox' ).val().trim();

        var errMsg = $( this ).validateWordlistName( wordlistName );

        /* If input wordlist name is valid */
        if ( errMsg == EMPTY_STRING ) {
            var sendingData = {
                wordlistName: $( '#addNewWordlistTextBox' ).val(),
                username: $( '#userName' ).text(),
                requestType: 'addWordListName'
            };

            $.ajax( {
                url: '/mods/wordlist/wordlistControl.php',
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

                            $( this ).reloadWordlistViewTbl( response[ 'dataContent' ] );

                            $( this ).addNewWordlistTextBoxFocus();

                            $( this ).bindWordlistEvents();
                            $( this ).bindGeneralEvents();
                        }
                    },
                data: sendingData
            } );
        }
        else
            $( this ).displayErrMsg( errMsg );
    }

    $.fn.delSelectedWordListsBtnOnClick = function( event ) {
        event.preventDefault();

        var selectedWordlistName = new Array();

        $.each( $( 'input[name="wordList[]"]:checked' ), function() {
            var rowObj = $( this ).parent().parent();

            $.each( rowObj.find( '.wordlist[data-controltranstype]' ), function() {
                selectedWordlistName.push( $( this ).attr( 'data-sourcewordlistname' ).trim() );
            } );
        } );

        if ( selectedWordlistName.length > 0 ) {
            var sendingData = {
                'wordlistNameArr[]': selectedWordlistName,
                username: $( '#userName' ).text(),
                requestType: 'delSelectedWordListNames'
            };

            $.ajax( {
                url: '/mods/wordlist/wordlistControl.php',
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

                            $( this ).reloadWordlistViewTbl( response[ 'dataContent' ], true );

                            $( this ).addNewWordlistTextBoxFocus();
                        }
                    },
                data: sendingData
            } );
        }
        else
            $( this ).displayErrMsg( ERR_0002 );
    }

    $.fn.updateWordlistNameBtnOnClick = function( event ) {
        var oldWordlistName, newWordlistName, wordlistNameSpanObj;
        var rowObj = $( this ).parent().parent();

        wordlistNameSpanObj = rowObj.find( 'span.wordlist[data-controltranstype]' );

        $.each( wordlistNameSpanObj, function() {
            oldWordlistName = $( this ).attr( 'data-sourcewordlistname' ).trim();
            newWordlistName = $( this ).text().trim();
        } );

        $( this ).updateWordlistName( oldWordlistName, newWordlistName );
    }

    $.fn.updateSelectedWordListsBtnOnClick = function( event ) {
        event.preventDefault();

        var selectedWordlistNameMap = {};

        $.each( $( 'input[name="wordList[]"]:checked' ), function() {
            var rowObj = $( this ).parent().parent();

            $.each( rowObj.find( '.wordlist[data-controltranstype]' ), function() {
                selectedWordlistNameMap[ $( this ).attr( 'data-sourcewordlistname' ).trim() ] = $( this ).text().trim();
            } );
        } );

        if ( Object.keys( selectedWordlistNameMap ).length > 0 ) {
            var sendingData = {
                'wordlistNamesMap': selectedWordlistNameMap,
                username: $( '#userName' ).text(),
                requestType: 'updateSelectedWordListNames'
            }

            $.ajax( {
                url: '/mods/wordlist/wordlistControl.php',
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

                            $( this ).reloadWordlistViewTbl( response[ 'dataContent' ] );

                            $( this ).addNewWordlistTextBoxFocus();

                            $( this ).bindWordlistEvents();
                            $( this ).bindGeneralEvents();
                        }
                    },
                data: sendingData
            } );
        }
    }

    $.fn.menuItemWordlistOnClick = function( event ) {
        $( this ).toggleActiveMenuItem( MENU_ITEM_WORDLIST );
        $( this ).switchMenuItem( event, MENU_ITEM_WORDLIST );
    }

    $.fn.getWordlistListOnSuccess = function( response, status ) {
        $( '#hiddenWordlistCb' ).empty();

        Object.keys( response[ 'dataContent' ] ).forEach( function ( key ) {
                                                              var option = '<option value="' + key + '">' + response[ 'dataContent' ][ key ] + '</option>';
                                                              $( '#hiddenWordlistCb' ).append( option );
                                                          } );
    }

    $.fn.getTotalWordlistNumOnSuccess = function( response, status ) {
        $( this ).updateWordlistsStatistic( response[ 'dataContent' ], true );
    }

/* =========================== Callback functions - END =========================== */


/* =========================== Helper functions - START =========================== */

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

        $( this ).checkAndBindEventForEle( '#wordlistFirstPage',
                                           eventArr,
                                           $.fn.wordlistFirstPageBtnOnClick );

        $( this ).checkAndBindEventForEle( '#wordlistPrevPage',
                                           eventArr,
                                           $.fn.wordlistPrevPageBtnOnClick );

        $( this ).checkAndBindEventForEle( '#wordlistNextPage',
                                           eventArr,
                                           $.fn.wordlistNextPageBtnOnClick );

        $( this ).checkAndBindEventForEle( '#wordlistLastPage',
                                           eventArr,
                                           $.fn.wordlistLastPageBtnOnClick );

        $( this ).checkAndBindEventForEle( '#enableWordlistSearch',
                                           eventArr,
                                           $.fn.enableWordlistSearchOnClick );

        ( eventArr = [] ).push( 'keydown' );
        $( this ).checkAndBindEventForEle( '#wordlistCurPage',
                                           eventArr,
                                           $.fn.wordlistCurPageBtnOnKeydown );

        eventArr = null;
    }

    $.fn.validateWordlistName = function( wordlistName ) {
        if ( wordlistName == EMPTY_STRING )
            return ERR_0001;
        else
            return EMPTY_STRING;
    }

    $.fn.updateWordlistName = function( oldWordlistName, newWordlistName ) {
        if ( oldWordlistName != EMPTY_STRING &&
            newWordlistName != EMPTY_STRING &&
            oldWordlistName != newWordlistName ) {

            var rowObj = $( this ).parent().parent();

            var sendingData = {
                oldVal: oldWordlistName,
                newVal: newWordlistName,
                username: $( '#userName' ).text(),
                requestType: 'updateWordListName'
            };

            $.ajax( {
                url: '/mods/wordlist/wordlistControl.php',
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

                            $( this ).updateNewWordlistNameOfRow( rowObj, newWordlistName );

                            $( this ).resetCheckboxOfRow( rowObj );

                            $( this ).addNewWordlistTextBoxFocus();
                        }
                    },
                data: sendingData
            } );
        }
        else
            $( this ).displayErrMsg( ERR_0003 );
    };

    $.fn.wordlistFirstPageBtnOnClick = function( event ) {
        $( this ).firstPageBtnClicked( event, 'wordlist' );
    }

    $.fn.wordlistPrevPageBtnOnClick = function( event ) {
        $( this ).prevPageBtnClicked( event, 'wordlist' );
    }

    $.fn.wordlistNextPageBtnOnClick = function( event ) {
        $( this ).nextPageBtnClicked( event, 'wordlist' );
    }

    $.fn.wordlistLastPageBtnOnClick = function( event ) {
        $( this ).lastPageBtnClicked( event, 'wordlist' );
    }

    $.fn.wordlistCurPageBtnOnKeydown = function( event ) {
        $( this ).curPageKeydowned( event, 'wordlist' );
    }

    $.fn.enableWordlistSearchOnClick = function( event ) {
        $( this ).enableSearchOnClick( 'wordlist' );
    }

    $.fn.reloadWordlistViewTbl = function( dataContent, isRemoveSelectedItems = false ) {
        /* Remove old rows in wordlist table and update new content */
        if ( isRemoveSelectedItems )
        {
            $( '.dynRowWordList' ).filter( function() {
                return ( $( this ).children().children( 'input[type=checkbox]:checked' ).length != 0 );
            } ).remove();
        }
        else
        {
            $( '.dynRowWordList' ).remove();
            $( '#wordlistViewTbl' ).children().append( dataContent );
        }
    }

    $.fn.addNewWordlistTextBoxFocus = function() {
        /* Set focus to the add new word text box with whole text is selected */
        $( '#addNewWordlistTextBox' ).focus();
        document.getElementById( 'addNewWordlistTextBox' ).setSelectionRange( 0, $( '#addNewWordlistTextBox' ).val().length );
    }

    $.fn.updateNewWordlistNameOfRow = function( rowObj, newVal ) {
        var wordlistNameSpanObj = rowObj.find( 'span.wordlist[data-controltranstype]' );

        $.each( wordlistNameSpanObj, function() {
            $( this ).attr( 'data-sourcewordlistname', newVal );
            $( this ).css( 'color', 'black' );
            $( this ).removeClass( 'modified' );
        } );
    }

    $.fn.updateWordlistNumsOnCurPage = function( resetCurPage ) {
        $( this ).updateRecordNumOnCurPage( 'wordlist', resetCurPage );
    }

    $.fn.updateWordlistsStatistic = function( totalWordlistNum, resetCurPage ) {
        var numWordlistPerPage = 10;

        $( this ).updateStatisticValue( 'totalWordlistsSpan', totalWordlistNum );

        $( this ).updateStatisticValue( 'wordlistsCurrentPageSpan', $( '#totalRowsInTable' ).text() );

        if ( $( '#totalRowsInTable' ).text() == '0' )
            $( '#wordlistCurPage' ).val( 0 );

        if ( resetCurPage )
            $( '#wordlistCurPage' ).val( 1 );

        $( this ).updateStatisticValue( 'wordlistTotalPage', Math.ceil( totalWordlistNum / numWordlistPerPage ) );

        if( $( '#wordlistTotalPage' ).text() == '0' )
        {
            $( '#wordlistCurPage' ).val( 0 );
            $( this ).updateStatisticValue( 'wordlistsCurrentPageSpan', 0 );
        }
    }

    $.fn.loadWordlistViewOnSearch = function( isNewSearch ) {
        var sendingData = {
            wordlistName: $( '#searchWordlistTextBox' ).val().trim(),
            pageIndex: $( '#wordlistCurPage' ).val().trim(),
            username: $( '#userName' ).text(),
            requestType: 'searchWordlistItem'
        }

        $.ajax( {
            url: '/mods/wordlist/wordlistControl.php',
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

                        $( this ).reloadWordlistViewTbl( response[ 'dataContent' ] );

                        $( this ).updateRecordNumOnCurPage( 'wordlist', isNewSearch );

                        $( this ).addNewWordTextBoxFocus();

                        $( this ).bindEventsToControls();
                    }
                },
            data: sendingData
        } );
    }

/* =========================== Helper functions - END =========================== */
} );
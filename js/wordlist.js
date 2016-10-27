$( document ).ready( function() {

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

    $.fn.resetCheckboxOfRow = function( rowObj ) {
        var chkBoxObj = rowObj.find( 'input[type="checkbox"]' );

        $.each( chkBoxObj, function() {
            $( this ).prop( 'checked', false );
        } );
    }

    $.fn.validateWordlistName = function( wordlistName ) {
        if ( wordlistName == EMPTY_STRING )
            return ERR_0001;
        else
            return EMPTY_STRING;
    }
} );
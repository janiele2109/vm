$( document ).ready( function() {

    $.fn.addNewWordlistBtnClicked = function( event ) {
        event.preventDefault();

        var wordlistName = $( '#addNewWordlistTextBox' ).val().trim();

        var errMsg = $( this ).validateWordlistName( wordlistName );

        /* If input wordlist name is valid */
        if ( errMsg == EMPTY_STRING ) {
            var sendingData = {
                wordlistName: $( '#addNewWordlistTextBox' ).val(),
                requestType: 'addWordListName'
            };

            $.ajax( {
                url: '/mods/wordlist/wordlistControl.php',
                type: 'post',
                dataType: 'json',
                cache: false,
                error:
                    function( xhr, status, error ) {
                        $( this ).errRequestServerData( xhr, status, error );
                    },
                success:
                    function( response, status ) {
                        /* In case response from server is successful */
                        if ( $( this ).checkServerResponse( response, status ) )
                        {
                            $( this ).resetControlInfo( response[ 'msg' ] );

                            $( this ).reloadWordlistViewTbl( response[ 'dataContent' ] );

                            $( this ).addNewWordlistTextBoxFocus();

                            $( this ).bindEventsToControls();
                        }
                    },
                data: sendingData
            } );
        }
        else
            $( this ).err( errMsg );
    }

    $.fn.delSelectedWordListsBtnClicked = function( event ) {
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
                requestType: 'delSelectedWordListNames'
            };

            $.ajax( {
                url: '/mods/wordlist/wordlistControl.php',
                type: 'post',
                dataType: 'json',
                cache: false,
                error:
                    function( xhr, status, error ) {
                        $( this ).errRequestServerData( xhr, status, error );
                    },
                success:
                    function( response, status ) {
                        /* In case response from server is successful */
                        if ( $( this ).checkServerResponse( response, status ) )
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
            $( this ).err( ERR_0002 );
    }

    $.fn.updateWordlistNameBtnClicked = function( event ) {
        var oldWordlistName, newWordlistName, wordlistNameSpanObj;
        var rowObj = $( this ).parent().parent();

        wordlistNameSpanObj = rowObj.find( 'span.wordlist[data-controltranstype]' );

        $.each( wordlistNameSpanObj, function() {
            oldWordlistName = $( this ).attr( 'data-sourcewordlistname' ).trim();
            newWordlistName = $( this ).text().trim();
        } );

        $( this ).updateWordlistName( oldWordlistName, newWordlistName );
    }

    $.fn.updateSelectedWordListsBtnClicked = function( event ) {
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
                requestType: 'updateSelectedWordListNames'
            }

            $.ajax( {
                url: '/mods/wordlist/wordlistControl.php',
                type: 'post',
                dataType: 'json',
                cache: false,
                error:
                    function( xhr, status, error ) {
                        $( this ).errRequestServerData( xhr, status, error );
                    },
                success:
                    function( response, status ) {
                        /* In case response from server is successful */
                        if ( $( this ).checkServerResponse( response, status ) )
                        {
                            $( this ).resetControlInfo( response[ 'msg' ] );

                            $( this ).reloadWordlistViewTbl( response[ 'dataContent' ] );

                            $( this ).addNewWordlistTextBoxFocus();
                        }
                    },
                data: sendingData
            } );
        }
    }

    $.fn.updateWordlistName = function( oldWordlistName, newWordlistName ) {
        if ( oldWordlistName != EMPTY_STRING &&
            newWordlistName != EMPTY_STRING &&
            oldWordlistName != newWordlistName ) {

            var rowObj = $( this ).parent().parent();

            var sendingData = {
                oldVal: oldWordlistName,
                newVal: newWordlistName,
                requestType: 'updateWordListName'
            };

            $.ajax( {
                url: '/mods/wordlist/wordlistControl.php',
                type: 'post',
                dataType: 'json',
                cache: false,
                error:
                    function( xhr, status, error ) {
                        $( this ).errRequestServerData( xhr, status, error );
                    },
                success:
                    function( response, status ) {
                        /* In case response from server is successful */
                        if ( $( this ).checkServerResponse( response, status ) )
                        {
                            $( this ).resetControlInfo( response[ 'msg' ] );

                            $( this ).updateNewWordlistNameOfRow( rowObj, newWordlistName );

                            $( this ).resetCheckboxOfRow( rowObj );

                            $( this ).addNewWordlistTextBoxFocus();

                            $( this ).bindEventsToControls();
                        }
                    },
                data: sendingData
            } );
        }
        else
            $( this ).err( ERR_0003 );
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
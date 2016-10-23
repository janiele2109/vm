$( document ).ready( function() {

    $.fn.addNewWord = function( event ) {
        event.preventDefault();

        var wordTitle = $( '#addNewWordTextBox' ).val().trim();
        var partOfSpeech = $( '#wordClassCb' ).find( ':selected' ).val().trim();
        var pronunciation = $( '#pronunciationTextBox' ).val().trim();
        var wordlistId = $( '#wordlistCb' ).find( ':selected' ).val().trim();
        var meaning = $( '#meaningTextArea' ).val().trim();
        var example = $( '#exampleTextArea' ).val().trim();

        var result = $( this ).validateInputData( wordTitle,
                                                  pronunciation,
                                                  meaning,
                                                  example );

        if ( result == EMPTY_STRING )
        {
            var sendingData = {
                word: wordTitle,
                partsOfSpeech: partOfSpeech,
                pronunciation: pronunciation,
                wordlistId: wordlistId,
                wordMeaning: meaning,
                wordExample: example,
                requestType: 'addWord'
            }

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
                        /* In case response from server is successful */
                        if ( $( this ).checkServerResponse( response, status ) )
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
        else
            $( this ).err( errMsg );
    }

    $.fn.delSelectedWords = function( event ) {
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
                requestType: 'delSelectedWords'
            }

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
                        /* In case response from server is successful */
                        if ( $( this ).checkServerResponse( response, status ) )
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

    $.fn.updateSelectedWords = function( event ) {
        event.preventDefault();

        var modifiedWordRowList = new Array();

        $.each( $( 'input[name="word[]"]:checked' ), function() {
            var rowObj = $( this ).parent().parent();

            var modifiedRow = [];
            var exampleList = [];
            var data = {};

            $.each( rowObj.find( 'span[data-controltranstype]' ), function() {
                var classString = $( this ).attr( 'class' );
                var ctrlType = '';
                var valObj = {};

                if ( classString.search( /\bword\b/ ) != -1 )
                {
                    ctrlType = 'word';
                    valObj[ 'orgVal' ] = $( this ).attr( 'data-sourceword' );
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
                requestType: 'updateSelectedWords'
            }

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
                    function( response, status) {
                        /* In case response from server is successful */
                        if ( $( this ).checkServerResponse( response, status ) )
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

    $.fn.updateWord = function( event, rowObj ) {
        event.preventDefault();

        var modifiedRow = [];
        var exampleList = [];
        var data = {};

        $.each( rowObj.find( 'span[data-controltranstype]' ), function() {
            var classString = $( this ).attr( 'class' );
            var ctrlType = '';
            var valObj = {};

            if ( classString.search( /\bword\b/ ) != -1 )
            {
                ctrlType = 'word';
                valObj[ 'orgVal' ] = $( this ).attr( 'data-sourceword' );
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
                requestType: 'updateWord'
            }

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
                    function(response,status) {
                        /* In case response from server is successful */
                        if ( $( this ).checkServerResponse( response, status ) )
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
                                       wordExample ) {
        var result = $( this ).validateWordTitle( wordTitle );

        if ( result != EMPTY_STRING )
            return result;

        result = $( this ).validatePronunciation( pronunciation );

        if ( result != EMPTY_STRING )
            return result;

        result = $( this ).validateWordMeaning( wordMeaning );

        if ( result != EMPTY_STRING )
            return result;

        result = $( this ).validateWordExample( wordExample );

        if ( result != EMPTY_STRING )
            return result;

        return EMPTY_STRING;
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

            $( this ).css( 'color', 'black' );
            $( this ).removeClass( 'modified' );
        } );

        $.each( rowObj.find( 'div.exampleEntry.modified' ), function() {
            $( this ).attr( 'data-sourceexample', $( this ).text() );
        } );
    }

    $.fn.exampleBtnlDivMouseOut = function( event ) {
        $( '.exampleBtnlDiv' ).remove();

        if ( $( 'div.exampleEntry' ).length != 0)
            $( 'div.exampleEntry' ).removeClass( 'transEffectHover' );
    };

    $.fn.updateExampleBtnClick = function( event ) {

        var textarea = $( this ).toTextAreaControl( $( 'div[data-exId=' + $( this ).attr( 'data-exId' ) + ']' ).text() );

        $( textarea ).removeAttr( 'id' );
        $( textarea ).removeAttr( 'style' );

        textarea.style.width = $( this ).parent().width() - 6 + 'px';
        textarea.style.color = $( 'div[data-exId=' + $( textarea ).attr( 'data-exId' ) + ']' ).css( 'color' );

        $( textarea ).addClass( 'transEffect' );

        $( textarea ).attr( 'data-controltranstype', 'div' );

        $( 'div[data-exId=' + $( textarea ).attr( 'data-exId' ) + ']' ).replaceWith( textarea );

        $( '<br/>' ).insertAfter( textarea );

        $( textarea ).focus();
        $( '.exampleBtnlDiv' ).remove();
        $( 'div.exampleEntry' ).removeClass( 'transEffectHover' );
    };

    $.fn.addExampleBtnClick = function( event ) {
        var textarea = $( this ).toTextAreaControl( '' );
        var tdTag = null;

        if ( $( this ).is( '[data-exId]' ) )
            tdTag = $( 'div[data-exId=' + $( this ).attr( 'data-exId' ) + ']' ).parent();
        else
            tdTag = $( this ).parent().parent();

        $( textarea ).removeAttr( 'id' );
        $( textarea ).removeAttr( 'style' );

        textarea.style.width = $( this ).parent().width() - 6 + 'px';
        textarea.style.color = 'red';
        $( textarea ).css( 'left', '5px' );
        $( textarea ).css( 'width', $( tdTag ).width() - 10 + 'px' );

        $( textarea ).attr( 'data-controltranstype', 'div' );
        $( textarea ).attr( 'data-exId', 'ex_' + $( 'div[data-exId]' ).length );
        $( textarea ).attr( 'data-sourceexample', '' );

        $( tdTag ).append( textarea );

        $( '<br/>' ).insertAfter( textarea );

        $( '<br/>' ).insertAfter( textarea );

        $( textarea ).focus(); 

        $( '.exampleBtnlDiv' ).remove();

        if ( $( 'div.exampleEntry' ).length > 0 )
            $( 'div.exampleEntry' ).removeClass( 'transEffectHover' );
    };
} );
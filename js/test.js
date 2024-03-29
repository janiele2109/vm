$(document).ready(function() {

    var unCheckDataArr = new Array();
    var testData = null;
    var rightAns = 0;
    var isFinish = false;

    $.fn.testBtnOnClick = function( event ) {
        event.preventDefault();

        rightAns = 0;

        /* ============== Get total word num ============== */

        var getTotalWordNum = {
            wordlistId: $( '#testingWordlistCb' ).find( ':selected' ).val().trim(),
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
                    $( '#totalWordNum' ).text( response[ 'dataContent' ] );
                },
            data: getTotalWordNum
        } );

        /* ============== Get test data ============== */

        $( this ).getTestData( event );
    }

    $.fn.checkWordBtnOnClick = function( event ) {
        event.preventDefault();

        eleAppearControl( 'visible', 'resultSpan' );

        if ( $( '#inputWord' ).prop( 'value' ) == '' )
        {
            $( '#resultSpan' ).html( 'No word is input!' );
            $( '#resultSpan' ).css( 'color','red' );

            $( '#inputWord' ).focus();

            return;
        }

        if ( $( '#inputWord' ).prop( 'value' ) == $( '#meaningSpan' ).attr( 'data-word' ) )
        {
            eleAppearControl( 'visible' );

            $( '#resultSpan' ).html( 'Correct!' );
            $( '#resultSpan' ).css( 'color','green' );

            rightAns++;

            if ( $( '#nextWordBtn' ).css( 'display' ) != 'none' )
                $( '#nextWordBtn' ).focus();
            else if ( $( '#retestBtn' ).css( 'display' ) != 'none' )
                $( '#retestBtn' ).focus();
        }
        else
        {
            $( '#resultSpan' ).html( 'Wrong!' );
            $( '#resultSpan' ).css( 'color','red' );

            $( '#showWordBtn' ).focus();
        }

        $( '#correctedRate' ).html( rightAns + '/' + $( '#totalWordNum' ).text() );

        if ( isFinish == true )
        {
            var score = ( rightAns / parseInt( $( '#totalWordNum' ).text() ) ) * 100;

            $( '#resultSpan' ).html( $( '#resultSpan' ).html() + '<br/>Finish testing!<br/>Score: ' + score + '%');

            if ( $( '#testingWordlistCb' ).find( ':selected' ).val().trim() != 'allWordlists' )
                    $( this ).updateScore( score );

            isFinish = false;
        }
    }

    $.fn.showWordBtnOnClick = function( event ) {
        event.preventDefault();

        eleAppearControl( 'visible' );

        $( '#resultSpan' ).html( $( '#meaningSpan' ).attr( 'data-word' ) );
        $( '#resultSpan' ).css( 'color', 'blue' );
    
        if ( $( '#nextWordBtn' ).css( 'display' ) != 'none' )
            $( '#nextWordBtn' ).focus();
        else if ( $( '#retestBtn' ).css( 'display' ) != 'none' )
            $( '#retestBtn' ).focus();

        $( '#checkWordBtn' ).attr( 'disabled', true );
    }

    $.fn.nextWordBtnOnClick = function( event ) {
        event.preventDefault();

        eleAppearControl( 'hidden' );

        $( '#checkWordBtn' ).attr( 'disabled', false );

        $( '#inputWord' ).prop( 'value', '' );
        $( '#inputWord' ).focus();

        genNewWord( event );

        if ( unCheckDataArr.length == 0 )
        {
            $( '#retestBtn' ).css( 'display', 'inline' );
            $( '#nextWordBtn' ).css( 'display', 'none' );
        }
    }

    $.fn.retestBtnOnClick = function( event ) {
        event.preventDefault();

        eleAppearControl( 'hidden' );

        $( '#startOffset' ).text( '0' );
        $( '#curTestWordIndex' ).text( '0' );

        $( this ).getTestData( event );

        $( '#checkWordBtn' ).attr( 'disabled', false );

        if ( Object.keys( testData ).length == 1 )
        {
            $( '#retestBtn' ).css( 'display', 'inline' );
            $( '#nextWordBtn' ).css( 'display', 'none' );
        }
        else
        {
            $( '#retestBtn' ).css( 'display', 'none' );
            $( '#nextWordBtn' ).css( 'display', 'inline' );
        }

        $( '#inputWord' ).prop( 'value', '' );
        $( '#inputWord' ).focus();

        var cnt = 0;

        $.each( testData, function() {
            unCheckDataArr[ cnt ] = cnt++;
        } );

        rightAns = 0;

        $( '#correctedRate' ).html( rightAns + '/' + $( '#totalWordNum' ).text() );
    }

    $.fn.displayPronOnClick = function( event ) {
        if ( $( this ).prop( 'checked' ) &&
            $( '#resultSpan' ).css( 'visibility' ) == 'visible' &&
            $( '#resultSpan' ).css( 'color' ) != 'rgb(255, 0, 0)' )
        {
            $( '#pronunciationSpan' ).css( 'visibility', 'visible' );
        }
        else
        {
            $( '#pronunciationSpan' ).css( 'visibility', 'hidden' );
        }
    }

    $.fn.displayExampleOnClick = function( event ) {
        if ( $( this ).prop( 'checked' ) &&
            $( '#resultSpan' ).css( 'visibility' ) == 'visible' &&
            $( '#resultSpan' ).css( 'color' ) != 'rgb(255, 0, 0)' )
        {
            $( '#exampleDiv' ).css( 'visibility', 'visible' );
        }
        else
        {
            $( '#exampleDiv' ).css( 'visibility', 'hidden' );
        }
    }

    $.fn.displayNativeMeaningOnClick = function( event ) {
        if ( $( this ).prop( 'checked' ) &&
            $( '#resultSpan' ).css( 'visibility' ) == 'visible' &&
            $( '#resultSpan' ).css( 'color' ) != 'rgb(255, 0, 0)' )
        {
            $( '#nativeMeaningDiv' ).css( 'visibility', 'visible' );
        }
        else
        {
            $( '#nativeMeaningDiv' ).css( 'visibility', 'hidden' );
        }
    }

    $.fn.menuItemTestOnClick = function( event ) {
        $( this ).toggleActiveMenuItem( MENU_ITEM_TEST );
        $( this ).switchMenuItem( event, MENU_ITEM_TEST );
    }

    $.fn.getTestData = function( event ) {
        event.preventDefault();

        var sendingData = {
            testingWordlists: $( '#testingWordlistCb' ).find( ':selected' ).val().trim(),
            startOffset: $( '#startOffset' ).text(),
            username: $( '#userName' ).text(),
            requestType: 'testDataRequest'
        }

        $.ajax( {
            url: '/mods/test/testControl.php',
            type: 'post',
            dataType: 'json',
            cache: false,
            error:
                function( xhr, status, error ) {
                    $( this ).displayErrMsg( xhr.responseText );
                },
            success: 
                function( response, status ) {
                    if ( $( this ).isServerResponseOk( response, status ) )
                    {
                        testData = response[ 'dataContent' ];

                        var cnt = 0;

                        $.each( testData, function() {
                            unCheckDataArr[ cnt ] = cnt++;
                        } );

                        $( '#startOffset' ).text( parseInt( $( '#startOffset' ).text() ) + cnt );

                        if ( parseInt( $( '#startOffset' ).text() ) > parseInt( $( '#totalWordNum' ).text() ) )
                            $( '#startOffset' ).text( '0' );

                        if ( Object.keys( testData ).length > 0 )
                        {
                            $( '#testBtn' ).css( 'display', 'none' );

                            if ( Object.keys( testData ).length == 1 )
                            {
                                $( '#retestBtn' ).css( 'display', 'inline' );
                                $( '#nextWordBtn' ).css( 'display', 'none' );
                            }
                            else
                            {
                                $( '#retestBtn' ).css( 'display', 'none' );
                                $( '#nextWordBtn' ).css( 'display', 'inline' );
                            }

                            eleAppearControl( 'hidden' );
                            $( '.toggleTestForm' ).css( 'display', 'inline' );

                            if ( $( '#curTestWordIndex' ).text() == '0' )
                                genNewWord( event );

                            $( '#inputWord' ).focus();
                        }
                        else
                        {
                            $( '#msgDiv' ).css( 'display', 'inline-block' ).html( 'There is no data for testing' );
                            $( '#testBtn' ).css( 'display', 'none' );

                            eleAppearControl( 'hidden' );
                        }
                    }
                },
            data: sendingData
        } );
    }

    function randomNumber( min = 0, max = 0 ) { // include min and max
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }

    function genNewWord( event ) {
        var randomNo = randomNumber( 0, unCheckDataArr.length - 1 );
        var index = unCheckDataArr[ randomNo ];
        var pTag = null;

        $( '#meaningSpan' ).attr( 'data-wordId', testData[ index ][ 'wordId' ] );
        $( '#meaningSpan' ).attr( 'data-word', testData[ index ][ 'word' ] );
        $( '#meaningSpan' ).attr( 'data-wordlistName', testData[ index ][ 'wordlistName' ] );
        $( '#meaningSpan' ).attr( 'data-pronunciation', testData[ index ][ 'pronunciation' ] );

        $( '#meaningSpan').html( testData[ index ][ 'meaning' ] );
        $( '#wordClassSpan' ).html( '<i>(' + testData[ index ][ 'partOfSpeech' ] + ')</i>' );
        $( '#pronunciationSpan' ).html( $( '#meaningSpan' ).attr( 'data-pronunciation' ) );

        $( '#curTestWordIndex' ).text( parseInt( $( '#curTestWordIndex' ).text() ) + 1 );

        $( '#cntNumber').html( $( '#curTestWordIndex' ).text() + '/' + $( '#totalWordNum' ).text() );
        $( '#correctedRate' ).html( rightAns + '/' + $( '#totalWordNum' ).text() );

        $( '#nativeMeaningDiv' ).find( 'p.nativeMeaningP' ).remove();
        pTag = document.createElement( 'P' );
        $( pTag ).html( testData[ index ][ 'nativemeaning' ] );
        $( pTag ).addClass( 'nativeMeaningP' );
        $( '#nativeMeaningDiv' ).append( pTag );

        $( '#exampleDiv' ).find( 'p.exampleP' ).remove();

        for ( var i = 0; i < testData[ index ][ 'examples' ].length; i++ )
        {
            pTag = document.createElement( 'P' );
            $( pTag ).html( testData[ index ][ 'examples' ][ i ] );

            $( pTag ).addClass( 'exampleP' );

            $( '#exampleDiv' ).append( pTag );
        }

        unCheckDataArr.splice( randomNo, 1 );

        if ( unCheckDataArr.length == 0 )
        {
             if ( parseInt( $( '#startOffset' ).text() ) < parseInt( $( '#totalWordNum' ).text() ) )
                $( this ).getTestData( event );
            else
                isFinish = true;
        }
    }

    function eleAppearControl(behavior, controlId=null) {
        if (controlId != null)
            $('#' + controlId).css('visibility', behavior);
        else
        {
            if (behavior == 'visible')
            {
                $("#resultSpan").css('visibility', behavior);
                
                if ( $('#displayPron').prop('checked') )
                    $("#pronunciationSpan").css('visibility', behavior);

                if ( $('#displayNativeMeaning').prop('checked') )
                    $("#nativeMeaningDiv").css('visibility', behavior);

                if ( $('#displayExample').prop('checked') )
                    $("#exampleDiv").css('visibility', behavior);
            }
            else
            {
                $("#pronunciationSpan").css('visibility', behavior);
                $("#resultSpan").css('visibility', behavior);
                $("#nativeMeaningDiv").css('visibility', behavior);
                $("#exampleDiv").css('visibility', behavior);
                $("#testingWordlist").css('visibility', behavior);
            }
        }
    }

    $.fn.updateScore = function( score ) {
        var sendingData = {
            score: score,
            wordlistId: $( '#testingWordlistCb' ).find( ':selected' ).val().trim(),
            username: $( '#userName' ).text(),
            requestType: 'updateScore'
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
            data: sendingData
        } );
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

});
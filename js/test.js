$(document).ready(function() {

    var unCheckDataArr = new Array();
    var testData = null;

    $.fn.testBtnOnClick = function( event ) {
        event.preventDefault();

        var sendingData = {
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

                            genNewWord();

                            $( '#inputWord' ).focus();
                        }
                        else
                        {
                            $( '#msgDiv' ).css( 'display', 'inline-block' ).html( 'There is no data for testing' );
                            $( '#testBtn' ).css( 'display', 'none' );
                        }
                    }
                },
            data: sendingData
        } );
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

        genNewWord();

        if ( unCheckDataArr.length == 0 )
        {
            $( '#retestBtn' ).css( 'display', 'inline' );
            $( '#nextWordBtn' ).css( 'display', 'none' );
        }
    }

    $.fn.retestBtnOnClick = function( event ) {
        event.preventDefault();

        eleAppearControl( 'hidden' );

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

        genNewWord();
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

    function randomNumber( min = 0, max = 0 ) { // include min and max
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }

    function genNewWord() {
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
        $( '#cntNumber').html( ( Object.keys( testData ).length - unCheckDataArr.length ) + 1 + '/' + Object.keys( testData ).length );

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

        unCheckDataArr.splice( randomNo,1 );
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
            }
        }
    }

});
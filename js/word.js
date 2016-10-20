$(document).ready(function() {

    $( window ).on( 'load', function( event ) { if( window.location.pathname == '/word' ) $( this ).getWordlistList(); } );

    $('.toggleEnabled').on( 'mouseenter mouseleave', function( event ) {
        $( this ).toggleControl( event );
    });

    $('.exampleEntry').mouseenter(
        function() {
            if ( $('.exampleBtnlDiv').length == 0 && $('textarea.exampleEntry').length == 0 )
            {
                $(this).createExampleControlsDiv();
                $('.exampleBtnlDiv').fadeIn().find('#updateExampleBtn').focus();
                $(this).addClass('transEffectHover');
            }
        }
    );

    $('.exampleTd').mouseenter(
        function() {
            var div = $(this).find('div.exampleEntry');

            if ( $('.exampleBtnlDiv').length == 0 && $('textarea.exampleEntry').length == 0 && $('textarea.exampleTd').length == 0 && div.length == 0 )
            {
                $(this).createExampleControlsDiv();
                $('.exampleBtnlDiv').fadeIn().find('#updateExampleBtn').focus();
            }
        }
    );

    $("#addNewWordBtn").click(function(event) {
        event.preventDefault();

        if ( $("#addNewWordTextBox").val() == '' )
        {
            $("#msgDiv").html( 'Word title is empty!' );
            return;
        }

        if ( $("#pronunciationTextBox").val() == '' )
        {
            $("#msgDiv").html( 'Pronunciation is empty!' );
            return;
        }

        if ( $("#meaningTextArea").val() == '' )
        {
            $("#msgDiv").html( 'Meaning is empty!' );
            return;
        }

        var sendingData = {
            word: $("#addNewWordTextBox").val(),
            wordlistId: $("#wordlistCb").find(":selected").val(),
            partsOfSpeech: $("#wordClassCb").find(":selected").val(),
            pronunciation: $("#pronunciationTextBox").val(),
            wordMeaning: $("#meaningTextArea").val(),
            wordExample: $("#exampleTextArea").val(),
            requestType: "addWord"
        }

        $.ajax({
            url: '/mods/word/wordControl.php',
            type: 'post',
            dataType: 'json',
            cache: false,
            error:
                function( xhr, status, error ) {
                    $( this ).errRequestServerData( xhr, status, error );
                },
            success: 
                function(response,status){
                    if ( status != "success" || response['errState'] != "OK")
                    {
                        $("#msgDiv").html(response['msg']);
                        $("#msgDiv").addClass("err");
                    }
                    else
                    {
                        /* In case response from server is successful */
                        if ( $( this ).checkServerResponse( response, status ) )
                        {
                            $( this ).resetControlInfo( response[ 'msg' ] );

                            $( this ).reloadWordViewTbl( response[ 'dataContent' ] );

                            $( this ).addNewWordTextBoxFocus();

                            $( this ).bindEventsToControls();
                        }
                    }
                },
            data: sendingData
        });
     });

    $("#delSelectedWordsBtn").click(function(event) {
        event.preventDefault();

        var selectedWord = [];

        $("input[name='word[]']:checked").each(function() {
            var rowEle = $(this).parent().parent();
            var word, pron, wordlistName, meaning;
            var curIndex = selectedWord.length;
            var wordMap = {};

            rowEle.find('.word[data-controltranstype]').each(function(){ 
                word = $(this).attr('data-sourceword');
            });

            rowEle.find('.pronunciation[data-controltranstype]').each(function(){ 
                pron = $(this).attr('data-sourcepron');
            });

            rowEle.find('.wordlist[data-controltranstype]').each(function(){ 
                wordlistName = $(this).attr('data-sourcewordlistname');
            });

            rowEle.find('.meaning[data-controltranstype]').each(function(){ 
                meaning = $(this).attr('data-sourcemeaning');
            });

            wordMap[ "word" ] = word;
            wordMap[ "pron" ] = pron;
            wordMap[ "wordlistName" ] = wordlistName;
            wordMap[ "meaning" ] = meaning;

            selectedWord.push(wordMap);
        });

        var sendingData = {
            'selectedWordArr': JSON.stringify(selectedWord),
            requestType: "delSelectedWords"
        }

        $.ajax({
            url: '/mods/word/wordControl.php',
            type: 'post',
            dataType: 'json',
            cache: false,
            success: 
                function(response,status){
                    if ( status != "success" || response['errState'] != "OK")
                    {
                        $("#msgDiv").html(response['msg']);
                        $("#msgDiv").addClass("err");
                    }
                    else
                    {
                        $(".dynRowWord").filter(function() {
                            return ( $(this).children().children( "input[type=checkbox]:checked" ).length != 0 );
                        }).remove();

                        $("#msgDiv").removeClass("Err");
                        $("#msgDiv").html(response['msg']);
                        $("#wordViewTbl").children().append(response['dataContent']);
                        $("#selectAllChkbox").prop('checked', false);
                        $("#addNewWordTextBox").focus();
                    }
                },
            data: sendingData
        });
    });

    $( '.updateWordBtn' ).on( 'click', function( event ) {
        var rowEle = $( this ).parent().parent();

        $( this ).updateWord( event, rowEle );
    });

    $.fn.updateWord = function( event, rowEle ) {
        event.preventDefault();

        var modifiedRow = [];
        var exampleList = [];
        var data = {};

        $.each( rowEle.find( 'span[data-controltranstype]' ), function() {
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

        $.each( rowEle.find( 'div.exampleEntry' ), function() {
            var ex = {};

            ex[ 'orgVal' ] = $( this ).attr( 'data-sourceexample' );
            ex[ 'newVal' ] = $( this ).text();

            exampleList.push( ex );
        } );

        data[ 'exampleList' ] = exampleList;

        modifiedRow.push( data );

        var sendingData = {
            'modifiedRow': JSON.stringify( modifiedRow ),
            requestType: "updateWord"
        }

        $.ajax({
            url: '/mods/word/wordControl.php',
            type: 'post',
            dataType: 'json',
            cache: false,
            error:
                function( xhr, status, error ) {
                    $( this ).errRequestServerData( xhr, status, error );
                },
            success:
                function(response,status){
                    /* In case response from server is successful */
                    if ( $( this ).checkServerResponse( response, status ) )
                    {
                        $( this ).resetControlInfo( response[ 'msg' ] );

                        $( this ).updateModifiedWordRow( rowEle );

                        $( this ).resetCheckboxOfRow( rowEle );

                        $( this ).addNewWordlistTextBoxFocus();
                    }
                },
            data: sendingData
        });
    }

    $("#updateSelectedWordsBtn").click(function(event) {
        event.preventDefault();

        var modifiedWordRowList = new Array();

        $.each( $( 'input[name="word[]"]:checked' ), function() {
            var rowEle = $( this ).parent().parent();

            var modifiedRow = [];
            var exampleList = [];
            var data = {};

            $.each( rowEle.find( 'span[data-controltranstype]' ), function() {
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

            $.each( rowEle.find( 'div.exampleEntry' ), function() {
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
                requestType: "updateSelectedWords"
            }

            $.ajax({
                url: '/mods/word/wordControl.php',
                type: 'post',
                dataType: 'json',
                cache: false,
                error:
                    function( xhr, status, error ) {
                        $( this ).errRequestServerData( xhr, status, error );
                    },
                success:
                    function(response,status){
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
            });
        }
    });

    $('html').click(function(event){
        if ( $(event.target).prop('id') != 'updateExampleBtn' &&
            $(event.target).prop('id') != 'addExampleBtn' )
        {
            $('.exampleBtnlDiv').remove();
            $('div.exampleEntry').removeClass('transEffectHover');

            if ( event.target.tagName != 'TEXTAREA' )
            {
                $('textarea.exampleEntry').next('br').remove();
                $('textarea.exampleEntry').prev('br').remove();
                $('textarea.exampleEntry').remove();
            }
        }
    });

    $.fn.exampleBtnlDivMouseOut = function(event) {
        $('.exampleBtnlDiv').remove();

        if ($('div.exampleEntry').length != 0)
            $('div.exampleEntry').removeClass('transEffectHover');
    };

    $.fn.updateExampleBtnClick = function(event) {

        var textarea = $(this).toTextAreaControl($('div[data-exId=' + $(this).attr('data-exId') + ']').text());

        $(textarea).removeAttr('id');
        $(textarea).removeAttr('style');

        textarea.style.width = $(this).parent().width() - 6 + "px";
        textarea.style.color = $('div[data-exId=' + $(textarea).attr('data-exId') + ']').css("color");

        $(textarea).addClass('transEffect');

        $(textarea).attr('data-controltranstype', 'div');

        $('div[data-exId=' + $(textarea).attr('data-exId') + ']').replaceWith(textarea);

        $('<br/>').insertAfter(textarea);

        $(textarea).focus();
        $('.exampleBtnlDiv').remove();
        $('div.exampleEntry').removeClass('transEffectHover');
    };

    $.fn.addExampleBtnClick = function(event) {
        var textarea = $(this).toTextAreaControl('');
        var tdTag = null;

        if ($(this).is('[data-exId]'))
            tdTag = $('div[data-exId=' + $(this).attr('data-exId') + ']').parent();
        else
            tdTag = $(this).parent().parent();

        $(textarea).removeAttr('id');
        $(textarea).removeAttr('style');

        textarea.style.width = $(this).parent().width() - 6 + "px";
        textarea.style.color = 'red';
        $(textarea).css('left', '5px' );
        $(textarea).css('width', $(tdTag).width() - 10 + 'px' );

        $(textarea).attr('data-controltranstype', 'div');
        $(textarea).attr('data-exId', 'ex_' + $('div[data-exId]').length);
        $(textarea).attr('data-sourceexample', '');

        $(tdTag).append(textarea);

        $('<br/>').insertAfter(textarea);

        $('<br/>').insertAfter(textarea);

        $(textarea).focus(); 

        $('.exampleBtnlDiv').remove();

        if ($('div.exampleEntry').length > 0)
            $('div.exampleEntry').removeClass('transEffectHover');
    };

    $.fn.getWordlistList = function(event) {
        var sendingData = {
                          requestType: 'getWordlistList'
                      };

        $.ajax(
        {
            url: '/mods/word/wordControl.php',
            type: 'post',
            dataType: 'json',
            cache: false,
            success: 
                function( response, status )
                {
                    if ( status != "success" || response['errState'] != "OK")
                    {
                        $("#msg").html(response['msg']);
                        $("#msg").addClass("err");
                    }
                    else
                    {
                        Object.keys(response['dataContent']).forEach(function (key) {
                            var option = '<option value="' + key + '">' + response['dataContent'][key] + '</option>';
                            $("#hiddenWordlistCb").append(option);
                        });
                    }
                },
            data: sendingData
        });
    }

    $("#myWordMenuItem").click(function(event) {
        event.preventDefault();

        history.pushState( '', document.title, '/word' );

        var sendingData = {
            menuItem: 'word',
            userName: $( '#userName' ).text()
        }

        $.ajax( {
            url: '/mods/word/word.php',
            type: 'post',
            error:
                function( xhr, status, error ) {
                    $( this ).errRequestServerData( xhr, status, error );
                },
            success:
                function( response, status ) {
                    document.write( response );
                    document.close();
                },
            data: sendingData
        } );
    });




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

        $.each( rowEle.find( 'div.exampleEntry.modified' ), function() {
            $( this ).attr( 'data-sourceexample', $( this ).text() );
        } );
    }
});
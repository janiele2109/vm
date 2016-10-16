$(document).ready(function() {

    $('.toggleEnabled').on( 'mouseenter mouseleave', function( event ) {
        $( this ).toggleControl( event );
    });

    $('.exampleEntry').mouseenter(
        function() {
            if( $('.exampleBtnlDiv').length == 0 && $('textarea.exampleEntry').length == 0 )
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

            if( $('.exampleBtnlDiv').length == 0 && $('textarea.exampleEntry').length == 0 && $('textarea.exampleTd').length == 0 && div.length == 0 )
            {
                $(this).createExampleControlsDiv();
                $('.exampleBtnlDiv').fadeIn().find('#updateExampleBtn').focus();
            }
        }
    );

    $("#addNewWordBtn").click(function(event) {
        event.preventDefault();

        if( $("#addNewWordTextBox").val() == '' )
        {
            $("#msg").html( 'Word title is empty!' );
            return;
        }

        if( $("#pronunciationTextBox").val() == '' )
        {
            $("#msg").html( 'Pronunciation is empty!' );
            return;
        }

        if( $("#meaningTextArea").val() == '' )
        {
            $("#msg").html( 'Meaning is empty!' );
            return;
        }

        var sendingData = {
            wordName: $("#addNewWordTextBox").val(),
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
            success: 
                function(response,status){
                    if( status != "success" || response['errState'] != "OK")
                    {
                        $("#msg").html(response['msg']);
                        $("#msg").addClass("Err");
                    }
                    else
                    {
                        document.getElementById("addNewWordTextBox").setSelectionRange(0, $("#addNewWordTextBox").val().length);
                        $(".dynRowWord").remove();
                        
                        $("#msg").removeClass("Err");
                        $("#msg").html(response['msg']);
                        $("#tbWordView").children().append(response['htmlContent']);
                        $("#select_all").prop('checked', false);
                        $("#addNewWordTextBox").focus();  

                        $(".toggleEnabled").bind('mouseenter mouseleave', function (event) { $(this).toggleControl(event); } );
                        $(".exampleEntry").bind('mouseenter', function() {
                                                                            if( $('textarea.exampleEntry').length == 0 )
                                                                            {
                                                                                $(this).createExampleControlsDiv();
                                                                                $('.exampleBtnlDiv').fadeIn().find('#updateExampleBtn').focus();
                                                                                $(this).addClass('transEffectHover');
                                                                            }
                                                                         } );
                        $(".btnUpdateWord").bind('click', 
                                                  function (event) { 
                                                                        var rowEle = $(this).parent().parent();
                                                                        var modifiedControls = rowEle.find('span.modified');

                                                                        $(this).updateWord( event, modifiedControls );
                                                                    } );
                    }
                },
            data: sendingData
        });
     });

    $("#delSelectedWords").click(function(event) {
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
            'wordArr': JSON.stringify(selectedWord),
            requestType: "delSelectedWords"
        }

        $.ajax({
            url: '/mods/word/wordControl.php',
            type: 'post',
            dataType: 'json',
            cache: false,
            success: 
                function(response,status){
                    if( status != "success" || response['errState'] != "OK")
                    {
                        $("#msg").html(response['msg']);
                        $("#msg").addClass("Err");
                    }
                    else
                    {
                        $(".dynRowWord").filter(function() {
                            return ( $(this).children().children( "input[type=checkbox]:checked" ).length != 0 );
                        }).remove();

                        $("#msg").removeClass("Err");
                        $("#msg").html(response['msg']);
                        $("#tbWordView").children().append(response['htmlContent']);
                        $("#select_all").prop('checked', false);
                        $("#addNewWordTextBox").focus();
                    }
                },
            data: sendingData
        });
    });

    $('.btnUpdateWord').on( 'click', function( event ) {
        var rowEle = $(this).parent().parent();
        var modifiedControls = rowEle.find('.modified');

        $(this).updateWord( event, modifiedControls );
    });

    $.fn.updateWord = function(event, modifiedControls)
    {
        event.preventDefault();

        var rowEle = $(this).parent().parent();
        var modifiedEle = [];

        $.each( modifiedControls, function() { 
            var exampleList = [];
            var data = {};
            var dataSourceName = '';

            var classString = $(this).attr('class');
            var orgVal = '';
            var newVal = '';
            var controlType = '';

            if( classString.indexOf('word') != -1 )
            {
                dataSourceName = "data-sourceword";
                controlType = 'word';
            }

            else if( classString.indexOf('pronunciation') != -1 )
            {
                dataSourceName = "data-sourcepron";
                controlType = 'pronunciation';
            }

            else if( classString.indexOf('wordlist') != -1 )
            {
                dataSourceName = "data-sourcewordlistname";
                controlType = 'wordlist';
            }

            else if( classString.indexOf('meaning') != -1 )
            {
                dataSourceName = "data-sourcemeaning";
                controlType = 'meaning';
            }

            else if( classString.indexOf('exampleEntry') != -1 )
            {
                dataSourceName = "data-sourceexample";
                controlType = 'example';
            }

            if( controlType != 'example' )
            {
                orgVal = $(this).attr(dataSourceName);
                newVal = $(this).text();
            }
            else
            {
                var ex = {};

                ex['meaning'] = $(this).parent().parent().find('span.meaning').first().text();
                ex['orgVal'] = $(this).attr(dataSourceName);
                ex['newVal'] = $(this).text();

                exampleList.push(ex);
            }        

            data[ "word" ] = rowEle.find('span.word').attr('data-sourceword');
            data[ "controlType" ] = controlType;
            data[ "orgVal" ] = orgVal;
            data[ "newVal" ] = newVal;
            data[ "exampleList"] = exampleList;

            modifiedEle.push( data );
        });

        var sendingData = {
            'modifiedControls': JSON.stringify( modifiedEle ),
            requestType: "updateWord"
        }

        $.ajax({
            url: '/mods/word/wordControl.php',
            type: 'post',
            dataType: 'json',
            cache: false,
            success: 
                function(response,status){
                    if( status != "success" || response['errState'] != "OK")
                    {
                        $("#msg").html(response['msg']);
                        $("#msg").addClass("Err");
                    }
                    else
                    {
                        $("#msg").removeClass("Err");
                        $("#msg").html(response['msg']);
                        $("#select_all").prop('checked', false);
                        $("#addNewWordTextBox").focus();  

                        $.each( modifiedControls, function() { 
                            dataSourceName = '';

                            classString = $(this).attr('class');
                            controlType = '';
                            newVal = $(this).text();

                            if( classString.indexOf('word') != -1 )
                            {
                                dataSourceName = "data-sourceword";
                                controlType = 'word';
                            }

                            else if( classString.indexOf('pronunciation') != -1 )
                            {
                                dataSourceName = "data-sourcepron";
                                controlType = 'pronunciation';
                            }

                            else if( classString.indexOf('wordlist') != -1 )
                            {
                                dataSourceName = "data-sourcewordlistname";
                                controlType = 'wordlist';
                            }

                            else if( classString.indexOf('meaning') != -1 )
                            {
                                dataSourceName = "data-sourcemeaning";
                                controlType = 'meaning';
                            }

                            else if( classString.indexOf('exampleEntry') != -1 )
                            {
                                dataSourceName = "data-sourceexample";
                                controlType = 'example';
                            }

                            $(this).attr(dataSourceName, newVal);
                            $(this).css('color', 'black');
                            $(this).removeClass('modified');

                            var chkboxEle = rowEle.find('input[type="checkbox"]');
                            chkboxEle.first().prop('checked', false);
                        });
                    }
                },
            data: sendingData
        });
    };

    $("#updateSelectedWords").click(function(event) {
        event.preventDefault();
        var modifiedEleList = [];

        $("input[name='word[]']:checked").each(function() {
            var rowEle = $(this).parent().parent();
            var modifiedEle = [];

            var modifiedControls = rowEle.find('.modified');

            $.each( modifiedControls, function() { 
                var exampleList = [];
                var data = {};
                var dataSourceName = '';

                var classString = $(this).attr('class');
                var orgVal = '';
                var newVal = '';
                var controlType = '';

                if( classString.indexOf('word') != -1 )
                {
                    dataSourceName = "data-sourceword";
                    controlType = 'word';
                }

                else if( classString.indexOf('pronunciation') != -1 )
                {
                    dataSourceName = "data-sourcepron";
                    controlType = 'pronunciation';
                }

                else if( classString.indexOf('wordlist') != -1 )
                {
                    dataSourceName = "data-sourcewordlistname";
                    controlType = 'wordlist';
                }

                else if( classString.indexOf('meaning') != -1 )
                {
                    dataSourceName = "data-sourcemeaning";
                    controlType = 'meaning';
                }

                else if( classString.indexOf('exampleEntry') != -1 )
                {
                    dataSourceName = "data-sourceexample";
                    controlType = 'example';
                }

                if( controlType != 'example' )
                {
                    orgVal = $(this).attr(dataSourceName);
                    newVal = $(this).text();
                }
                else
                {
                    var ex = {};

                    ex['meaning'] = $(this).parent().parent().find('span.meaning').first().text();
                    ex['orgVal'] = $(this).attr(dataSourceName);
                    ex['newVal'] = $(this).text();

                    exampleList.push(ex);
                }        

                data[ "word" ] = rowEle.find('span.word').attr('data-sourceword');
                data[ "controlType" ] = controlType;
                data[ "orgVal" ] = orgVal;
                data[ "newVal" ] = newVal;
                data[ "exampleList"] = exampleList;

                modifiedEle.push( data );
            });

            modifiedEleList.push(modifiedEle);
        });

        var sendingData = {
            'modifiedControlsList': JSON.stringify( modifiedEleList ),
            requestType: "updateSelectedWords"
        }

        $.ajax({
            url: '/mods/word/wordControl.php',
            type: 'post',
            dataType: 'json',
            cache: false,
            success: 
                function(response,status){
                    if( status != "success" || response['errState'] != "OK")
                    {
                        $("#msg").html(response['msg']);
                        $("#msg").addClass("Err");
                    }
                    else
                    {
                        document.getElementById("addNewWordTextBox").setSelectionRange(0, $("#addNewWordTextBox").val().length);
                        $(".dynRowWord").remove();
                        
                        $("#msg").removeClass("Err");
                        $("#msg").html(response['msg']);
                        $("#tbWordView").children().append(response['htmlContent']);
                        $("#select_all").prop('checked', false);
                        $("#addNewWordTextBox").focus();  

                        $(".toggleEnabled").bind('mouseenter mouseleave', function (event) { $(this).toggleControl(event); } );
                        $(".btnUpdateWord").bind('click', 
                                                  function (event) { 
                                                                        var rowEle = $(this).parent().parent();
                                                                        var modifiedControls = rowEle.find('.modified');

                                                                        $(this).updateWord( event, modifiedControls );
                                                                    } );
                    }
                },
            data: sendingData
        });
    });

    $('html').click(function(event){
        if( $(event.target).prop('id') != 'updateExampleBtn' &&
            $(event.target).prop('id') != 'addExampleBtn' )
        {
            $('.exampleBtnlDiv').remove();
            $('div.exampleEntry').removeClass('transEffectHover');

            if( event.target.tagName != 'TEXTAREA' )
            {
                $('textarea.exampleEntry').next('br').remove();
                $('textarea.exampleEntry').prev('br').remove();
                $('textarea.exampleEntry').remove();
            }
        }
    });

    $.fn.exampleBtnlDivMouseOut = function(event) {
        $('.exampleBtnlDiv').remove();

        if($('div.exampleEntry').length != 0)
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

        if($(this).is('[data-exId]'))
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

        if($('div.exampleEntry').length > 0)
            $('div.exampleEntry').removeClass('transEffectHover');
    };

    $("#myWordMenuItem").click(function(event) {
        event.preventDefault(); // not show hashtag in url
        history.pushState("", document.title, "/word");

        $.post("/mods/word/word.php",
        {
            menuItem: "myWord",
            userName: $("#userName").text()
        },

        function(response,status){
            if( status != "success" )
            {
                alert("Request failed!");
            }
            else
            {
                document.write(response);
                document.close();
            }
        });
    });
});
$(document).ready(function() {

    $('.toggleEnabled').on( 'mouseenter mouseleave', function( event ) {
        $( this ).toggleControl( event );
    });

    $("#addNewWordBtn").click(function(event) {
        event.preventDefault();

        var sendingData = {
            wordName: $("#addNewWordTextBox").val(),
            wordlistId: $("#wordlistCb").find(":selected").val(),
            pronunciation: $("#pronunciationTextBox").val(),
            wordMeaning: $("#meaningTextArea").val(),
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
        var modifiedControls = rowEle.find('span.modified');

        $(this).updateWord( event, modifiedControls );
    });

    $.fn.updateWord = function(event, modifiedControls)
    {
        event.preventDefault();

        var rowEle = $(this).parent().parent();
        var modifiedEle = [];

        $.each( modifiedControls, function() { 
            var data = {};
            var dataSourceName = '';

            var controlType = $(this).attr('class').replace('modified', '').trim();
            var orgVal = '';
            var newVal = $(this).text();

            switch( controlType )
            {                
                case 'word':
                    dataSourceName = "data-sourceword";
                    break;

                case 'pronunciation':
                    dataSourceName = "data-sourcepron";
                    break;

                case 'wordlist':
                    dataSourceName = "data-sourcewordlistname";
                    break;

                case 'meaning':
                    dataSourceName = "data-sourcemeaning";
                    break;

                default:
                    break;
            }

            orgVal = $(this).attr(dataSourceName);

            data[ "word" ] = rowEle.find('span.word').attr('data-sourceword');
            data[ "controlType" ] = controlType;
            data[ "orgVal" ] = orgVal;
            data[ "newVal" ] = newVal;

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
                                                                        var modifiedControls = rowEle.find('span.modified');

                                                                        $(this).updateWord( event, modifiedControls );
                                                                    } );
                    }
                },
            data: sendingData
        });
    };

    // $("#updateSelectedWordLists").click(function(event) {
    //     event.preventDefault();

    //     var selectedWordlistMap = {};

    //     $("input[name='wordList[]']:checked").each(function() {
    //         var rowEle = $(this).parent().parent();

    //         rowEle.find('.wordlist[data-controltranstype]').each(function(){ 
    //             selectedWordlistMap[ $(this).attr('data-sourcewordlistname') ] = $(this).text(); 
    //         });
    //     });

    //     var sendingData = {
    //         'wordlistMap[]': selectedWordlistMap,
    //         requestType: "updateSelectedWordLists"
    //     }

    //     $.ajax({
    //         url: '/mods/wordlist/wordlistControl.php',
    //         type: 'post',
    //         dataType: 'json',
    //         cache: false,
    //         success: 
    //             function(response,status){
    //                 if( status != "success" || response['errState'] != "OK")
    //                 {
    //                     $("#msg").html(response['msg']);
    //                     $("#msg").addClass("Err");
    //                 }
    //                 else
    //                 {
    //                     document.getElementById("addNewWordlistTextBox").setSelectionRange(0, $("#addNewWordlistTextBox").val().length);
    //                     $(".dynRowWordList").remove();
                        
    //                     $("#msg").removeClass("Err");
    //                     $("#msg").html(response['msg']);
    //                     $("#tbWordlistView").children().append(response['htmlContent']);
    //                     $("#select_all").prop('checked', false);
    //                     $("#addNewWordlistTextBox").focus();  

    //                     $(".toggleEnabled").bind('mouseenter mouseleave', function (event) { $(this).toggleControl(event); } );
    //                     $(".btnUpdateWordlist").bind('click', 
    //                                                   function (event) { 
    //                                                                         var oldWordlist, newWordlist;
    //                                                                         var spanEle, chkBoxEle;
    //                                                                         var rowEle = $(this).parent().parent();

    //                                                                         spanEle = rowEle.find('span.wordlist[data-controltranstype]');

    //                                                                         $.each(spanEle, function(){ 
    //                                                                             oldWordlist = $(this).attr('data-sourcewordlistname');
    //                                                                             newWordlist = $(this).text();
    //                                                                         });

    //                                                                         $(this).updateWordlist(oldWordlist, newWordlist);         
    //                                                                     } ); 
    //                 }
    //             },
    //         data: sendingData
    //     });
    // });

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
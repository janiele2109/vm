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
                                                                        var oldWord, newWord, oldPron, newPron, oldWordlist, newWordlist, oldWordMeaning, newWordMeaning;
                                                                        var spanWordEle, spanPronEle, spanWordlistEle, spanMeaningEle;
                                                                        var rowEle = $(this).parent().parent();

                                                                        spanWordEle = rowEle.find('span.word[data-controltranstype]');
                                                                        spanPronEle = rowEle.find('span.pronunciation[data-controltranstype]');
                                                                        spanWordlistEle = rowEle.find('span.wordlist[data-controltranstype]');
                                                                        spanMeaningEle = rowEle.find('span.meaning[data-controltranstype]');

                                                                        $.each(spanWordEle, function(){ 
                                                                            oldWord = $(this).attr('data-sourceword');
                                                                            newWord = $(this).text();
                                                                        });

                                                                        $.each(spanPronEle, function(){ 
                                                                            oldPron = $(this).attr('data-sourcepron');
                                                                            newPron = $(this).text();
                                                                        });

                                                                        $.each(spanWordlistEle, function(){ 
                                                                            oldWordlist = $(this).attr('data-sourcewordlist');
                                                                            newWordlist = $(this).text();
                                                                        });

                                                                        $.each(spanMeaningEle, function(){ 
                                                                            oldWordMeaning = $(this).attr('data-sourcemeaning');
                                                                            newWordMeaning = $(this).text();
                                                                        });

                                                                        $(this).updateWord(oldWord, newWord, 
                                                                                           oldPron, newPron, 
                                                                                           oldWordlist, newWordlist, 
                                                                                           oldWordMeaning, newWordMeaning);         
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
            var word, pron, wordlistId, meaning;
            var curIndex = selectedWord.length;
            var wordMap = {};    

            rowEle.find('.word[data-controltranstype]').each(function(){ 
                word = $(this).attr('data-sourceword');
            });

            rowEle.find('.pronunciation[data-controltranstype]').each(function(){ 
                pron = $(this).attr('data-sourcepron');
            });

            rowEle.find('.wordlist[data-controltranstype]').each(function(){ 
                wordlistId = $(this).find('option:selected').val();
            });

            rowEle.find('.meaning[data-controltranstype]').each(function(){ 
                meaning = $(this).attr('data-sourcemeaning');
            });

            wordMap[ "word" ] = word;
            wordMap[ "pron" ] = pron;
            wordMap[ "wordlistId" ] = wordlistId;
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

        // $.post("/mods/word/wordControl.php",
        // {
        //     'wordArr[]': selectedWord,
        //     requestType: "delSelectedWords"
        // },

        // function(response,status){
        //     if( status != "success" || response['errState'] != "OK")
        //     {
        //         $("#msg").html(response['msg']);
        //         $("#msg").addClass("Err");
        //     }
        //     else
        //     {
        //         $(".dynRowWord").filter(function() {
        //             return ( $(this).children().children( "input[type=checkbox]:checked" ).length != 0 );
        //         }).remove();

        //         $("#msg").removeClass("Err");
        //         $("#msg").html(response['msg']);
        //         $("#tbWordView").children().append(response['htmlContent']);
        //         $("#select_all").prop('checked', false);
        //         $("#addNewWordTextBox").focus();                
        //     }
        // });
    });

    $('.btnUpdateWord').on( 'click', function( event ) {
        var oldWordlist, newWordlist;
        var spanEle, chkBoxEle;
        var rowEle = $(this).parent().parent();

        spanEle = rowEle.find('span.wordlist[data-controltranstype]');

        $.each(spanEle, function(){ 
            oldWordlist = $(this).attr('data-sourcewordlistname');
            newWordlist = $(this).text();
        });

        $(this).updateWordlist(oldWordlist, newWordlist);
    });

    // $.fn.updateWordlist = function(oldWordlist, newWordlist)
    // {
    //     var spanEle, chkBoxEle;
    //     var rowEle = $(this).parent().parent();

    //     spanEle = rowEle.find('span.wordlist[data-controltranstype]');

    //     $.post("/mods/wordlist/wordlistControl.php",
    //     {
    //         oldVal: oldWordlist,
    //         newVal: newWordlist,
    //         requestType: "updateWordList"
    //     },

    //     function(response,status){
    //         if( status != "success" || response['errState'] != "OK")
    //         {
    //             $("#msg").html(response['msg']);
    //             $("#msg").addClass("Err");
    //         }
    //         else
    //         {
    //             $("#msg").removeClass("Err");
    //             $("#msg").html(response['msg']);
    //             $("#select_all").prop('checked', false);
    //             $("#addNewWordlistTextBox").focus();  

    //             chkBoxEle = rowEle.find('input[type="checkbox"][name="wordList"]');

    //             $.each(spanEle, function(){ 
    //                 $(this).attr('data-sourcewordlistname', newWordlist);
    //                 $(this).css('color', 'black');
    //             });
         
    //             $.each(chkBoxEle, function(){ 
    //                 $(this).attr('checked', false);
    //             });
    //         }
    //     });
    // };

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

    $("#myWordListMenuItem").click(function(event) {
        event.preventDefault(); // not show hashtag in url
        history.pushState("", document.title, "/wordlist");

        $.post("/mods/wordlist/wordlist.php",
        {
            menuItem: "myWordList",
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
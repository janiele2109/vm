$(document).ready(function() {

    $("#addNewWordBtn").click(function(event) {
        event.preventDefault();

        var sendingData = {
            wordName: $("#addNewWordTextBox").val(),
            wordlistId: $("#wordlistCb").find(":selected").val(),
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

                        $("td[name='word']").bind('mouseenter', function (event) { $(this).toggleTextArea(event); } );
                        $("td[name='wordlist']").bind('mouseenter', function (event) { $(this).toggleTextArea(event); } );
                        $("td[name='btnUpdateWord']").bind('click', function (event) { var $btnUpdate = $(this).children(); $btnUpdate.updateWord($btnUpdate.prop('value')); } );
                    }
                },
            data: sendingData
        });       
    });

    // $("#delSelectedWordLists").click(function(event) {
    //     event.preventDefault();
    //     var selectedWordlist = new Array();
    //     $("input[name='wordList[]']:checked").each(function() {
    //         selectedWordlist.push($(this).val());
    //     });

    //     $.post("/mods/wordlist/wordlistControl.php",
    //     {
    //         'wordlistArr[]': selectedWordlist,
    //         requestType: "delSelectedWordLists"
    //     },

    //     function(response,status){
    //         if( status != "success" || response['errState'] != "OK")
    //         {
    //             $("#msg").html(response['msg']);
    //             $("#msg").addClass("Err");
    //         }
    //         else
    //         {
    //             $(".dynRowWordList").filter(function() {
    //                 return ( $(this).children().children( "input[type=checkbox][class=checkbox]:checked" ).length != 0 );
    //             }).remove();

    //             $("#msg").removeClass("Err");
    //             $("#msg").html(response['msg']);
    //             $("#tbWordlistView").children().append(response['htmlContent']);
    //             $("#select_all").prop('checked', false);
    //             $("#addNewWordlistTextBox").focus();                
    //         }
    //     });
    // });

    // $(".updateWordlistBtn").click(function(event) {
    //     $(this).updateWordlist(this.value);
    // });

    // $("#updateSelectedWordLists").click(function(event) {
    //     event.preventDefault();

    //     var selectedWordlist = new Array();
    //     $("input[name='wordList[]']:checked").each(function() {
    //         selectedWordlist.push($(this).val());
    //     });

    //     var sendingData = {
    //         'wordlistArr[]': selectedWordlist,
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

    //                     $("td[name='wordlist']").bind('mouseenter', function (event) { $(this).toggleTextArea(event); } );
    //                     $("td[name='btnUpdateWordlist']").bind('click', function (event) { var $btnUpdate = $(this).children(); $btnUpdate.updateWordlist($btnUpdate.prop('value')); } );
    //                 }
    //             },
    //         data: sendingData
    //     });

    //     // $.post(
    //     //     "/mods/wordlist/wordlistControl.php",
    //     //     {
    //     //         'wordlistArr[]': selectedWordlist,
    //     //         requestType: "updateSelectedWordLists"
    //     //     },

    //     //     function(response,status){
    //     //         if( status != "success" )
    //     //         {
    //     //             alert("Request failed!");
    //     //         }
    //     //         else
    //     //         {
    //     //             document.getElementById("addNewWordlistTextBox").setSelectionRange(0, $("#addNewWordlistTextBox").val().length);
    //     //             $(".dynRowWordList").remove();
    //     //             $("#tbWordlistView").children().append(response['htmlContent']);
    //     //             $("td[name='wordlist']").bind('mouseenter', function (event) { $(this).toggleTextArea(event); } );
    //     //         }
    //     //     }
    //     // );
    // });

    // $.fn.updateWordlist = function(value)
    // {
    //     oldWord = value.substring( value.indexOf(":") + 1, value.lastIndexOf(";") );
    //     newWord = value.substring( value.lastIndexOf(":") + 1, value.length );

    //     $.post("/mods/wordlist/wordlistControl.php",
    //     {
    //         oldVal: oldWord,
    //         newVal: newWord,
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

    //             newId = "-wordlist-wordlistId-" + newWord;

    //             $("#chk-wordlist-wordlistId-" + oldWord).attr('id', 'chk' + newId );
    //             $("#span-wordlist-wordlistId-" + oldWord).attr('id',  'span' + newId );
    //             $("#updateWordlistBtn-wordlist-wordlistId-" + oldWord).attr('id',  'updateWordlistBtn' + newId );

    //             $("#chk-wordlist-wordlistId-" + newWord).attr('checked', false);
    //             $("#span-wordlist-wordlistId-" + newWord).css('color', 'black');
    //         }
    //     });
    // };

    $("td[name='word']").mouseenter(function(event) {
        $(this).toggleTextArea(event);
    });

    $("td[name='word']").blur(function(event) {
        $(this).toggleTextArea(event);
    });

    $("td[name='word']").mouseout(function(event) {
        $(this).toggleTextArea(event);
    });

    $("td[name='word']").keypress(function(event) {
        $(this).toggleTextArea(event);
    });

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
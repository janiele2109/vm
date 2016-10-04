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
                        $("td[name='btnUpdateWord']").bind('click', function (event) { var $btnUpdate = $(this).children(); $btnUpdate.updateWordAndWordlist($btnUpdate.prop('value')); } );
                    }
                },
            data: sendingData
        });       
    });

    $("#delSelectedWords").click(function(event) {
        event.preventDefault();
        
        var selectedWord = new Array();
        $("input[name='word[]']:checked").each(function() {
            selectedWord.push($(this).val());
        });

        $.post("/mods/word/wordControl.php",
        {
            'wordArr[]': selectedWord,
            requestType: "delSelectedWords"
        },

        function(response,status){
            if( status != "success" || response['errState'] != "OK")
            {
                $("#msg").html(response['msg']);
                $("#msg").addClass("Err");
            }
            else
            {
                $(".dynRowWord").filter(function() {
                    return ( $(this).children().children( "input[type=checkbox][class=checkbox]:checked" ).length != 0 );
                }).remove();

                $("#msg").removeClass("Err");
                $("#msg").html(response['msg']);
                $("#tbWordView").children().append(response['htmlContent']);
                $("#select_all").prop('checked', false);
                $("#addNewWordTextBox").focus();                
            }
        });
    });

    $(".updateWordBtn").click(function(event) {
        $(this).updateWordAndWordlist(this.value);
    });

    $("#updateSelectedWordLists").click(function(event) {
        event.preventDefault();

        var selectedWordlist = new Array();
        $("input[name='wordList[]']:checked").each(function() {
            selectedWordlist.push($(this).val());
        });

        var sendingData = {
            'wordlistArr[]': selectedWordlist,
            requestType: "updateSelectedWordLists"
        }

        $.ajax({
            url: '/mods/wordlist/wordlistControl.php',
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
                        document.getElementById("addNewWordlistTextBox").setSelectionRange(0, $("#addNewWordlistTextBox").val().length);
                        $(".dynRowWordList").remove();

                        $("#msg").removeClass("Err");
                        $("#msg").html(response['msg']);
                        $("#tbWordlistView").children().append(response['htmlContent']);
                        $("#select_all").prop('checked', false);
                        $("#addNewWordlistTextBox").focus();  

                        $("td[name='wordlist']").bind('mouseenter', function (event) { $(this).toggleTextArea(event); } );
                        $("td[name='btnUpdateWordlist']").bind('click', function (event) { var $btnUpdate = $(this).children(); $btnUpdate.updateWordlist($btnUpdate.prop('value')); } );
                    }
                },
            data: sendingData
        });

        // $.post(
        //     "/mods/wordlist/wordlistControl.php",
        //     {
        //         'wordlistArr[]': selectedWordlist,
        //         requestType: "updateSelectedWordLists"
        //     },

        //     function(response,status){
        //         if( status != "success" )
        //         {
        //             alert("Request failed!");
        //         }
        //         else
        //         {
        //             document.getElementById("addNewWordlistTextBox").setSelectionRange(0, $("#addNewWordlistTextBox").val().length);
        //             $(".dynRowWordList").remove();
        //             $("#tbWordlistView").children().append(response['htmlContent']);
        //             $("td[name='wordlist']").bind('mouseenter', function (event) { $(this).toggleTextArea(event); } );
        //         }
        //     }
        // );
    });

    $.fn.updateWordAndWordlist = function(value)
    {
        var splittedVal = value.split("-");
        oldWord = splittedVal[1];
        newWord = splittedVal[3];
        oldWordlistId = splittedVal[5];
        newWordlistId = splittedVal[7];

        $.post("/mods/word/wordControl.php",
        {
            oldWordVal: oldWord,
            newWordVal: newWord,
            oldWordlistIdVal: oldWordlistId,
            newWordlistIdVal: newWordlistId,
            requestType: "updateWordAndWordlist"
        },

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

                newId = "-word-wordId-" + newWord;

                $("#chk-word-wordId-" + oldWord).attr('id', 'chk' + newId );
                $("#span-word-wordId-" + oldWord).attr('id',  'span' + newId );
                $("#updateWordBtn-word-wordId-" + oldWord).attr('id',  'updateWordBtn' + newId );

                $("#chk-word-wordId-" + newWord).attr('checked', false);
                $("#span-word-wordId-" + newWord).css('color', 'black');
            }
        });
    };

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
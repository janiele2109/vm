$(document).ready(function() {

    $("#addNewWordlistBtn").click(function(event) {
        event.preventDefault();

        var sendingData = {
            wordlistName: $("#addNewWordlistTextBox").val(),
            requestType: "addWordList"
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

                        $("td[name='wordlist-wordlist']").bind('mouseenter', function (event) { $(this).toggleControl(event, 'TextBox'); } );
                        $("td[name='btnUpdateWordlist']").bind('click', function (event) { var $btnUpdate = $(this).children(); $btnUpdate.updateWordlist($btnUpdate.prop('value')); } );
                    }
                },
            data: sendingData
        });
    });

    $("#delSelectedWordLists").click(function(event) {
        event.preventDefault();

        var selectedWordlist = new Array();
        $("input[name='wordList[]']:checked").each(function() {
            selectedWordlist.push($(this).val());
        });
        console.dir(selectedWordlist);
        $.post("/mods/wordlist/wordlistControl.php",
        {
            'wordlistArr[]': selectedWordlist,
            requestType: "delSelectedWordLists"
        },

        function(response,status){
            if( status != "success" || response['errState'] != "OK")
            {
                $("#msg").html(response['msg']);
                $("#msg").addClass("Err");
            }
            else
            {
                $(".dynRowWordList").filter(function() {
                    return ( $(this).children().children( "input[type=checkbox][class=checkbox]:checked" ).length != 0 );
                }).remove();

                $("#msg").removeClass("Err");
                $("#msg").html(response['msg']);
                $("#tbWordlistView").children().append(response['htmlContent']);
                $("#select_all").prop('checked', false);
                $("#addNewWordlistTextBox").focus();                
            }
        });
    });

    $(".updateWordlistBtn").click(function(event) {
        $(this).updateWordlist(this.value);
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
    });

    $.fn.updateWordlist = function(value)
    {
        var splittedVal = value.split("-");
        oldWord = splittedVal[1];
        newWord = splittedVal[3];

        $.post("/mods/wordlist/wordlistControl.php",
        {
            oldVal: oldWord,
            newVal: newWord,
            requestType: "updateWordList"
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
                $("#addNewWordlistTextBox").focus();  

                newId = "-wordlist-wordlistId-" + newWord;

                $("#chk-wordlist-wordlistId-" + oldWord).attr('id', 'chk' + newId );
                $("#span-wordlist-wordlistId-" + oldWord).attr('id',  'span' + newId );
                $("#updateWordlistBtn-wordlist-wordlistId-" + oldWord).attr('id',  'updateWordlistBtn' + newId );

                $("#chk-wordlist-wordlistId-" + newWord).attr('checked', false);
                $("#span-wordlist-wordlistId-" + newWord).css('color', 'black');
            }
        });
    };

    $("td[name='wordlist-wordlist']").mouseenter(function(event) {
        $(this).toggleControl(event, 'TextBox');
    });

    $("td[name='wordlist-wordlist']").blur(function(event) {
        $(this).toggleControl(event, 'Span');
    });

    $("td[name='wordlist-wordlist']").keypress(function(event) {
        $(this).toggleControl(event, 'Span');
    });

    $( "tbody" ).on( "click", ".updateWordlistBtn", function( event ) {
        $( this ).updateWordlist($( this ).prop('value'));
    });

    // $( "tbody" ).on( "click", ".updateWordlistBtn", function( event ) {
    //     $( this ).updateWordlist($( this ).prop('value'));
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
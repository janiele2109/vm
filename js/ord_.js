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

                        $("td[name='word']").bind('mouseenter', function (event) { $(this).toggleControl(event, controlType); } );
                        $("td[name='btnUpdateWord']").bind('click', function (event) { var $btnUpdate = $(this).children(); $btnUpdate.updateWord($btnUpdate.prop('value')); } );
                    }
                },
            data: sendingData
        });
    });

    $("#delSelectedWord").click(function(event) {
        event.preventDefault();

        var selectedWordlist = new Array();
        $("input[name='wordList[]']:checked").each(function() {
            selectedWordlist.push($(this).val());
        });

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

                $("#tbWordlistView").children().append(response['htmlContent']);
                $("#select_all").prop('checked', false);
                $("#addNewWordlistTextBox").focus();                
            }
        });
    });

    $("#myWordMenuItem").click(function(event) {
        event.preventDefault();
        history.pushState("", document.title, "myword");

        $.post("/mods/word/word.php",
        {
            menuItem: "myWord"
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
$(document).ready(function() {

    $('.toggleEnabled').on( 'mouseenter mouseleave', function( event ) {
        $( this ).toggleControl( event );
    });

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

                        $(".toggleEnabled").bind('mouseenter mouseleave', function (event) { $(this).toggleControl(event); } );
                        $(".btnUpdateWordlist").bind('click', 
                                                      function (event) { 
                                                                            var oldWordlist, newWordlist;
                                                                            var spanEle;
                                                                            var rowEle = $(this).parent().parent();

                                                                            spanEle = rowEle.find('span.wordlist[data-controltranstype]');

                                                                            $.each(spanEle, function(){ 
                                                                                oldWordlist = $(this).attr('data-sourcewordlistname');
                                                                                newWordlist = $(this).text();
                                                                            });

                                                                            $(this).updateWordlist(oldWordlist, newWordlist);         
                                                                        } );
                    }
                },
            data: sendingData
        });
     });

    $("#delSelectedWordLists").click(function(event) {
        event.preventDefault();

        var selectedWordlist = new Array();

        $("input[name='wordList[]']:checked").each(function() {
            var rowEle = $(this).parent().parent();

            rowEle.find('.wordlist[data-controltranstype]').each(function(){ 
                selectedWordlist.push( $(this).attr('data-sourcewordlistname') ); 
            });
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
                    return ( $(this).children().children( "input[type=checkbox]:checked" ).length != 0 );
                }).remove();

                $("#msg").removeClass("Err");
                $("#msg").html(response['msg']);
                $("#tbWordlistView").children().append(response['htmlContent']);
                $("#select_all").prop('checked', false);
                $("#addNewWordlistTextBox").focus();                
            }
        });
    });

    $('.btnUpdateWordlist').on( 'click', function( event ) {
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

    $.fn.updateWordlist = function(oldWordlist, newWordlist)
    {
        var spanEle, chkBoxEle;
        var rowEle = $(this).parent().parent();

        spanEle = rowEle.find('span.wordlist[data-controltranstype]');

        $.post("/mods/wordlist/wordlistControl.php",
        {
            oldVal: oldWordlist,
            newVal: newWordlist,
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

                chkBoxEle = rowEle.find('input[type="checkbox"][name="wordList"]');

                $.each(spanEle, function(){ 
                    $(this).attr('data-sourcewordlistname', newWordlist);
                    $(this).css('color', 'black');
                });
         
                $.each(chkBoxEle, function(){ 
                    $(this).attr('checked', false);
                });
            }
        });
    };

    $("#updateSelectedWordLists").click(function(event) {
        event.preventDefault();

        var selectedWordlistMap = {};

        $("input[name='wordList[]']:checked").each(function() {
            var rowEle = $(this).parent().parent();

            rowEle.find('.wordlist[data-controltranstype]').each(function(){ 
                selectedWordlistMap[ $(this).attr('data-sourcewordlistname') ] = $(this).text(); 
            });
        });

        var sendingData = {
            'wordlistMap[]': selectedWordlistMap,
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

                        $(".toggleEnabled").bind('mouseenter mouseleave', function (event) { $(this).toggleControl(event); } );
                        $(".btnUpdateWordlist").bind('click', 
                                                      function (event) { 
                                                                            var oldWordlist, newWordlist;
                                                                            var spanEle, chkBoxEle;
                                                                            var rowEle = $(this).parent().parent();

                                                                            spanEle = rowEle.find('span.wordlist[data-controltranstype]');

                                                                            $.each(spanEle, function(){ 
                                                                                oldWordlist = $(this).attr('data-sourcewordlistname');
                                                                                newWordlist = $(this).text();
                                                                            });

                                                                            $(this).updateWordlist(oldWordlist, newWordlist);         
                                                                        } ); 
                    }
                },
            data: sendingData
        });
    });

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
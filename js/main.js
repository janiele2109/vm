$(document).ready(function() {

    $("#addNewWordlistBtn").click(function(event) {
        event.preventDefault();

        var sendingData = {
            wordlistName: $("#addNewWordlistTextBox").val(),
            requestType: "addWordList"
        }

        // $('#target').html('sending..');

        $.ajax({
            url: '/mods/wordlist/wordlistControl.php',
            type: 'post',
            dataType: 'json',
            cache: false,
            success: 
                function(response,status){
                    if( status != "success" )
                    {
                        alert("Request failed!");
                    }
                    else
                    {
                        document.getElementById("addNewWordlistTextBox").setSelectionRange(0, $("#addNewWordlistTextBox").val().length);
                        $(".dynRowWordList").remove();
                        $("#tbWordlistView").children().append(response['htmlContent']);
                        $("td[name='wordlist']").bind('mouseenter', function (event) { $(this).toggleTextArea(event); } );
                }
            },
            data: sendingData
        });

        // $.postJSON("/mods/wordlist/wordlistControl.php",
        // {
        //     wordlistName: $("#addNewWordlistTextBox").val(),
        //     requestType: "addWordList"
        // },

        // function(response,status){
        //     if( status != "success" )
        //     {
        //         alert("Request failed!");
        //     }
        //     else
        //     {
        //         document.getElementById("addNewWordlistTextBox").setSelectionRange(0, $("#addNewWordlistTextBox").val().length);
        //         $(".dynRowWordList").remove();
        //         console.dir(response);
        //         // $("#tbWordlistView").children().append(response.htmlContent);
        //         // $("td[name='wordlist']").bind('mouseenter', function (event) { $(this).toggleTextArea(event); } );
        //     }
        // });        
    });

    $("#delSelectedWordLists").click(function(event) {
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
            if( status != "success" )
            {
                alert("Request failed!");
            }
            else
            {
                $(".dynRowWordList").filter(function() {
                    return ( $(this).children().children( "input[type=checkbox][class=checkbox]:checked" ).length != 0 );
                }).remove();

                $("#tbWordlistView").append(response);
                $("#select_all").prop('checked', false);
                $("#addNewWordlistTextBox").focus();                
            }
        });
    });

    $(".UpdateWordlistBtn").click(function(event) {
        $(".UpdateWordlistBtn").updateWordlist(this.value);
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
                    if( status != "success" )
                    {
                        alert("Request failed!");
                    }
                    else
                    {
                        document.getElementById("addNewWordlistTextBox").setSelectionRange(0, $("#addNewWordlistTextBox").val().length);
                        $(".dynRowWordList").remove();
                        $("#tbWordlistView").children().append(response['htmlContent']);
                        $("td[name='wordlist']").bind('mouseenter', function (event) { $(this).toggleTextArea(event); } );
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

    $.fn.updateWordlist = function(value)
    {
        oldWord = value.substring( value.indexOf(":") + 1, value.lastIndexOf(";") );
        newWord = value.substring( value.lastIndexOf(":") + 1, value.length );

        $.post("/mods/wordlist/wordlistControl.php",
        {
            oldVal: oldWord,
            newVal: newWord,
            requestType: "updateWordList"
        },

        function(response,status){
            if( status == "success" )
            {
                $("#" + oldWord).css('color', 'black');
                $("#" + oldWord).attr('id', newWord);
            }
        });
    };

    $('#select_all').change(function(){
        if($(this).prop('checked')){
            $('tbody tr td input[type="checkbox"]').each(function(){
                $(this).prop('checked', true);
            });
        }else{
            $('tbody tr td input[type="checkbox"]').each(function(){
                $(this).prop('checked', false);
            });
        }
    });

    $.fn.toggleTextArea = function(event) {
        var element = event.target;
        if (element.tagName == 'TD' && element.childNodes[0].tagName == "SPAN" && event.type == "mouseenter") 
        {
            var spanTag = element.childNodes[0];
            var inputTag = document.createElement('INPUT');

            inputTag.type = 'text';
            inputTag.value = ""; // spanTag.innerHTML;
            inputTag.id = spanTag.id;
            // inputTag.name = spanTag.getAttribute('name');

            inputTag.style.width = element.offsetWidth - 18 + "px";//"980px";//spanTag.innerHTML.length;
            inputTag.style.color = spanTag.style.color;
            // if( $( tdTag ).attr('class') == 'wordlist' )
            //     inputTag.className = "wordlist";
            // else if( $( tdTag ).attr('class') == 'word' )
            //     inputTag.className = "word";

            inputTag.onblur = $.fn.toggleTextArea;
            inputTag.onkeypress = $.fn.toggleTextArea;
            inputTag.onmouseout = $.fn.toggleTextArea;

            spanTag.parentNode.replaceChild(inputTag, spanTag);

            inputTag.focus(); // $("#" + inputTag.id).focus();
            inputTag.value = spanTag.innerHTML;
            // var tmpStr = $("#" + inputTag.id).val();
            // $("#" + inputTag.id).val("");
            // $("#" + inputTag.id).val(tmpStr);

            // var hideTag = document.createElement('SPAN');

            // hideTag.id = "oldWord";
            // hideTag.innerHTML = spanTag.innerHTML;
            // hideTag.style = "display: none";

            // if( $("#oldWord")[0] == null )
            //     document.body.appendChild(hideTag);
            // else
            //     $("#oldWord")[0].parentNode.replaceChild(hideTag, $("#oldWord")[0]);
        }
        else if (element.tagName == 'INPUT' && ( event.type == "blur" || 
                                               ( event.type == "mouseout" && !( $(element).is(":focus") ) ) || 
                                               ( event.type == "keypress" && event.which == 13) ) ) 
        {
            var inputTag = element;
            var spanTag = document.createElement('SPAN');

            spanTag.id = inputTag.id;
            spanTag.innerHTML = inputTag.value;
            // var id = inputTag.id.replace( "input-", "" );
            // spanTag.setAttribute('name', inputTag.value);

            // if( $( inputTag ).attr('class') == 'wordlist' )
            //     spanTag.className = "wordlist";
            // else if( $( inputTag ).attr('class') == 'word' )
            //     spanTag.className = "word";
            if( inputTag.id != spanTag.innerHTML ) // old id = new id
            {
                spanTag.style = "color: red";
                $("#chk-" + inputTag.id).prop('checked', true);

                var tempStr = ( $("#chk-" + inputTag.id).val() ).substring( 0, ( $("#chk-" + inputTag.id).val() ).lastIndexOf( ":" ) + 1 )
                $("#UpdateWordlistBtn-" + inputTag.id).prop('value', tempStr + inputTag.value);
                $("#chk-" + inputTag.id).prop('value', tempStr + inputTag.value);               
            }

            spanTag.onmouseenter = $.fn.toggleTextArea;

            inputTag.parentNode.replaceChild(spanTag, inputTag);
        }
    };

    $("td[name='wordlist']").mouseenter(function(event) {
        $(this).toggleTextArea(event);
    });

    $("td[name='wordlist']").blur(function(event) {
        $(this).toggleTextArea(event);
    });

    $("td[name='wordlist']").mouseout(function(event) {
        $(this).toggleTextArea(event);
    });

    $("td[name='wordlist']").keypress(function(event) {
        $(this).toggleTextArea(event);
    });

    $( "tbody" ).on( "click", ".UpdateWordlistBtn", function( event ) {
        $( this ).updateWordlist($( this ).prop('value'));
    });

    // $(".word").mouseout(function(event) {
    //     $(".word").toggleTextArea(event);
    // });

    // $(".word").mouseenter(function(event) {
    //     $(".word").toggleTextArea(event);
    // });

    // $(".word").blur(function(event) {
    //     $(".word").toggleTextArea(event);
    // });

    // $(".word").keypress(function(event) {
    //     $(".word").toggleTextArea(event);
    // });


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


    $("#myWordListMenuItem").click(function(event) {
        event.preventDefault(); // not show hashtag in url
        history.pushState("", document.title, "/mywordlist");

        $.post("/mods/wordlist/wordlist.php",
        {
            menuItem: "myWordList"
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


    $("#addNewWordBtn").click(function(event) {
        event.preventDefault();

        $.post("/mods/word/wordControl.php",
        {
            word: $("#addNewWordTextBox").val(),
            wordlistId: $("#wordlistCb").val(),
            requestType: "addWord"
        },

        function(response,status){
            if( status != "success" )
            {
                alert("Request failed!");
            }
            else
            {
                alert(response);
            }
        });
    });

});
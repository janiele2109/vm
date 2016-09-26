$(document).ready(function() {

    $("#addNewWordlistBtn").click(function(event) {
        event.preventDefault();

        $.post("/mods/wordlist/wordlistControl.php",
        {
            wordlistName: $("#addNewWordlistTextBox").val(),
            requestType: "addWordList"
        },

        function(response,status){
            if( status != "success" )
            {
                alert("Request failed!");
            }
            else
            {
                document.getElementById("addNewWordlistTextBox").setSelectionRange(0, $("#addNewWordlistTextBox").val().length);
                $("#wordListView").children("table").children("tbody").html(response);
            }
        });        
    });

    $("#delAllWordlist").click(function(event) {
        event.preventDefault();

        var selectedWordlist = new Array();
        $("input[name='wordList']:checked").each(function(i) {
            selectedWordlist.push($(this).val());
        });

        alert(selectedWordlist);

        $.post("/mods/wordlist/wordlistControl.php",
        {
            'wordlistArr[]': selectedWordlist,
            requestType: "deleteAllWordList"
        },

        function(response,status){
            if( status != "success" )
            {
                alert("Request failed!");
            }
            else
            {
                alert(response);
                $("#wordListView").children("table").children("tbody").html(response);
            }
        });
    });


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

        if (element.tagName == 'TD' && event.type == "mouseenter") {
            // var $focused = $(':focus');

            // if( $focused.attr('class') == 'word')
            element.focus();

            var tdTag = element;
            if( tdTag.childNodes[0].tagName == "SPAN" )
            {
                var spanTag = tdTag.childNodes[0]; 
                var inputTag = document.createElement('INPUT');

                inputTag.id = ("input-" + spanTag.id);
                inputTag.style.width = tdTag.offsetWidth - 18 + "px";//"980px";//spanTag.innerHTML.length;
                inputTag.value = spanTag.innerHTML;

                if( $( tdTag ).attr('class') == 'wordlist' )
                    inputTag.className = "wordlist";
                else if( $( tdTag ).attr('class') == 'word' )
                    inputTag.className = "word";

                inputTag.onblur = $.fn.toggleTextArea;
                inputTag.onkeypress = $.fn.toggleTextArea;
                inputTag.onmouseout = $.fn.toggleTextArea;
                inputTag.style.color = spanTag.style.color;
                inputTag.name = spanTag.getAttribute('name');
                inputTag.type = 'text';

                spanTag.parentNode.replaceChild(inputTag, spanTag);

                $("#" + inputTag.id).focus();

                var tmpStr = $("#" + inputTag.id).val();
                
                $("#" + inputTag.id).val("");
                $("#" + inputTag.id).val(tmpStr);
            }

            // var hideTag = document.createElement('SPAN');

            // hideTag.id = "oldWord";
            // hideTag.innerHTML = spanTag.innerHTML;
            // hideTag.style = "display: none";

            // if( $("#oldWord")[0] == null )
            //     document.body.appendChild(hideTag);
            // else
            //     $("#oldWord")[0].parentNode.replaceChild(hideTag, $("#oldWord")[0]);

        } else if (element.tagName == 'INPUT' && ( event.type == "blur" || 
                                                   ( event.type == "mouseout" && !( $(element).is(":focus") ) ) || 
                                                   ( event.type == "keypress" && event.which == 13) ) ) {
            var inputTag = element;
            var spanTag = document.createElement('SPAN');
            var id = inputTag.id.replace( "input-", "" );

            spanTag.id = id;
            spanTag.innerHTML = inputTag.value;

            if( $( inputTag ).attr('class') == 'wordlist' )
                spanTag.className = "wordlist";
            else if( $( inputTag ).attr('class') == 'word' )
                spanTag.className = "word";
            
            spanTag.onmouseenter = $.fn.toggleTextArea;
            spanTag.setAttribute('name', inputTag.value);

            if( id != spanTag.innerHTML )
            {
                spanTag.style = "color: red";
                $("#chk-" + id).prop('checked', true);

                var oldWordStr = ( $("#chk-" + id).val() ).substring( 0, ( $("#chk-" + id).val() ).lastIndexOf( ":" ) + 1 )

                $("#chk-" + id).prop('value', oldWordStr + inputTag.value);

                $("#UpdateWordlistBtn-" + id).prop('value', oldWordStr + inputTag.value);
            }

            inputTag.parentNode.replaceChild(spanTag, inputTag);
        }
        return this;
    };

    $.fn.updateWordlist = function(id, value)
    {
        spanId = id.substring( id.lastIndexOf("-") + 1, id.length );
        oldWord = value.substring( value.indexOf(":") + 1, value.lastIndexOf(";") );
        newWord = value.substring( value.lastIndexOf(":") + 1, value.length );

        $.post("/mods/wordlist/wordlistControl.php",
        {
            oldVal: oldWord,
            newVal: newWord,
            requestType: "addWordList"
        },

        function(response,status){
            if( status == "success" )
            {
               $("#" + spanId).css('color', 'black');
               $("#" + spanId).attr('id', newWord);
            }
        });
    };

    $(".wordlist").mouseout(function(event) {
        $(".wordlist").toggleTextArea(event);
    });

    $(".wordlist").mouseenter(function(event) {
        $(".wordlist").toggleTextArea(event);
    });

    $(".wordlist").blur(function(event) {
        $(".wordlist").toggleTextArea(event);
    });

    $(".wordlist").keypress(function(event) {
        $(".wordlist").toggleTextArea(event);
    });



    $(".word").mouseout(function(event) {
        $(".word").toggleTextArea(event);
    });

    $(".word").mouseenter(function(event) {
        $(".word").toggleTextArea(event);
    });

    $(".word").blur(function(event) {
        $(".word").toggleTextArea(event);
    });

    $(".word").keypress(function(event) {
        $(".word").toggleTextArea(event);
    });


    $(".UpdateWordlistBtn").click(function(event) {
        $(".UpdateWordlistBtn").updateWordlist(this.id, this.value);

        event.preventDefault();
        return false;
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
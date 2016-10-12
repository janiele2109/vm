$(document).ready(function() {
    var unCheckDataArr = new Array();
    var testData = null;

    function randomNumber(min=0, max=0) { // include min and max
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function genNewWord() {
        var randomNo = randomNumber( 0, unCheckDataArr.length - 1 );
        var index = unCheckDataArr[ randomNo ];        

        $("#meaningSpan").html( testData[ index ]['meaning'] );

        $("#meaningSpan").attr('data-wordId', testData[ index ]['wordId']);
        $("#meaningSpan").attr('data-word', testData[ index ]['word']);
        $("#meaningSpan").attr('data-wordlistName', testData[ index ]['wordlistName']);
        $("#meaningSpan").attr('data-pronunciation', testData[ index ]['pronunciation']);

        unCheckDataArr.splice(randomNo,1);
    }

    $("#testBtn").click(function(event) {
        event.preventDefault();

        var sendingData = {
            requestType: "testDataRequest"
        }

        $.ajax({
            url: '/mods/test/testControl.php',
            type: 'post',
            dataType: 'json',
            cache: false,
            success: 
                function(response,status){
                    if( status != "success" || response['errState'] != "OK")
                    {
                        $('#msg').css('display', 'inline').html("Error getting test data");
                    }
                    else
                    {
                        testData = response['data'];

                        var cnt = 0;

                        $.each( testData, function() {
                            unCheckDataArr[cnt] = cnt++;
                        });

                        if( Object.keys(testData).length > 0 )
                        {
                            $("#testBtn").css('display', 'none');
                            $("#retestBtn").css('display', 'none');
                            $(".testForm").css('display', 'inline');

                            genNewWord();

                            $("#inputWord").focus();
                        }
                        else
                        {
                            $('#msg').css('display', 'inline').html("There is no data for testing");
                            $("#testBtn").css('display', 'none');
                        }
                    }
                },
            data: sendingData
        });
    });

    $("#checkWordBtn").click(function(event) {
        event.preventDefault();

        $('#pronunciationSpan').html($('#meaningSpan').attr('data-pronunciation'));

        $("#resultSpan").css('display', 'block');

        if( $('#displayPron').prop('checked') )
        {
            $("#pronunciationSpan").css('visibility', 'visible');
        }

        if( $('#inputWord').prop('value') == '' )
        {
            $('#resultSpan').html('No word is input!');
            $("#resultSpan").css('color','red');

            $("#inputWord").focus();
        }
        else if( $('#inputWord').prop('value') == $('#meaningSpan').attr('data-word') )
        {            
            $('#resultSpan').html('Correct!');
            $("#resultSpan").css('color','green');

            if( $("#nextWordBtn").css('display') != 'none' )
                $("#nextWordBtn").focus();
            else if( $("#retestBtn").css('display') != 'none' )
                $("#retestBtn").focus();
        }
        else
        {
            $('#resultSpan').html('Wrong!');
            $("#resultSpan").css('color','red');

            $("#showWordBtn").focus();
        }        
    });

    $("#showWordBtn").click(function(event) {
        event.preventDefault();

        $("#resultSpan").css('display', 'block');
        $('#resultSpan').html($('#meaningSpan').attr('data-word'));
        $("#resultSpan").css('color','blue');
    
        if( $('#displayPron').prop('checked') )
        {
            $("#pronunciationSpan").css('visibility', 'visible');
            $('#pronunciationSpan').html($('#meaningSpan').attr('data-pronunciation'));
        }
        
        if( $("#nextWordBtn").css('display') != 'none' )
            $("#nextWordBtn").focus();
        else if( $("#retestBtn").css('display') != 'none' )
            $("#retestBtn").focus();
    });

    $("#nextWordBtn").click(function(event) {
        event.preventDefault();

        $("#resultSpan").css('display', 'none');
        $("#pronunciationSpan").css('visibility', 'hidden');
        $("#inputWord").prop('value', '');
        $("#inputWord").focus();

        genNewWord();

        if( unCheckDataArr.length == 0 )
        {
            $("#retestBtn").css('display', 'inline');
            $("#nextWordBtn").css('display', 'none');
        }
    });

    $("#retestBtn").click(function(event) {
        event.preventDefault();

        $("#retestBtn").css('display', 'none');
        $("#pronunciationSpan").css('visibility', 'hidden');
        $("#nextWordBtn").css('display', 'inline');
        $("#resultSpan").css('display', 'none');
        $("#inputWord").prop('value', '');
        $("#inputWord").focus();

        var cnt = 0;

        $.each( testData, function() {
            unCheckDataArr[cnt] = cnt++;
        });

        genNewWord();
    });

    $("#displayPron").click(function(event) {
        if( $(this).prop('checked') )
            $("#pronunciationSpan").css('visibility', 'visible');
        else
            $("#pronunciationSpan").css('visibility', 'hidden');
    });

    $("#test").click(function(event) {
        event.preventDefault(); // not show hashtag in url
        history.pushState("", document.title, "/test");

        $.post("/mods/test/test.php",
        {
            menuItem: "test",
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
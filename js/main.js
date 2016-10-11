$(document).ready(function() {

    var sendingData = {
        requestType: "getOptionData"
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
                    Object.keys(response['data']).forEach(function (key) {
                        var option = '<option value="' + key + '">' + response['data'][key] + '</option>';
                        $("#hiddenWordlistCb").append(option);
                    });
                }
            },
        data: sendingData
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

    $.fn.toInputTextControl = function() {
        var inputTag = document.createElement('INPUT');

        $.each(this[0].attributes, function(i, attrib){
            $(inputTag).attr(attrib.name, attrib.value);
        });

        inputTag.type = 'text';
        inputTag.value = $(this).text();

        $(inputTag).attr('data-controltranstype', 'span');

        inputTag.style.width = $(this).parent().width() - 6 + "px";
        inputTag.style.color = $(this).css("color");

        $(inputTag).bind('blur', function ( event ) { $(this).toggleControl( event ); } );

        $(inputTag).bind('keypress', function ( event ) { $(this).toggleControl( event ); } );

        $(this).replaceWith(inputTag);

        return inputTag;
    }

    $.fn.toSelectControl = function() {
        var selectTag = document.createElement('SELECT');
        var selectedText = $(this).text();

        $.each(this[0].attributes, function(i, attrib){
            if( attrib.name != 'id' )
                $(selectTag).attr(attrib.name, attrib.value);
        });

        $('#hiddenWordlistCb option').clone().appendTo(selectTag);

        $(selectTag).children().filter(function() { return $(this).text() == selectedText; } ).prop('selected', true);

        $(selectTag).attr('data-controltranstype', 'span');

        $(selectTag).css('display', 'block');

        selectTag.style.width = $(this).parent().width() + "px";

        $(selectTag).find('option').css('color', 'black');
        $(selectTag).find('option:selected').css('color', $(this).css("color"));

        $(selectTag).bind('blur', function ( event ) { $(this).toggleControl( event ); } );

        $(selectTag).bind('keypress', function ( event ) { $(this).toggleControl( event ); } );

        $(this).replaceWith(selectTag);

        return selectTag;
    }

    $.fn.toSpanControl = function() {
        var dataSourceName = "";
        var spanTag = document.createElement('SPAN');
        var chkboxEle = $(this).parent().parent().find('input[type="checkbox"]');

        $.each(this[0].attributes, function(i, attrib){
            $(spanTag).attr(attrib.name, attrib.value);

            if(attrib.name == 'class')
            {
                switch(attrib.value)
                {
                    case 'wordlist':
                        dataSourceName = "data-sourcewordlistname";
                        break;

                    case 'word':
                        dataSourceName = "data-sourceword";
                        break;

                    case 'pronunciation':
                        dataSourceName = "data-sourcepron";
                        break;

                    case 'meaning':
                        dataSourceName = "data-sourcemeaning";
                        break;

                    default:
                        break;
                }
            }
        });

        switch( this.prop('tagName') )
        {
            case 'SELECT':
                $(spanTag).attr('data-controltranstype', 'select');
                spanTag.innerHTML = $(this).find(":selected").text();
                break;

            case 'INPUT':
                $(spanTag).attr('data-controltranstype', 'input-text');
                spanTag.innerHTML = $(this).prop('value');                
                break;

            default:
                break;
        }

        if( $(spanTag).attr(dataSourceName) != spanTag.innerHTML )
        {
            $(spanTag).addClass('modified');
            spanTag.style.color = 'red';
            chkboxEle.first().prop('checked', true);
        }    
        else
        {
            $(spanTag).removeClass('modified');
            spanTag.style.color = 'black';
        }    

        $(this).replaceWith(spanTag);

        return spanTag;
    }

    $.fn.toggleControl = function( event ) {

        switch( this.prop('tagName') )
        {
            case 'TD':

                var childTag = this.children( '[data-controlTransType]' );

                if( childTag.length > 0 )
                {
                    switch( childTag.first().attr( 'data-controlTransType' ) )
                    {
                        case 'input-text':
                            var textbox = childTag.toInputTextControl();
                            $(textbox).focus();

                            var tmpStr = $(textbox).val();
                            $(textbox).val( "" );
                            $(textbox).val( tmpStr );

                            break;

                        case 'select':
                            var select = childTag.toSelectControl();
                            $(select).focus();

                            break;

                        default:
                            break;
                    }
                }

                break;

            case 'INPUT':
            case 'SELECT':

                if( event.type == 'keypress' && event.which != 13 )
                    break;

                this.toSpanControl();
                break;

            default:
                break;
        }
    }
});
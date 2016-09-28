$(document).ready(function() {

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
        var manipulateObj = (window.location.pathname.substr(1));
        var element = event.target;

        if (element.tagName == 'TD' && element.childNodes[0].tagName == "SPAN" && event.type == "mouseenter") 
        {
            var spanTag = element.childNodes[0];
            var inputTag = document.createElement('INPUT');
            var spanId = spanTag.id.substring( spanTag.id.lastIndexOf( "-" ) + 1, spanTag.id.length );

            inputTag.type = 'text';
            inputTag.value = ""; // spanTag.innerHTML;
            inputTag.id = "input-wordlist-wordlistId-" + spanId;
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
            var inputId = inputTag.id.substring( inputTag.id.lastIndexOf( "-" ) + 1, inputTag.id.length );

            spanTag.id = "span-wordlist-wordlistId-" + inputId;
            spanTag.innerHTML = inputTag.value;
            // var id = inputTag.id.replace( "input-", "" );
            // spanTag.setAttribute('name', inputTag.value);

            // if( $( inputTag ).attr('class') == 'wordlist' )
            //     spanTag.className = "wordlist";
            // else if( $( inputTag ).attr('class') == 'word' )
            //     spanTag.className = "word";
            if( inputId != spanTag.innerHTML ) // old id = new id
            {
                var $checkboxObj = $("#chk-" + manipulateObj + "-wordlistId-" + inputId);
                var $btnUpdateWordlistObj = $("#updateWordlistBtn-" + manipulateObj + "-wordlistId-" + inputId);

                spanTag.style = "color: red";
                $checkboxObj.prop('checked', true);

                var tempStr = ( $checkboxObj.val() ).substring( 0, ( $checkboxObj.val() ).lastIndexOf( ":" ) + 1 )
                $btnUpdateWordlistObj.prop('value', tempStr + inputTag.value);
                $checkboxObj.prop('value', tempStr + inputTag.value);               
            }

            spanTag.onmouseenter = $.fn.toggleTextArea;

            inputTag.parentNode.replaceChild(spanTag, inputTag);
        }
    };
});
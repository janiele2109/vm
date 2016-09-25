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
        var element = event.target;

        if (element.tagName == 'SPAN' && event.type == "mouseenter") {
            var spanTag = element; 
            var inputTag = document.createElement('INPUT');

            inputTag.id = ("input-" + spanTag.id);
            inputTag.size = spanTag.innerHTML.length;
            inputTag.value = spanTag.innerHTML;
            inputTag.className = "word";
            inputTag.onblur = $.fn.toggleTextArea;
            inputTag.onkeypress = $.fn.toggleTextArea;
            inputTag.onmouseout = $.fn.toggleTextArea;
            inputTag.style.color = spanTag.style.color;
            inputTag.name = spanTag.getAttribute('name');

            spanTag.parentNode.replaceChild(inputTag, spanTag);

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
            spanTag.className = "word";
            spanTag.onmouseenter = $.fn.toggleTextArea;
            spanTag.setAttribute('name', inputTag.value);

            if( id != spanTag.innerHTML )
                spanTag.style = "color: red";

            inputTag.parentNode.replaceChild(spanTag, inputTag);

            $("#words[" + id + "]").checked = true;
        }
        return this;
    };

    $(".word").hover(function(event) {
        $(".word").toggleTextArea(event);
    });
});
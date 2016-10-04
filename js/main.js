$(document).ready(function() {
    var defCompStyle = {
        'color': 'black',

        'getColor': function() {
            return this.color;
        },

        'setColor': function(clr) {
            this.color = clr;
        }
    };

    function replaceEleInDelimitedStr( orgArr, index, newEle )
    {
        var newStr = "";

        orgArr[ index ] = newEle;

        for( var i = 0; i < orgArr.length; i++ )
            if ( i == 0 )
                newStr += orgArr[i];
            else
                newStr += '-' + orgArr[i];

        return newStr;
    }

    function IdCreation( initVal, elems ){
        var id = initVal;

        for( var i = 1; i < elems.length; i++ )
            id += '-' + elems[i];

        return id;
    }

    function getOriginalId( idString, fieldType = null ){
        var elems = idString.split('-');
        var wordIdIndex = elems.indexOf('wordId');
        var wordlistIdIndex = elems.indexOf('wordlistId');

        if( fieldType == null || ( fieldType != null && fieldType == 'wordlist' ) )
            return elems[wordlistIdIndex + 1];
        else if( fieldType != null && fieldType == 'word' )
        {
            return elems[wordIdIndex + 1];
        }
    }

    $('#select_all').change( function() {
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

    $.fn.span_textbox_trans = function( id, val, style ) {
        var inputTag = document.createElement('INPUT');

        inputTag.type = 'text';
        inputTag.id = id;
        inputTag.value = val;

        inputTag.style.width = $(this).parent().width() - 11 + "px";
        inputTag.style.color = style.getColor();

        $(inputTag).bind('blur', function ( event ) { $(this).toggleControl( event, 'Span' ); } );
        $(inputTag).bind('mouseout', function ( event ) { $(this).toggleControl( event, 'Span' ); } );
        $(inputTag).bind('keypress', function ( event ) { $(this).toggleControl( event, 'Span' ); } );

        $(this).replaceWith(inputTag);

        return inputTag;
    }

    $.fn.to_span_trans = function( id, val, style, fieldTypeStr ) {
        var spanTag = document.createElement('SPAN');

        spanTag.id = id;
        spanTag.innerHTML = val;

        spanTag.style.color = style.getColor();

        $(this).replaceWith(spanTag);

        var $btnUpdate = $('"#' + IdCreation('updateWordlistBtn', id.split( '-' ) ) + '"');
        var valArr = $btnUpdate.attr( 'value' ).split( '-' );

        replaceEleInDelimitedStr( valArr,  );

        return spanTag;
    }

    $.fn.toggleControl = function(event, controlType) {
        var id, val;
        var compStyle = jQuery.extend({}, defCompStyle);
        var curEleTag = event.target;
        var childCompTag, elems;

        if ( ( curEleTag.tagName == 'TD' && event.type == 'mouseenter' ) || 
             ( ( curEleTag.tagName == 'INPUT' ||
                 curEleTag.tagName == 'SELECT' ||
                 curEleTag.tagName == 'TEXTAREA' ) && ( event.type == 'blur' ||
                                                        ( event.type == 'keypress' && event.which == 13 ) ) ) ){
            if( curEleTag.tagName == 'TD' )
            {
                var $focused = $('td input[type=text]:focus');

                if( $focused && $focused.attr('id') )
                {
                    id = IdCreation('span', $focused.attr('id').split('-') );
                    val = $focused.val();

                    if( getOriginalId( $focused.attr('id') ) != val )
                        compStyle.setColor('red');
                    else
                        compStyle.setColor('black');

                    $focused.to_span_trans( id, val, compStyle,  );
                }

                childCompTag = curEleTag.childNodes[0];
                elems = childCompTag.id.split("-");
            }
            else
                elems = curEleTag.id.split("-");
        }
        else
            return;

        switch( controlType )
        {
            case 'TextBox':
                id = IdCreation('textbox', elems);

                val = $(childCompTag).text();

                compStyle.setColor( childCompTag.style.color );

                var textbox = $(childCompTag).span_textbox_trans( id, val, compStyle );
                $(textbox).focus();

                var tmpStr = $(textbox).val();
                $(textbox).val( "" );
                $(textbox).val( tmpStr );
 
                break;

            case 'Combobox':
                span_combobox_trans( id, val, compStyle );
                break;

            case 'RichTextBox':
                span_richtextbox_trans( id, val, compStyle );
                break;

            case 'Span':
                id = IdCreation('span', elems);

                if ( curEleTag.tagName == 'INPUT' )
                    val = $(curEleTag).val();
                else if ( curEleTag.tagName == 'SELECT' )
                    val = $("#" + curEleTag.id + " option:selected").text();

                if( getOriginalId( curEleTag.id ) != val )
                    compStyle.setColor('red');
                else
                    compStyle.setColor('black');

                $(curEleTag).to_span_trans( id, val, compStyle );
                break;

            default:
                break;
        }
    }
});
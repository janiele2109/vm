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

    $.fn.toInputTextControl = function() {
        var inputTag = document.createElement('INPUT');

        $.each(this[0].attributes, function(i, attrib){
            $(inputTag).attr(attrib.name, attrib.value);
        });

        inputTag.type = 'text';
        inputTag.value = $(this).text();

        $(inputTag).attr('data-controltranstype', 'span');

        inputTag.style.width = $(this).parent().width() - 11 + "px";
        inputTag.style.color = $(this).css("color");

        $(inputTag).bind('blur', function ( event ) { $(this).toggleControl( event ); } );

        $(inputTag).bind('keypress', function ( event ) { $(this).toggleControl( event ); } );

        $(this).replaceWith(inputTag);

        return inputTag;
    }

    $.fn.toSpanControl = function() {
        var spanTag = document.createElement('SPAN');
        var chkboxEle = $(this).parent().parent().find('input[name="wordList[]"][type="checkbox"]');

        $.each(this[0].attributes, function(i, attrib){
            $(spanTag).attr(attrib.name, attrib.value);
        });

        spanTag.innerHTML = $(this).prop('value');

        $(spanTag).attr('data-controltranstype', 'input-text');

        if( $(spanTag).attr('data-sourcewordlistname' ) != spanTag.innerHTML )
        {
            spanTag.style.color = 'red';
            chkboxEle.first().prop('checked', true);
        }    
        else
        {
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

    // var defCompStyle = {
    //     'color': 'black',

    //     'getColor': function() {
    //         return this.color;
    //     },

    //     'setColor': function(clr) {
    //         this.color = clr;
    //     }
    // };

    // function IdCreation(initVal, elems){
    //     var id = initVal;

    //     for( var i = 1; i < elems.length; i++ )
    //         id += '-' + elems[i];

    //     return id;
    // }

    // function getOriginalId(idString){
    //     var elems = idString.split('-');
    //     var wordIdIndex = elems.indexOf('wordId');
    //     var wordlistIdIndex = elems.indexOf('wordlistId');

    //     if( wordIdIndex != -1 )
    //     {
    //         return elems[wordIdIndex + 1];
    //     }
    //     else if( wordlistIdIndex != -1 )
    //     {
    //         return elems[wordlistIdIndex + 1];
    //     }
    // }

    // $.fn.to_span_trans = function( id, val, style ) {

    // }




        // var compStyle = jQuery.extend({}, defCompStyle);
        // var id, val;

        // // var curEleTag = event.target;
        // // var childCompTag, elems;

        // alert(this.prop('tagName'));

        // if ( ( curEleTag.tagName == 'TD' && event.type == 'mouseenter' ) || 
        //      ( ( curEleTag.tagName == 'INPUT' ||
        //          curEleTag.tagName == 'SELECT' ||
        //          curEleTag.tagName == 'TEXTAREA' ) && ( event.type == 'blur' ||
        //                                                 ( event.type == 'keypress' && event.which == 13 ) ) ) ){
        //     if( curEleTag.tagName == 'TD' )
        //     {
        //         var $focused = $('td input[type=text]:focus');

        //         if( $focused && $focused.attr('id') )
        //         {
        //             id = IdCreation('span', $focused.attr('id').split('-') );
        //             val = $focused.val();

        //             if( getOriginalId( $focused.attr('id') ) != val )
        //                 compStyle.setColor('red');
        //             else
        //                 compStyle.setColor('black');

        //             $focused.to_span_trans( id, val, compStyle );
        //         }

        //         childCompTag = curEleTag.childNodes[0];
        //         elems = childCompTag.id.split("-");
        //     }
        //     else
        //         elems = curEleTag.id.split("-");
        // }
        // else
        //     return;

        // switch( controlType )
        // {
        //     case 'TextBox':
        //         id = IdCreation('textbox', elems);

        //         val = $(childCompTag).text();

        //         compStyle.setColor( childCompTag.style.color );

        //         var textbox = $(childCompTag).span_textbox_trans( id, val, compStyle );
        //         $(textbox).focus();

        //         var tmpStr = $(textbox).val();
        //         $(textbox).val( "" );
        //         $(textbox).val( tmpStr );
 
        //         break;

        //     case 'Combobox':
        //         span_combobox_trans( id, val, compStyle );
        //         break;
        //     case 'RichTextBox':
        //         span_richtextbox_trans( id, val, compStyle );
        //         break;
        //     case 'Span':
        //         id = IdCreation('span', elems);

        //         if ( curEleTag.tagName == 'INPUT' )
        //             val = $(curEleTag).val();
        //         else if ( curEleTag.tagName == 'SELECT' )
        //             val = $("#" + curEleTag.id + " option:selected").text();

        //         if( getOriginalId( curEleTag.id ) != val )
        //             compStyle.setColor('red');
        //         else
        //             compStyle.setColor('black');

        //         $(curEleTag).to_span_trans( id, val, compStyle );
        //         break;

        //     default:
        //         break;
        // }
    // }
});
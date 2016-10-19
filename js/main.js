
$( document ).ready( function() {

    $('.toggleEnabled').on( 'mouseenter mouseleave', function( event ) {
        $( this ).toggleControl( event );
    });

    $('#selectAllChkbox').change(function(){
        if ($(this).prop('checked')){
            $('tbody tr td input[type="checkbox"]').each(function(){
                $(this).prop('checked', true);
            });
        }else{
            $('tbody tr td input[type="checkbox"]').each(function(){
                $(this).prop('checked', false);
            });
        }
    });

    $.fn.checkServerResponse = function( response, status ) {
        if ( status != "success" || response[ 'errState' ] != 'OK' )
        {
            if ( $("#msgDiv").length > 0 )
            {
                $("#msgDiv").text(response['msg']);
                $("#msgDiv").css('visibility', 'visible');
                $("#msgDiv").addClass("err");
            }

            return false;
        }
        else
            return true;
    }

    $.fn.errRequestServerData = function( xhr, status, error ) {
        if ( $( '#msgDiv' ).length > 0 )
        {
            $("#msgDiv").text( 'Request for data from server failed!' );
            $("#msgDiv").css('visibility', 'visible');
            $("#msgDiv").addClass("err");
        }
    }

    $.fn.resetControlInfo = function( msg ) {
        /* Update message information */
        if ( $( '#msgDiv' ).length > 0 )
        {
            $("#msgDiv").text( msg );
            $("#msgDiv").css('visibility', 'visible');
            $("#msgDiv").removeClass("err");
        }

        /* Reset checkbox 'Select all' */
        $( '#selectAllChkbox' ).prop( 'checked', false );
    }

    $.fn.bindEventsToControls = function() {
        /* Bind events to controls of new wordlist rows */
        if ( $( '.toggleEnabled' ).length > 0 )
            $( '.toggleEnabled' ).bind( 'mouseenter mouseleave',
                                        function( event ) { $( this ).toggleControl( event ); } );

        if ( $( '.updateWordlistNameBtn' ).length > 0 )
            $( '.updateWordlistNameBtn' ).bind( 'click',
                                                function( event) {
                                                                    var oldWordlist, newWordlist;
                                                                    var spanEle;
                                                                    var rowEle = $( this ).parent().parent();

                                                                    spanEle = rowEle.find( 'span.wordlist[data-controltranstype]' );

                                                                    $.each( spanEle, function() { 
                                                                                                    oldWordlist = $( this ).attr( 'data-sourcewordlistname' );
                                                                                                    newWordlist = $( this ).text();
                                                                                                });

                                                                    $( this ).updateWordlistName( oldWordlist, newWordlist );
                                                                } );
    }

    $.fn.err = function( errMsg ) {
        /* Update and show error message */
        if ( $( '#msgDiv' ).length > 0 )
        {
            $("#msgDiv").text( errMsg );
            $("#msgDiv").css('visibility', 'visible');
            $("#msgDiv").addClass("err");
        }
    }

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

    $.fn.toTextAreaControl = function(text) {
        var textarea = document.createElement('TEXTAREA');

        $.each(this[0].attributes, function(i, attrib){
            $(textarea).attr(attrib.name, attrib.value);
        });

        textarea.value = text;

        $(textarea).attr('data-controltranstype', 'span');

        textarea.style.width = $(this).parent().width() - 6 + "px";
        textarea.style.color = $(this).css("color");

        $(textarea).bind('blur', function ( event ) { $(this).toggleControl( event ); } );

        $(textarea).bind('keypress', function ( event ) { $(this).toggleControl( event ); } );

        return textarea;
    }

    $.fn.toSelectControl = function() {
        var selectTag = document.createElement('SELECT');
        var selectedText = $(this).text();

        $.each(this[0].attributes, function(i, attrib){
            if ( attrib.name != 'id' )
                $(selectTag).attr(attrib.name, attrib.value);
        });

        switch( $(selectTag).attr('class').replace('modified', '').trim() )
        {
            case 'wordlist':
                $('#hiddenWordlistCb option').clone().appendTo(selectTag);
                break;

            case 'partOfSpeech':
                $('#wordClassCb option').clone().appendTo(selectTag);
                break;

            default:
                break;
        }

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

            if (attrib.name == 'class')
            {
                if ( attrib.value.indexOf('wordlist') != -1 )
                    dataSourceName = "data-sourcewordlistname";

                else if ( attrib.value.indexOf('word') != -1 )
                    dataSourceName = "data-sourceword";

                else if ( attrib.value.indexOf('partOfSpeech') != -1 )
                    dataSourceName = "data-sourcepos";

                else if ( attrib.value.indexOf('pronunciation') != -1 )
                    dataSourceName = "data-sourcepron";

                else if ( attrib.value.indexOf('meaning') != -1 )
                    dataSourceName = "data-sourcemeaning";

                else if ( attrib.value.indexOf('exampleEntry') != -1 )
                    dataSourceName = "data-sourceexample";
            }
        });

        switch( this.prop('tagName') )
        {
            case 'SELECT':
                $(spanTag).attr('data-controltranstype', 'select');
                spanTag.innerHTML = $(this).find(":selected").text().trim();
                break;

            case 'INPUT':
                $(spanTag).attr('data-controltranstype', 'input-text');
                spanTag.innerHTML = $(this).prop('value').trim();                
                break;

            case 'TEXTAREA':
                if ( $(this).attr('class').indexOf('example') == -1 )
                    $(spanTag).attr('data-controltranstype', 'textarea');
                else
                    $(spanTag).attr('data-controltranstype', 'button');

                spanTag.innerHTML = $(this).prop('value').trim();                
                break;

            default:
                break;
        }

        if ( $(spanTag).attr(dataSourceName).trim() != spanTag.innerHTML.trim() )
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

    $.fn.toDivControl = function() {
        var divTag = document.createElement('DIV');
        var chkboxEle = $(this).parent().parent().find('input[type="checkbox"]');
        var dataSourceName = '';

        $.each(this[0].attributes, function(i, attrib){
            $(divTag).attr(attrib.name, attrib.value);

            if (attrib.name == 'class')
            {
                if ( attrib.value.indexOf('wordlist') != -1 )
                    dataSourceName = "data-sourcewordlistname";

                else if ( attrib.value.indexOf('word') != -1 )
                    dataSourceName = "data-sourceword";

                else if ( attrib.value.indexOf('partOfSpeech') != -1 )
                    dataSourceName = "data-sourcepos";

                else if ( attrib.value.indexOf('pronunciation') != -1 )
                    dataSourceName = "data-sourcepron";

                else if ( attrib.value.indexOf('meaning') != -1 )
                    dataSourceName = "data-sourcemeaning";

                else if ( attrib.value.indexOf('exampleEntry') != -1 )
                    dataSourceName = "data-sourceexample";
            }
        });

        $(divTag).text($(this).prop('value'));

        $(divTag).attr('data-controltranstype', 'button');

        if ( $(this).prop('value') == '' )
        {
            $(divTag).css('display', 'none');
            $(this).next('br').remove();
        }    

        divTag.style.width = $(this).parent().width() - 6 + "px";

        if ( $(divTag).attr(dataSourceName) != $(divTag).text() )
        {
            $(divTag).addClass('modified');
            divTag.style.color = 'red';
            chkboxEle.first().prop('checked', true);
        }    
        else
        {
            $(divTag).removeClass('modified');
            divTag.style.color = 'black';
        }   

        $(divTag).bind('mouseenter', function ( event ) { 
                                                            if ( $('textarea.exampleEntry').length == 0 )
                                                            {
                                                                $(this).createExampleControlsDiv();
                                                                $('.exampleBtnlDiv').fadeIn().find('#updateExampleBtn').focus();
                                                                $(this).addClass('transEffectHover');
                                                            }
                                                        } );

        $(this).replaceWith(divTag);

        return divTag;
    }

    $.fn.toButtonControl = function(buttonId, buttonLabel) {
        var buttonTag = document.createElement('BUTTON');

        $.each(this[0].attributes, function(i, attrib){
            $(buttonTag).attr(attrib.name, attrib.value);
        });

        $(buttonTag).prop('id', buttonId);
        $(buttonTag).html(buttonLabel);

        $(buttonTag).removeAttr('style');
        $(buttonTag).removeClass('transEffect');
        $(buttonTag).attr('data-controltranstype', 'textarea');

        $(buttonTag).addClass('exampleBtn');

        $(buttonTag).bind('click', function ( event ) { 
                                                        if ( buttonId == 'updateExampleBtn' )
                                                            $(this).updateExampleBtnClick(event);

                                                        else if ( buttonId == 'addExampleBtn' )
                                                            $(this).addExampleBtnClick(event);
                                                      });

        return buttonTag;
    }

    $.fn.createExampleControlsDiv = function() {
        var divTag = document.createElement('DIV');
        var updateButton = $(this).toButtonControl('updateExampleBtn', 'Update');
        var addButton = $(this).toButtonControl('addExampleBtn', 'Add');
        var thisPos = $(this).position();
        var topPosBtn, leftPosBtn;

        if ($(this).prop("tagName") != 'TD')
            divTag.append(updateButton);
        
        divTag.append(addButton);

        $(divTag).addClass('exampleBtnlDiv');

        $(divTag).css('top', thisPos.top + 'px' );
        $(divTag).css('left', thisPos.left + 'px' );
        $(divTag).css('display', 'none' );

        if ($(this).prop("tagName") == 'TD')
        {
            $(divTag).css('width', $(this).width() + $(this).css('padding-right').replace('px', '') * 2 + 'px' );
            $(divTag).css('height', $(this).height() + $(this).css('padding-bottom').replace('px', '') * 2 + 'px' );
        }
        else
        {
            $(divTag).css('width', $(this).parent().width() );
            $(divTag).css('height', $(this).height() );
        }

        topPosBtn = $(divTag).css('height').replace('px', '') / 2 - $(updateButton).css('height').replace('px', '') / 2;
        leftPosBtn = $(divTag).css('width').replace('px', '') / 2 - $(updateButton).css('width').replace('px', '') - 10;

        $(updateButton).css('top', topPosBtn + 'px' );
        $(updateButton).css('left', leftPosBtn + 'px' );
        $(updateButton).css('margin-right', '5px' );

        $(addButton).css('top', topPosBtn + 'px' );

        if ($(this).prop("tagName") == 'TD')
            $(addButton).css('left', $(divTag).css('width').replace('px', '') / 2 - $(addButton).css('width').replace('px', '') / 2 + 10 );
        else
            $(addButton).css('left', $(updateButton).css('width').replace('px', '') + 'px' );

        $(divTag).bind('mouseleave', function (event){ $(this).exampleBtnlDivMouseOut(); });

        if ($(this).prop("tagName") == 'TD')
            $(this).append(divTag);
        else
            $(this).parent().append(divTag);
    }

    $.fn.toggleControl = function( event ) {

        switch( this.prop('tagName') )
        {
            case 'TD':

                var childTag = this.children( '[data-controlTransType]' );

                if ( childTag.length > 0 )
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

                        case 'textarea':
                            var textarea = childTag.toTextAreaControl($(this).text());
                            $(childTag).replaceWith(textarea);
                            $(textarea).focus();

                            break;

                        default:
                            break;
                    }
                }

                break;

            case 'INPUT':
            case 'SELECT':
            case 'TEXTAREA':
            case 'BUTTON':

                if ( event.type == 'keypress' && event.which != 13 )
                    break;

                if ( $(this).prop('value') != '' && $(this).attr('class').indexOf('exampleBtn') != -1 )
                {
                    var divTag = $(this).toDivControl();
                    $(divTag).removeClass('exampleBtn');
                    $(divTag).next('br').remove();

                    if ($(this).attr('class').indexOf('exampleTd') != -1)
                    {
                        $(divTag).removeClass('exampleTd');
                        $(divTag).addClass('exampleEntry transEffect');
                    }
                }
                else
                    this.toSpanControl();

                break;

            default:
                break;
        }
    }
});


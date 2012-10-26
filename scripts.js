/*
 * JavaScript code for early version of this website
 */

(function($) {

var effects = (!$.browser.msie || $.browser.version.substr(0, 1) >= 9);

$(window).load(function() {
    init_tabs();
    init_slider();
    show_content();
}); 


function init_slider() {
    if ($.browser.msie && $.browser.version.substr(0, 1) <= 8) {
        $('img[data-src]').each(function() {
            $(this).attr('src', $(this).data('src'));
        });
    };

    $('#portfolio .item img').each(function() {
        var me = $(this);
        var item = me.parent();
        var name = item.attr('data-name');
        var tags = item.attr('data-tags');
        var title = name + ' (' + tags + ')';

        me = me.css('background', 'none').clone().attr('title', title);
        span = $('<span />').append(me).append($('<span />').text(title));;

        span.appendTo('#slider');
    });

    $('#slider').coinslider({
        width: 402,
        height: 402,
        sDelay: 50,
        links: false,
        navigation: false,
        spw: effects ? 6 : 1,
        sph: effects ? 4 : 1
    });

    $('#portfolio .item').click(function() {
        var slider = $('#slider')[0];
        var x = $(this).prevAll('.item').find('img').length;
        $.transition(slider, x);
        $.transitionCall(slider);
        var offset = $('#slider').offset().top - 50;
        var scroll = $(window).scrollTop();
        if (scroll > offset) $(window).scrollTop(offset);
    });

    if (!effects)
        return;

    $('#portfolio .item')
        .each(function() {
            var c = parseInt($(this).attr('data-c'));
            var r = parseInt($(this).attr('data-r'));
            var sel = 
                '[data-c=' + (c-1) + '][data-r=' + (r-1) + '],'  +
                '[data-c=' + (c-1) + '][data-r=' + (r)   + '],'  +
                '[data-c=' + (c-1) + '][data-r=' + (r+1) + '],'  +
                '[data-c=' + (c)   + '][data-r=' + (r-1) + '],'  +
                '[data-c=' + (c)   + '][data-r=' + (r+1) + '],'  +
                '[data-c=' + (c+1) + '][data-r=' + (r-1) + '],'  +
                '[data-c=' + (c+1) + '][data-r=' + (r)   + '],'  +
                '[data-c=' + (c+1) + '][data-r=' + (r+1) + '],';
            $.data(this, 'nbh', $(sel));
        })
        .hover(
            function() {
                $.data(this, 'nbh').animate({opacity: 0.3}, {queue:false, duration: 300});
            },
            function() {
                $.data(this, 'nbh').animate({opacity: 1}, {queue:false, duration: 300});
            }
        );
}

function init_tabs() {
    $('#tabs a').click(function(ev) {
        ev.preventDefault();

        var tab = $(this); //.parent('span');

        if (tab.is('.active'))
            return;

        var new_card = $($(this).attr('href'));
        var new_height = new_card.outerHeight();

        var act_card = $($('#tabs .active').attr('href'));
        var act_height = act_card.outerHeight();

        var fade_sp = 1000;

        var main = $('#main');

        if (act_card.is('#portfolio')) {
            $.pauseCoin = true;
        }

        var cb = function() {
            main.height(new_height);
            if (new_card.is('#portfolio')) {
                $.pauseCoin = false;
            }
            else if (new_card.is('#samples'))
                $('#samples #scrollbar').data('scrollbar').update();
        }

        if (effects) {
            main.height(new_height > act_height ? new_height : act_height);
            new_card.fadeIn(fade_sp, cb).siblings('.card').fadeOut(fade_sp);
        } else {
            new_card.show().siblings('.card').hide();
            cb();
        }

        tab.addClass('active').siblings().removeClass('active');

        return false;
    });
}

function init_samples() {
    var scrollbar = false;

    for(var key in samples) {
        var code = samples[key];
        $('<pre>' + code + '</pre>')
            .hide()
            .attr('id', 'sample-' + key)
            //.text(code.replace(/\n/g, '\r\n'))
            .appendTo($('#samples .overview'));
    }


    $('#samples .buttons a').click(function(ev) {
        ev.preventDefault();
        var me = $(this);
        var href = $(this).attr('href');
        var elem = $(href);
        elem.siblings('pre').hide();
        elem.show();
        me.addClass('active').siblings('a').removeClass('active');
        if (scrollbar)
            scrollbar.update();
    });

    $('#samples .buttons a').eq(0).click();

    scrollbar = $('#scrollbar');
    scrollbar.tinyscrollbar();
    scrollbar.data('scrollbar', scrollbar);
}

function show_content() {
    if (effects) {
        setTimeout(function() {
            $('#wrap').fadeIn(2000);
        }, 300);
    } else {
        $('#wrap').show();
    }

    setTimeout(init_samples, 1000);
}

})(jQuery);

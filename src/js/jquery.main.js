(function ($) {
    $(function () {
        $('#rating').barrating({
            theme: 'css-stars',
            showSelectedRating: false
        });

        $('.product__share-link').on('click', function (e) {
            e.preventDefault();
            $(this).closest('.product__share').find('.product__share-list').fadeToggle();

        });

        $('.product__share-close').on('click', function (e) {
            e.preventDefault();
            $(this).closest('.product__share').find('.product__share-list').fadeOut();
            console.log("ddd");
        });

        // slider
        var $slick_slider = $('.similar-product__row');
        
        var settings_slider = {
            dots: false,
            arrows: true
            // more settings
        };
        
        slick_on_mobile($slick_slider, settings_slider);

        // slick on mobile
        function slick_on_mobile(slider, settings) {
            $(window).on('load resize', function () {
                if ($(window).width() > 767) {
                    if (slider.hasClass('slick-initialized')) {
                        slider.slick('unslick');
                    }
                    return
                }
                if (!slider.hasClass('slick-initialized')) {
                    return slider.slick(settings);
                }
            });
        }
    });
})(jQuery);
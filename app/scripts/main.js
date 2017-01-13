$(document).ready(function(){
    $(function() {
    var $window = $('.mdl-layout__content'),
        win_height_padded = $window.height(),
        isTouch = Modernizr.touch;
    if (isTouch) {
        $('.revealOnScroll').addClass('animated');
    }
    $window.on('scroll', function(){
        console.log('Test');
    });

    function revealOnScroll() {
        console.log('scroll');
        var scrolled = $window.scrollTop(),
            win_height_padded = $window.height();
        // Showed...
        $(".revealOnScroll:not(.animated)").each(function() {
            var $this = $(this),
                offsetTop = $this.offset().top;
            if (scrolled + win_height_padded > offsetTop) {
                if ($this.data('timeout')) {
                    window.setTimeout(function() {
                        $this.addClass('animated ' + $this.data('animation'));
                    }, parseInt($this.data('timeout'), 10));
                } else {
                    $this.addClass('animated ' + $this.data('animation'));
                }
            }
        });
        // Hidden...
        $(".revealOnScroll.animated").each(function(index) {
            var $this = $(this),
                offsetTop = $this.offset().top;
            if (scrolled + win_height_padded < offsetTop) {
                $(this).removeClass('animated fadeInUp flipInX lightSpeedIn')
            }
        });
    }
    revealOnScroll();
});
})

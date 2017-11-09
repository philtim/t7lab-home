$(document).ready(function () {
  'use strict';

  $(function () {
    const words = ['design', 'develop', 'consult on'];
    $('#wordChanger').addClass('hidden').fadeOut(800, function () {
      $(this).html(words[getRandomInt(0, words.length)]).removeClass('hidden').fadeIn(800);
    })
  });

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  $(document).on('scroll', onScroll);

  $(function () {
    var target = window.location.hash;
    if (target === '' || target === 'undefined') return;
    $('.lab-navigation a[href^="'+target+'"]').trigger('click');
  });

  $('.lab-navigation a[href^="#"]').on('click', function (e) {
      e.preventDefault();
      $(document).off('scroll');

      $('.lab-navigation a').each(function () {
          $(this).removeClass('active');
      });

      $(this).addClass('active');

      var target = this.hash;
      var $target = $(target);

      $('html, body').stop().animate({
          'scrollTop': $target.offset().top - 150
      }, 500, 'swing', function () {
          history.replaceState(null, null, target);
          $(document).on('scroll', onScroll);
      });
  });

  function onScroll(event) {
      var scrollPos = $(document).scrollTop();
      $('.lab-navigation a').each(function () {
          var currLink = $(this);
          var refElement = $(currLink).attr('href');
          var $target = $(refElement);
          if ($target.position().top <= scrollPos && $target.position().top  + 150 + $target.height() > scrollPos) {
              $('.lab-navigation a').removeClass('active');
              currLink.addClass('active');
          }
          else {
              currLink.removeClass('active');
          }
      });
  }



});

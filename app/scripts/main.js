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


  $(function() {
    // Get the form.
    let form = $('#contact-form');

    // Get the messages div.
    let formMessages = $('#form-messages');

    $(form).submit(function(event) {
      // Stop the browser from submitting the form.
      event.preventDefault();

      let formData = $(form).serialize();

      $.ajax({
        type: 'POST',
        url: $(form).attr('action'),
        data: formData
      }).done(function (response) {
        // Set the message text.
        $(formMessages).text(response).removeClass('error').addClass('success');
        $(form).addClass('hidden');

        // Clear the form.
        $('#Name').val('');
        $('#Email').val('');
        $('#note').val('');
      }).fail(function (data) {
        $(formMessages).text(data.responseText).addClass('error');
      })
    });
  });

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
          'scrollTop': $target.offset().top - 100
      }, 500, 'swing', function () {
          window.location.hash = target;
          $(document).on('scroll', onScroll);
      });
  });

  function onScroll(event) {
      var scrollPos = $(document).scrollTop();
      $('.lab-navigation a').each(function () {
          var currLink = $(this);
          var refElement = $(currLink).attr('href');
          var $target = $(refElement);
          if ($target.position().top <= scrollPos && $target.position().top + 100 + $target.height() > scrollPos) {
              $('.lab-navigation a').removeClass('active');
              currLink.addClass('active');
          }
          else {
              currLink.removeClass('active');
          }
      });
  }



});

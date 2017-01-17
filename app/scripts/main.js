$(document).ready(function () {
  'use strict';

  $(function () {
    const words = ['design', 'skillfully craft', 'beautify', 'prototype'];
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
        $(formMessages).text(response);
        $(form).addClass('hidden');

        // Clear the form.
        $('#Name').val('');
        $('#Email').val('');
        $('#note').val('');
      }).fail(function (data) {
        $(formMessages).text(data);
      })
    });
  });

});

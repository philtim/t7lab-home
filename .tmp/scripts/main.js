'use strict';

$(document).ready(function () {
  $(function () {
    var mainContainer = $('#mainContainer');

    mainContainer.on('scroll', function () {
      revealOnScroll();
    });

    function revealOnScroll() {
      console.log('revealOnScroll');
    }
  });

  $(function () {
    var words = ['build', 'design', 'craft', 'consult on', 'beautify', 'prototype'];
    $('#wordChanger').addClass('hidden').fadeOut(800, function () {
      $(this).html(words[getRandomInt(0, words.length)]).removeClass('hidden').fadeIn(800);
    });
  });

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
});
//# sourceMappingURL=main.js.map

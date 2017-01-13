$(document).ready(function () {
  $(function () {
    let mainContainer = $('#mainContainer');

    mainContainer.on('scroll', function () {
      revealOnScroll();
    });

    function revealOnScroll() {
      console.log('revealOnScroll');
    }


  });


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


});

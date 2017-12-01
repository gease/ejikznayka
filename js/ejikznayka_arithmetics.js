(function ($, Drupal) {
  window.onload = function () {
    var cur, res = i = 0, min, max, range;
    var settings = drupalSettings.ejikznayka.arithmetics;
    if (settings.digits) {
      min = 1;
      max = Math.pow(10, settings.digits) - 1;
      range = max - min;
    }
    else {
      min = +settings.range.min;
      max = +settings.range.max;
      range = max - min;
    }


    ejikznayka_page.addEventListener("click", function () {
      document.getElementsByClassName('overlay')[0].style.display = "flex";
    }, false);

    ejikznayka_close.addEventListener("click", function () {
      document.getElementsByClassName('overlay')[0].style.display = "none";
    });

    start.addEventListener("click", function () {
      ejikznayka_controls.style.visibility = 'hidden';
      // Restore all controls.
      $('#ejikznayka_controls').children().css('display', 'block');
      $('#ejikznayka_display').children().css('display', 'none');
      $('#your_answer').removeClass();
      ejikznayka_close.style.display = 'none';
      i = res = cur = 0;
      correct_answer_placeholder.innerHTML = '';
      correct_answer.style.display = 'none';
      input_answer.value = '';
      show.style.display = 'block';
      changeNumber();
    }, false);

    show_answer.addEventListener("click", function () {
      correct_answer_placeholder.innerHTML = res;
      correct_answer.style.display = 'block';
      check_answer_message.style.display = "none";
      check_answer.style.display = 'none';
      input_answer.style.display = 'none';
      show_answer.style.display = 'none';
      mark.style.display = 'block';
      if (input_answer.value == res) {
        $('#your_answer').addClass('correct');
        mark_placeholder.innerHTML = settings.mark;
      }
      else {
        $('#your_answer').addClass('incorrect');
        mark_placeholder.innerHTML = 0;
      }
    }, false);

    check_answer.addEventListener("click", function () {
      check_answer_message.style.display = 'block';
      correct_answer.style.display = 'none';
      mark.style.display = 'block';
      if (input_answer.value == res) {
        check_answer_message.querySelector('.incorrect').style.display = 'none';
        check_answer_message.querySelector('.correct').style.display = 'block';
        mark_placeholder.innerHTML = settings.mark;
      }
      else {
        check_answer_message.querySelector('.correct').style.display = 'none';
        check_answer_message.querySelector('.incorrect').style.display = 'block';
        mark_placeholder.innerHTML = 0;
      }
    }, false);

    input_answer.addEventListener("blur", function () {
      your_answer_placeholder.innerHTML = this.value;
      your_answer.style.display = 'block';
    });

    function changeNumber() {
      if (settings.minus == false || (Math.random() > 0.5 || res <= min)) {
        cur = min + Math.floor(Math.random() * (range + 1));
        res += cur;
        if (i > 0) {
          cur = "+" + cur;
        }
      }
      else {
        cur = min + Math.floor(Math.random() * (Math.min(max, res) - min + 1));
        res -= cur;
        cur = "-" + cur;
      }
      show.innerHTML = cur;
      show.classList.add('new');
      show.classList.remove('old');
      if (settings.random_location) {
        show.style.position = 'absolute';
        var top, left;
        top = Math.random() * 50;
        left = Math.random() * 50;
        if (Math.random() > 0.5) {
          show.style.removeProperty('bottom');
          show.style.top = top + '%';
        }
        else {
          show.style.removeProperty('top');
          show.style.bottom = top + '%';
        }
        if (Math.random() > 0.5) {
          show.style.removeProperty('right');
          show.style.left = left + '%';
        }
        else {
          show.style.removeProperty('left');
          show.style.right = left + '%';
        }

      }
      setTimeout(function () {
        show.classList.remove('new');
      }, settings.interval * 500);
      setTimeout(function () {
        show.classList.add('old');
      }, settings.interval * 1000 - 100);
      if (++i < settings.count) {
        setTimeout(changeNumber, settings.interval * 1000);
      }
      else {
        setTimeout(function () {
          show.innerHTML = '';
          showResult();
        }, settings.interval * 1000);
      }
    }

    function showResult() {
      ejikznayka_display.style.display = 'flex';
      start.style.display = 'block';
      ejikznayka_close.style.display = 'block';
      ejikznayka_controls.style.visibility = 'visible';
    }
  };
})(jQuery, Drupal);
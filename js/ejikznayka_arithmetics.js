var ejikznayka = {
  res: 0,
  min: 0,
  max: 0,
  range: 0,
  count: 0,
  settings: {},
  seq: [],
  decoratedSeq: [],
  positions: [],

  reset: function() {
     this.res = this.count = 0;
     this.setup();
  },

  setup: function(settings = {}) {

    if (jQuery.isEmptyObject(settings) && jQuery.isEmptyObject(this.settings)) {
      throw 'No settings to setup ejikznayka.'
    }
    if (!jQuery.isEmptyObject(settings)) {
      this.settings = jQuery.extend(true, {}, settings);
    }

    jQuery('#show, #your_answer_placeholder, #correct_answer_placeholder').css('font-size', this.settings.font_size + 'px');
    jQuery('#ejikznayka_display').css('font-size', (3 * this.settings.font_size / 4) + 'px');
    // Setup value ranges.
    if (this.settings.digits) {
      this.min = 1;
      this.max = Math.pow(10, this.settings.digits) - 1;
      this.range = this.max - this.min;
    }
    else {
      // We need to typecast string to int.
      this.min = +this.settings.range.min;
      this.max = +this.settings.range.max;
      this.range = this.max - this.min;
    }
    // Generate sequence of numbers.
    for (var i = 0; i < this.settings.count; i++) {
      if (this.settings.minus == false || (Math.random() > 0.5 || this.res <= this.min)) {
        this.seq[i] = this.min + Math.floor(Math.random() * (this.range + 1));
      }
      else {
        this.seq[i] = -(this.min + Math.floor(Math.random() * (Math.min(this.max, this.res) - this.min + 1)));
      }
      this.res += this.seq[i];
      this.decoratedSeq[i] = this.decorate(this.seq[i], i === 0);
    }

    if (this.settings.random_location) {
      var position = {}, top, left;
      for (var i = 0; i < this.settings.count; i++) {
        top = Math.random() * 50;
        left = Math.random() * 50;
        if (Math.random() > 0.5) {
          position.bottom = '';
          position.top = top + '%';
        }
        else {
          position.top = '';
          position.bottom = top + '%';
        }
        if (Math.random() > 0.5) {
          position.right = '';
          position.left = left + '%';
        }
        else {
          position.left = '';
          position.right = left + '%';
        }
        this.positions[i] = Object.assign({}, position);
      }
    }
  },

  decorate: function(i, skip = false) {
    // We assume that i may be a string.
    if (isNaN(+i)) {
      return ''
    }
    else {
      if (+i < 0 || skip) {
        return i + '';
      }
      else {
        return '+' + i;
      }
    }
  }

};

(function ($, Drupal) {
  window.onload = function () {
    ejikznayka.setup(drupalSettings.ejikznayka.arithmetics);

    // Turning page on and off.
    ejikznayka_page.addEventListener("click", function () {
      $('.overlay').css('display', 'flex');
      ejikznayka.reset();
    });

    ejikznayka_close.addEventListener("click", function () {
      $('.overlay').css('display', 'none');
    });

    // Controls for the actions.
    start.addEventListener("click", function () {
      ejikznayka.reset();
      correct_answer_placeholder.innerHTML = '';
      //correct_answer.style.display = 'none';
      input_answer.value = '';
      $('#ejikznayka_display').children().hide();
      show.style.display = 'block';
      if (ejikznayka.settings.column == 'single') {
        hideControls();
        changeNumber();
      }
      if (ejikznayka.settings.column == 'column') {
        showColumn();
        showResult();
      }
    }, false);

    show_answer.addEventListener("click", function () {
      correct_answer_placeholder.innerHTML = ejikznayka.res;
      correct_answer.style.display = 'block';
      $('#ejikznayka_controls').children(':not(#start)').hide();
      show.innerHTML = '';
      checkAnswer();
    }, false);

    check_answer.addEventListener("click", function () {
      check_answer_message.style.display = 'block';
      correct_answer.style.display = 'none';
      show.innerHTML = '';
      checkAnswer();
    }, false);

    input_answer.addEventListener("blur", function () {
      your_answer_placeholder.innerHTML = this.value;
      your_answer.style.display = 'block';
    });
  };

  function changeNumber() {
    show.innerHTML = ejikznayka.decoratedSeq[ejikznayka.count];
    show.classList.add('new');
    show.classList.remove('old');
    if (ejikznayka.settings.random_location) {
      $('#show').css('position', 'absolute').css(ejikznayka.positions[ejikznayka.count]);
    }

    setTimeout(function () {
      show.classList.remove('new');
    }, ejikznayka.settings.interval * 500);
    setTimeout(function () {
      show.classList.add('old');
    }, ejikznayka.settings.interval * 1000 - 100);

    if (++ejikznayka.count < ejikznayka.settings.count) {
      setTimeout(changeNumber, ejikznayka.settings.interval * 1000);
    }
    else {
      setTimeout(function () {
        show.innerHTML = '';
        showResult();
      }, ejikznayka.settings.interval * 1000);
    }
  }

  function showColumn() {
    for (var i = 0; i < ejikznayka.settings.count; i++) {
      $('#show').append(ejikznayka.decoratedSeq[i]).append('<br>');
    }
  }

  function showResult() {
    ejikznayka_display.style.display = 'flex';
    start.style.display = 'block';
    ejikznayka_close.style.display = 'block';
    $('#ejikznayka_controls').children().show();

  }

  function checkAnswer() {
    mark.style.display = 'block';
    if (input_answer.value == ejikznayka.res) {
      $('#your_answer').removeClass('incorrect').addClass('correct');
      check_answer_message.querySelector('.incorrect').style.display = 'none';
      check_answer_message.querySelector('.correct').style.display = 'block';
      mark_placeholder.innerHTML = ejikznayka.settings.mark;
      if (typeof $('.correct audio').get(0) !== 'undefined') {
        $('.correct audio').get(0).play();
      }
    }
    else {
      $('#your_answer').removeClass('correct').addClass('incorrect');
      check_answer_message.querySelector('.correct').style.display = 'none';
      check_answer_message.querySelector('.incorrect').style.display = 'block';
      mark_placeholder.innerHTML = 0;
      if (typeof $('.incorrect audio').get(0) !== 'undefined') {
        $('.incorrect audio').get(0).play();
      }
    }
  }

  function hideControls() {
    $('#ejikznayka_controls').children().hide();
    // Restore all controls.
    //$('#ejikznayka_controls').children().css('visibility', 'visible');
    //$('#ejikznayka_display').children().css('display', 'none');
    $('#your_answer').removeClass();
    ejikznayka_close.style.display = 'none';
  }
})(jQuery, Drupal);
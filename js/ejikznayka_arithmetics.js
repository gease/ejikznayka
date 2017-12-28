/**
 * @file Provides functionality of the arithmetics page.
 */

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

  reset: function () {
    'use strict';
    this.res = this.count = 0;
    this.setup();
  },
  setup: function (settings) {
    'use strict';
    if (jQuery.isEmptyObject(settings) && jQuery.isEmptyObject(this.settings)) {
      throw 'No settings to setup ejikznayka.';
    }
    if (!jQuery.isEmptyObject(settings)) {
      this.settings = jQuery.extend(true, {}, settings);
    }
    if (!this.settings.digits && !this.settings.range && !this.settings.data) {
      throw 'No data to initialize sequence';
    }
    jQuery('#show, #your_answer_placeholder, #correct_answer_placeholder').css('font-size', this.settings.font_size + 'px');
    jQuery('#ejikznayka_display').css('font-size', (3 * this.settings.font_size / 4) + 'px');
    if (!this.settings.data) {
      if (this.settings.digits) {
        // Setup value ranges.
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
      this.generate();
    }
    else {
      this.seq = this.settings.data.sequence;
      this.decorateAll();
      this.positions = this.settings.data.positions;
    }

  },
  generate: function () {
    'use strict';
    if (this.settings.sequence) {
      var j = 0;
      for (var i = this.settings.range.min; i <= this.settings.range.max; i++) {
        this.seq[j] = i;
        this.decoratedSeq[j] = this.decorate(i, true);
        j++;
      }
    }
    else {
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

  // if skip == true we don't add plus sign.
  decorate: function (i, skip) {
    'use strict';
    if (typeof skip === 'undefined') {
      skip = false;
    }
    // We assume that i may be a string.
    if (isNaN(+i)) {
      return '';
    }
    else {
      if (+i < 0 || skip) {
        return i + '';
      }
      else {
        return '+' + i;
      }
    }
  },
  decorateAll: function () {
    'use strict';
    for (var i = 0; i < this.seq.length; i++) {
      this.decoratedSeq[i] = this.decorate(this.seq[i], i === 0);
    }
  }
};

(function ($, Drupal) {
  'use strict';
  window.onload = function () {
    ejikznayka.setup(drupalSettings.ejikznayka.arithmetics);

    // Turning page on and off.
    $('#ejikznayka_page').click(function () {
      $('.overlay').css('display', 'flex');
      ejikznayka.reset();
    });

    $('#ejikznayka_close').click(function () {
      $('.overlay').css('display', 'none');
    });

    // Controls for the actions.
    $('#start').click(function () {
      ejikznayka.reset();
      $('#correct_answer_placeholder').html('');
      // correct_answer.style.display = 'none';
      $('#input_answer').val('');
      $('#ejikznayka_display').children().hide();
      $('#show').css('display','block');
      // if (ejikznayka.settings.column == 'single') {
      hideControls();
      changeNumber();
      // }
      /* if (ejikznayka.settings.column == 'column') {
        showColumn();
        showResult();
      }*/
    });

    $('#show_answer').click(function () {
      $('#correct_answer_placeholder').html(ejikznayka.res);
      $('#correct_answer').css('display', 'block');
      $('#ejikznayka_controls').children(':not(#start)').hide();
      $('#show').html('');
      checkAnswer();
    });

    $('#check_answer').click( function () {
      $('#check_answer_message').css('display', 'block');
      $('#correct_answer').css('display', 'none');
      $('#show').html('');
      checkAnswer();
    });

    $('#input_answer').blur(function () {
      $('#your_answer_placeholder').html(this.value);
      $('#your_answer').css('display', 'block');
    });
  };

  function changeNumber() {
    switch (ejikznayka.settings.column) {
      case 'single':
        $('#show').html(ejikznayka.decoratedSeq[ejikznayka.count]);
        break;
      case 'column':
        $('#show').append('<br>' + ejikznayka.decoratedSeq[ejikznayka.count]);
        break;
      case 'line':
        $('#show').append(ejikznayka.decoratedSeq[ejikznayka.count]);
        break;
      default:
        break;
    }
    // show.innerHTML = ejikznayka.decoratedSeq[ejikznayka.count];
    $('#show').addClass('new');
    // show.classList.remove('old');
    if (ejikznayka.settings.random_location && ejikznayka.settings.column === 'single') {
      $('#show').css('position', 'absolute').css(ejikznayka.positions[ejikznayka.count]);
    }

    setTimeout(function () {
      $('#show').removeClass('new');
    }, ejikznayka.settings.interval * 500);
    setTimeout(function () {
      // show.classList.add('old');
    }, ejikznayka.settings.interval * 1000 - 100);

    if (++ejikznayka.count < ejikznayka.seq.length) {
      setTimeout(changeNumber, ejikznayka.settings.interval * 1000);
    }
    else {
      setTimeout(function () {
        if (!ejikznayka.settings.keep) {
          $('#show').html('');
        }
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
    $('#ejikznayka_display').css('display', 'flex');
    $('#start').css('display', 'block');
    $('#ejikznayka_close').css('display', 'block');
    $('#ejikznayka_controls').children().show();

  }

  function checkAnswer() {
    $('#mark').css('display', 'block');
    if ($('#input_answer').val() == ejikznayka.res) {
      $('#your_answer').removeClass('incorrect').addClass('correct');
      $('#check_answer_message').find('.incorrect').css('display', 'none');
      $('#check_answer_message').find('.correct').css('display', 'block');
      $('#mark_placeholder').html(ejikznayka.settings.mark);
      if (typeof $('.correct audio').get(0) !== 'undefined') {
        $('.correct audio').get(0).play();
      }
    }
    else {
      $('#your_answer').removeClass('correct').addClass('incorrect');
      $('#check_answer_message').find('.correct').css('display', 'none');
      $('#check_answer_message').find('.incorrect').css('display', 'block');
      $('#mark_placeholder').html('0');
      if (typeof $('.incorrect audio').get(0) !== 'undefined') {
        $('.incorrect audio').get(0).play();
      }
    }
  }

  function hideControls() {
    $('#ejikznayka_controls').children().hide();
    // Restore all controls.
    // $('#ejikznayka_controls').children().css('visibility', 'visible');
    // $('#ejikznayka_display').children().css('display', 'none');
    $('#your_answer').removeClass();
    $('#ejikznayka_close').css('display', 'none');
  }
})(jQuery, Drupal);
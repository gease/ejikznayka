(function ($) {
  'use strict';
  $.fn.ejikznayka = function (sequence = [], positions = [], options = {}) {
    // Throw an error if sequence or positions is empty
    // or their lengths do not match.
    if (!Array.isArray(sequence) || sequence.length === 0) {
      throw 'No sequence for ejikznayka.';
    }
    if (!Array.isArray(positions) || (positions.length !== sequence.length && positions.length !== 0)) {
      throw 'Incorrect number of positions.';
    }


    const decorate = function (i, skip = false) {
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
    };

    const decorateAll = function (sequence) {
      if (!Array.isArray(sequence)) {
        throw 'No sequence to decorate.';
      }
      let decoratedSeq = [];
      for (let i = 0; i < sequence.length; i++) {
        decoratedSeq[i] = decorate(sequence[i], i === 0);
      }
      return decoratedSeq;
    };
    // Start setup.
    options = $.extend({}, $.fn.ejikznayka.defaults, options || {});
    let state = {current: 0};
    this.sequence = sequence;
    let result = 0;
    for (let i = 0; i < this.sequence.length; i++) {
      result += this.sequence[i];
    }
    this.result = result;
    const decoratedSequence = this.decoratedSequence = decorateAll(this.sequence);
    // Finish setup.
    // Region variables.
    const $block = $(this).next('.overlay');
    const $controls = $block.children('.ejikznayka_controls');
    const $display = $block.children('.ejikznayka_display');
    const $show = $display.children('.show');
    const $correct_answer = $display.children('.correct_answer');
    const $correct_answer_placeholder = $correct_answer.children('.correct_answer_placeholder');
    // End region variables.
    const showResult = function () {
      $display.css('display', 'flex');
      $controls.children('.start').css('display', 'block');
      $block.children('.ejikznayka_close').css('display', 'block');
      $controls.children().show();

    };
    const checkAnswer = function () {
      $display.children('.mark').css('display', 'block');
      const $check_answer_message = $display.children('.check_answer_message');
      const $correct_audio = $check_answer_message.children('.correct').children('audio');
      const $incorrect_audio = $check_answer_message.children('.incorrect').children('audio');
      if ($controls.children('.input_answer').val() == result) {
        $display.children('.your_answer').removeClass('incorrect').addClass('correct');
        $check_answer_message.children('.incorrect').css('display', 'none');
        $check_answer_message.children('.correct').css('display', 'block');
        $display.children('.mark').children('.mark_placeholder').html(options.mark_good);
        if (typeof $correct_audio.get(0) !== 'undefined') {
          $correct_audio.get(0).play();
        }
      }
      else {
        $display.children('.your_answer').removeClass('correct').addClass('incorrect');
        $check_answer_message.children('.correct').css('display', 'none');
        $check_answer_message.children('.incorrect').css('display', 'block');
        $display.children('.mark').children('.mark_placeholder').html(options.mark_bad);
        if (typeof $incorrect_audio.get(0) !== 'undefined') {
          $incorrect_audio.get(0).play();
        }
      }
    };
    const changeNumber = function () {
      switch (options.column) {
        case 'single':
          $show.html(decoratedSequence[state.current]);
          break;
        case 'column':
          $show.append('<br>' + decoratedSequence[state.current]);
          break;
        case 'line':
          $show.append(decoratedSequence[state.current]);
          break;
        default:
          break;
      }
      $show.addClass('new');
      if (options.random_location && options.column === 'single') {
        $show.css('position', 'absolute').css(positions[state.current]);
      }
      setTimeout(function () {
        $show.removeClass('new');
      }, options.interval * 500);
      if (++state.current < sequence.length) {
        setTimeout(changeNumber, options.interval * 1000);
      }
      else {
        setTimeout(function () {
          if (!options.keep) {
            $show.html('');
          }
          showResult();
        }, options.interval * 1000);
      }
    };
    const hideControls = function () {
      $controls.children().hide();
      // Restore all controls.
      // $('#ejikznayka_controls').children().css('visibility', 'visible');
      // $('#ejikznayka_display').children().css('display', 'none');
      $display.children('.your_answer').removeClass('correct incorrect');
      $block.children('.ejikznayka_close').css('display', 'none');
    };
    const attachHandlers = function () {
      $(this).click(function () {
        $block.css('display', 'flex');
      });
      $block.children('.ejikznayka_close').click(function () {
        $block.css('display', 'none');
      });
      $controls.children('.start').click(function () {
        $display.children('.correct_answer').children('.correct_answer_placeholder').html('');
        state.current = 0;
        // correct_answer.style.display = 'none';
        $controls.children('.input_answer').val('');
        $display.children().hide();
        $show.css('display', 'block');
        hideControls();
        changeNumber();
      });
      $controls.children('.show_answer').click(function () {
        $correct_answer_placeholder.html(result);
        $correct_answer.css('display', 'block');
        $controls.children(':not(.start)').hide();
        $show.html('');
        checkAnswer();
      });
      $controls.children('.check_answer').click(function () {
        $display.children('.check_answer_message').css('display', 'block');
        $correct_answer.css('display', 'none');
        $show.html('');
        checkAnswer();
      });
      $controls.children('.input_answer').blur(function () {
        const $your_answer = $display.children('.your_answer');
        $your_answer.children('.your_answer_placeholder').html(this.value);
        $your_answer.css('display', 'block');
      });
    };
    attachHandlers.call(this);
  };
  $.fn.ejikznayka.defaults = {
    interval: 1,
    random_location: false,
    keep: false,
    mark_good: 5,
    mark_bad: 0,
    column: 'single',
    font_size: 40
  };
  $.ejikznayka = {
    generate: function (options) {
      const defaults = {
        min: 1,
        max: 9,
        count: 3,
        minus: true
      };
      options = $.extend({}, defaults, options || {});
      let sequence = [];
      let res = 0;
      let range = options.max - options.min;
      for (let i = 0; i < options.count; i++) {
        if (options.minus === false || (Math.random() > 0.5 || res <= options.min)) {
          sequence[i] = options.min + Math.floor(Math.random() * (range + 1));
        }
        else {
          sequence[i] = -(options.min + Math.floor(Math.random() * (Math.min(options.max, res) - options.min + 1)));
        }
        res += sequence[i];
      }
      return sequence;
    },
    generatePositions: function (count) {
      let position = {};
      let top;
      let left;
      let positions = [];
      for (let i = 0; i < count; i++) {
        top = Math.floor(Math.random() * 50);
        left = Math.floor(Math.random() * 50);
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
        positions[i] = Object.assign({}, position);
      }
      return positions;
    }
  };
}(jQuery));

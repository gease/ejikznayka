window.onload = function() {
  var cur, multiplier, res = i = 0;
  var settings = drupalSettings.ejikznayka.arithmetics;

  start.addEventListener("click", function() {
    controls = document.querySelectorAll('input');
    for (var j = 0; j < controls.length; j++) {
      controls[j].disabled = true;
    }
    i = res = cur = 0;
    answer_placeholder.innerHTML = '';
    answer.style.display = 'none';
    check_answer_message.style.display = 'none';
    input_answer.value = '';
    check.style.display = 'none';
    multiplier = Math.pow(10, settings.digits);
    changeNumber();
  }, false);

  show_answer.addEventListener("click", function() {
    answer_placeholder.innerHTML = res;
    answer.style.display = 'block';
  }, false);

  check_answer.addEventListener("click", function() {
    check_answer_message.style.display = 'block';
    if (input_answer.value == res) {
      check_answer_message.querySelector('.incorrect').style.display = 'none';
      check_answer_message.querySelector('.correct').style.display = 'block';
    }
    else {
      check_answer_message.querySelector('.correct').style.display = 'none';
      check_answer_message.querySelector('.incorrect').style.display = 'block';
    }
  }, false);

  function changeNumber() {
    if (settings.minus == true) {
      if (Math.random() > 0.5 || cur == 0) {
        cur = Math.floor(Math.random() * multiplier);
        res += cur;
        cur = "+" + cur;
      }
      else {
        cur = Math.floor(Math.random() * res);
        res -= cur;
        cur = "-" + cur;
      }
    }
    else {
      cur = Math.floor(Math.random() * multiplier);
      res += cur;
    }
    show.innerHTML = cur;
    show.classList.add('new');
    show.classList.remove('old');
    setTimeout(function() {show.classList.remove('new'); }, settings.interval * 500);
    setTimeout(function() {show.classList.add('old'); }, settings.interval * 1000 - 100);
    if (++i < settings.count) {
      setTimeout(changeNumber, settings.interval * 1000);
    }
    else {
      setTimeout( function () {show.innerHTML = '';showResult();}, settings.interval * 1000);
    }
  }

  function showResult() {
    check.style.display = 'block';
    for (var j = 0; j < controls.length; j++) {
      controls[j].disabled = false;
    }
  }
};
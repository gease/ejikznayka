window.onload = function() {
  count = 0;
  window['edit-range-min'].addEventListener("blur", blurred);
  window['edit-range-max'].addEventListener("blur", blurred);
  window['edit-digits'].addEventListener("blur", function() {
    if (this.value != "") {
      window['edit-range-min'].value = window['edit-range-max'].value = '';
    }
  });
};

function blurred() {
  // Initially, values are strings. We need to typecast them.
  if (+ window['edit-range-min'].value < + window['edit-range-max'].value) {
    window['edit-digits'].value = '';
  }
}
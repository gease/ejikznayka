/**
 * @file Tuning of EjikznaykaArithmeticsSettingsForm.
 */

(function ($, Drupal) {
  'use strict';
  Drupal.behaviors.ejikznaykaSettings = {
    attach: function (context, settings) {
      $('#edit-range-min, #edit-range-max', context).blur(function () {
        if (+$('#edit-range-min', context).val() <= +$('#edit-range-max', context).val()) {
          $('#edit-digits', context).val('');
        }
      });
      $('#edit-digits', context).blur(function () {
        if (this.value !== '') {
          $('#edit-range-min, #edit-range-max', context).val('');
        }
      });
      $('#edit-sequence', context).change(seqDisable).change();
      function seqDisable() {
        var $block = $('#edit-digits, #edit-column--wrapper, #edit-random-location, #edit-minus, #edit-count', context);
        if ($('#edit-sequence', context).prop('checked') === true) {
          $block.attr('disabled', true);
        }
        else {
          $block.attr('disabled', false);
        }
      }
    }
  };
})(jQuery, Drupal);

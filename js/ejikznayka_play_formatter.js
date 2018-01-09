(function ($) {
  'use strict';
  Drupal.behaviors.ejikznayka = {
    attach: function (context, settings) {
      for (let field in settings.ejikznayka) {
        if (settings.ejikznayka.hasOwnProperty(field)) {
          const o = settings.ejikznayka[field];
          for (let i in o) {
            if (o.hasOwnProperty(i)) {
              $('.' + field + ' .field__item:eq(' + i + ')  button.ejikznayka_page', context).ejikznayka(o[i].sequence, o[i].positions, o[i].options);
            }
          }
        }
      }
    }
  };
})(jQuery);

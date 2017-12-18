<?php

namespace Drupal\ejikznayka_arithmetics\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\file\Entity\File;

class EjikznaykaArithmeticsController extends ControllerBase {

  public function content() {
    $config = \Drupal::config('ejikznayka.arithmetics')->get();
    $js_config = [
      'count' => $config['count'],
      'interval' => $config['interval'],
      'minus' => $config['minus'],
      'keep' => ($config['column'] == 'single' ? FALSE : $config['keep']),
      'random_location' => $config['random_location'],
      'mark' => $config['mark'],
      'column' => $config['column'],
      'font_size' => $config['font_size'],
    ];
    if (!empty($config['digits'])) {
      $js_config['digits'] = $config['digits'];
    }
    else {
      $js_config['range'] = $config['range'];
      $js_config['sequence'] = $config['sequence'];
    }
    $return_array = [
      '#theme' => 'ejikznayka_arithmetics',
      '#attached' => [
        'drupalSettings' => [
          'ejikznayka' => [
            'arithmetics' => $js_config,
          ],
        ],
      ],
    ];
    foreach (['correct_emoticon', 'incorrect_emoticon', 'correct_audio', 'incorrect_audio'] as $file_key) {
      if (isset($config[$file_key][0])) {
        $file = File::load($config[$file_key][0]);
        $return_array['#' . $file_key] = isset($file) ? $file->url() : '';
      }
    }
    return $return_array;
  }
}
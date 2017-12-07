<?php

namespace Drupal\ejikznayka_arithmetics\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\file\Entity\File;

class EjikznaykaArithmeticsController extends ControllerBase {

  public function content() {
    $config = \Drupal::config('ejikznayka.arithmetics')->get();
    foreach (['correct_emoticon', 'incorrect_emoticon'] as $icon) {
      $file = File::load($config[$icon][0]);
      ${$icon . '_url'} = isset($file) ? $file->url() : '';
    }
    $js_config = [
      'count' => $config['count'],
      'interval' => $config['interval'],
      'minus' => $config['minus'],
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
    }
    return [
      '#correct_emoticon' => $correct_emoticon_url,
      '#incorrect_emoticon' => $incorrect_emoticon_url,
      '#theme' => 'ejikznayka_arithmetics',
      '#attached' => [
        'drupalSettings' => [
          'ejikznayka' => [
            'arithmetics' => $js_config,
          ],
        ],
      ],
    ];
  }
}
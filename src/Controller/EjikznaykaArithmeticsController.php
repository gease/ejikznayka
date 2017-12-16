<?php

namespace Drupal\ejikznayka_arithmetics\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\file\Entity\File;

class EjikznaykaArithmeticsController extends ControllerBase {

  public function content() {
    $config = \Drupal::config('ejikznayka.arithmetics')->get();
    foreach (['correct_emoticon', 'incorrect_emoticon', 'correct_audio', 'incorrect_audio'] as $file_key) {
      if (isset($config[$file_key][0])) {
        $file = File::load($config[$file_key][0]);
        ${$file_key . '_url'} = isset($file) ? $file->url() : '';
      }
    }
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
    }
    return [
      '#correct_emoticon' => $correct_emoticon_url,
      '#incorrect_emoticon' => $incorrect_emoticon_url,
      '#correct_audio' => $correct_audio_url,
      '#incorrect_audio' => $incorrect_audio_url,
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
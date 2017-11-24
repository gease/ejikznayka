<?php

namespace Drupal\ejikznayka_arithmetics\Controller;

use Drupal\Core\Controller\ControllerBase;

class EjikznaykaArithmeticsController extends ControllerBase {

  public function content() {
    $config = \Drupal::config('ejikznayka.arithmetics')->get();
    return [
      '#type' => 'markup',
      '#theme' => 'ejikznayka_arithmetics',
      '#attached' => [
        'drupalSettings' => [
          'ejikznayka' => [
            'arithmetics' => [
              'count' => $config['count'],
              'digits' => $config['digits'],
              'interval' => $config['interval'],
              'minus' => $config['minus'],
            ],
          ],
        ],
      ],
    ];
  }
}
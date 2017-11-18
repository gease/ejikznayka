<?php

namespace Drupal\ejikznayka_arithmetics\Controller;

use Drupal\Core\Controller\ControllerBase;

class EjikznaykaArithmeticsController extends ControllerBase {

  public function content() {
    $config = \Drupal::config('ejikznayka.arithmetics')->get();
    return [
      '#type' => 'markup',
      '#markup' => '<input type="button" name="start" id="start" value="Начать" />
                    <div id="show"></div>
                    <div id="check">
                      <input type="button" name="show_answer" id="show_answer" value="Показать ответ" /><br>
                      <div id="answer">
                        Правильный ответ: <div id="answer_placeholder"> </div>
                      </div>
                      <input type="text" name="input_answer" id="input_answer" placeholder="Ваш ответ" />
                      <input type="button" name="check_answer" id="check_answer" value="Проверить ответ" />
                      <div id="check_answer_message">
                        <div class="incorrect">Неверно!</div>
                        <div class="correct">Верно!</div> 
                      </div>
                    </div>',
      '#allowed_tags' => ['div', 'input'],
      '#attached' => [
        'library' => [
          'ejikznayka_arithmetics/ejikznayka_arithmetics',
        ],
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
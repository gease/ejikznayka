<?php
/**
 * Created by PhpStorm.
 * User: gease
 * Date: 16/11/17
 * Time: 15:31
 */

namespace Drupal\ejikznayka_arithmetics\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;

class EjikznaykaArithmeticsSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'ejikznayka_arithmetics_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'ejikznayka.arithmetics',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('ejikznayka.arithmetics');

    $form['link'] = Link::createFromRoute($this->t('Go to arithmetics page'), 'ejikznayka_arithmetics.content')->toRenderable();

    $form['digits'] = array(
      '#type' => 'number',
      '#title' => $this->t('Digits'),
      '#size' => 3,
      '#min' => 1,
      '#max' => 5,
      '#default_value' => $config->get('digits'),
    );

    $form['count'] = array(
      '#type' => 'number',
      '#title' => $this->t('Number of numbers'),
      '#size' => 3,
      '#min' => 2,
      '#max' => 50,
      '#default_value' => $config->get('count'),
    );

    $form['interval'] = array(
      '#type' => 'number',
      '#title' => $this->t('Interval (seconds)'),
      '#size' => 3,
      '#step' => 0.1,
      '#min' => 0.1,
      '#max' => 5,
      '#default_value' => $config->get('interval'),
     );

    $form['minus'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Subtraction allowed'),
      '#default_value' => $config->get('minus'),
    );

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Retrieve the configuration
    \Drupal::configFactory()->getEditable('ejikznayka.arithmetics')
      // Set the submitted configuration setting
      ->set('digits', $form_state->getValue('digits'))
      ->set('count', $form_state->getValue('count'))
      ->set('interval', $form_state->getValue('interval'))
      ->set('minus', $form_state->getValue('minus'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
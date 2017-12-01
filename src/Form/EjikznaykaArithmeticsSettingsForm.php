<?php

namespace Drupal\ejikznayka_arithmetics\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;
use Drupal\file\Entity\File;

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
   * Form that collects settings for arithmetics page at /schet.
   *
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

    $form['range'] = array(
      '#tree' => TRUE,
      '#type' => 'fieldgroup',
      '#title' => $this->t('Range of numbers'),
      'min' => array(
        '#type' => 'number',
        '#title' => $this->t('From'),
        '#min' => 0,
        '#max' => 999999,
        '#default_value' => $config->get('range.min'),
      ),
      'max' => array(
        '#type' => 'number',
        '#title' => $this->t('To', array(), array('context' => 'Range')),
        '#min' => 0,
        '#max' => 999999,
        '#default_value' => $config->get('range.max'),
      ),
    );

    $form['count'] = array(
      '#type' => 'number',
      '#title' => $this->t('Number of numbers'),
      '#size' => 3,
      '#min' => 2,
      '#max' => 50,
      '#default_value' => $config->get('count'),
      '#required' => TRUE,
    );

    $form['interval'] = array(
      '#type' => 'number',
      '#title' => $this->t('Interval (seconds)'),
      '#size' => 3,
      '#step' => 0.1,
      '#min' => 0.1,
      '#max' => 5,
      '#default_value' => $config->get('interval'),
      '#required' => TRUE,
    );

    $form['random_location'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Random location'),
      '#default_value' => $config->get('random_location'),
    );

    $form['minus'] = array(
      '#type' => 'checkbox',
      '#title' => $this->t('Subtraction allowed'),
      '#default_value' => $config->get('minus'),
    );

    $form['mark'] = array(
      '#type' => 'number',
      '#title' => $this->t('Mark for correct task'),
      '#min' => 0,
      '#max' => 100,
      '#default_value' => $config->get('mark'),
      '#required' => TRUE,
    );

    $form['correct_emoticon'] = array(
      '#type' => 'managed_file',
      '#title' => $this->t('Smiley for correct answer'),
      '#multiple' => FALSE,
      '#upload_location' => 'public://ejikznayka',
      '#upload_validators' => array(
        'file_validate_extensions' => array('png', 'gif', 'jpg', 'jpeg'),
        'file_validate_is image' => array(),
        'file_validate_image_resolution' => array('257x257', '16x16'),
        'file_validate_size' => array(10000),
      ),
      '#default_value' => $config->get('correct_emoticon'),
    );

    $form['incorrect_emoticon'] = array(
      '#type' => 'managed_file',
      '#title' => $this->t('Smiley for incorrect answer'),
      '#multiple' => FALSE,
      '#upload_location' => 'public://ejikznayka',
      '#upload_validators' => array(
        'file_validate_extensions' => array('png', 'gif', 'jpg', 'jpeg'),
        'file_validate_is image' => array(),
        'file_validate_image_resolution' => array('257x257', '16x16'),
        'file_validate_size' => array(10000),
      ),
      '#default_value' => $config->get('incorrect_emoticon'),
    );

    $form['#attached'] = array(
      'library' => array('ejikznayka_arithmetics/ejikznayka_arithmetics_settings'),
    );

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if (empty($form_state->getValue('digits'))) {
      if (empty($form_state->getValue(['range', 'max'])) || empty($form_state->getValue(['range', 'min']))) {
        $form_state->setErrorByName('digits', $this->t('Either digits or range should be set'));
      }
      elseif ($form_state->getValue(['range', 'min']) >= $form_state->getValue(['range', 'max'])) {
        $form_state->setErrorByName('range', $this->t('Range "from" should be less than "to"'));
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Retrieve the configuration.
    $config = \Drupal::configFactory()->getEditable('ejikznayka.arithmetics');
    // Check the icons and remove old files if changed. We assume no one else is using them.
    foreach (['correct_emoticon', 'incorrect_emoticon'] as $icon) {
      if ($config->get($icon) != $form_state->getValue($icon)) {
        $file = File::load($config->get($icon)[0]);
        $file->delete();
        $file = File::load($form_state->getValue($icon)[0]);
        $file->setPermanent();
        $file_usage = \Drupal::service('file.usage');
        $usage = $file_usage->listUsage($file);
        if (empty($usage)) {
          // We don't have entity to link this file to. Let's use user #1.
          $file_usage->add($file, 'ejikznayka_arithmetics', 'user', 1);
        }
        $file->save();
      }
    }
    // Set the submitted configuration setting.
    $config->set('count', $form_state->getValue('count'))
      ->set('interval', $form_state->getValue('interval'))
      ->set('minus', $form_state->getValue('minus'))
      ->set('random_location', $form_state->getValue('random_location'))
      ->set('correct_emoticon', $form_state->getValue('correct_emoticon'))
      ->set('incorrect_emoticon', $form_state->getValue('incorrect_emoticon'))
      ->set('mark', $form_state->getValue('mark'))
      ->set('digits', $form_state->getValue('digits'))
      ->set('range', $form_state->getValue('range'))
      ->save();
    parent::submitForm($form, $form_state);
  }

}
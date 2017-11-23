<?php

namespace Drupal\ejikznayka_arithmetics\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Link;


/**
 * Block with link to ejikznayka_arithmetics settings form.
 *
 * @Block(
 *   id = "ejikznayka_arithmetics_settings_link",
 *   admin_label = @Translation("Ejikznayka Arithmetics Settings Link"),
 *   category = @Translation("Ejik Znayka"),
 * )
 */
class EjikznaykaArithmeticsSettingsLinkBlock extends BlockBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  public function build() {
    return Link::createFromRoute($this->t('Configure'), 'ejikznayka_arithmetics.settings')->toRenderable();
  }

}

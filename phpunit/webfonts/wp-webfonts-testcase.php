<?php
/**
 * Test case for the WP Webfonts API tests.
 *
 * @package    WordPress
 * @subpackage Webfonts
 */

/**
 * Abstracts the common tasks for the API's tests.
 */
abstract class WP_Webfonts_TestCase extends WP_UnitTestCase {

	/**
	 * WP_Webfonts instance reference
	 *
	 * @var WP_Webfonts
	 */
	private $old_wp_webfonts;

	public function set_up() {
		parent::set_up();

		global $wp_webfonts;
		$this->old_wp_webfonts = $wp_webfonts;

		$wp_webfonts = null;
	}

	public function tear_down() {
		global $wp_webfonts;

		$wp_webfonts = $this->old_wp_webfonts;
		parent::tear_down();
	}
}

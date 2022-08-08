<?php
/**
 * Register font family tests.
 *
 * @package WordPress
 * @subpackage Webfonts
 */

require_once __DIR__ . '/wp-webfonts-testcase.php';

/**
 * @group  webfonts
 * @covers ::wp_register_font_family
 */
class Tests_Webfonts_WpRegisterFontFamily extends WP_Webfonts_TestCase {

	/**
	 * @dataProvider data_font_family_registers
	 *
	 * @param string $font_family Text to test.
	 */
	public function test_font_family_registers( $font_family ) {
		$this->assertTrue( wp_register_font_family( $font_family ) );
	}

	/**
	 * Data Provider
	 *
	 * @return array
	 */
	public function data_font_family_registers() {
		return array(
			'Proper name' => array( 'Lato' ),
			'as a slug'   => array( 'source-serif-pro' ),
		);
	}
}

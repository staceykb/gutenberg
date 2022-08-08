<?php
/**
 * Register webfonts tests.
 *
 * @package WordPress
 * @subpackage Webfonts
 */

require_once __DIR__ . '/wp-webfonts-testcase.php';

/**
 * @group  webfonts
 * @covers ::wp_register_webfont
 */
class Tests_Webfonts_WpRegisterWebfont extends WP_Webfonts_TestCase {

	/**
	 * Test wp_register_webfonts() bulk register webfonts.
	 *
	 * @dataProvider data_wp_register_webfont
	 *
	 * @covers wp_register_webfont
	 * @covers WP_Webfonts::add
	 * @covers WP_Webfonts::add_variation
	 *
	 * @param string $expected    Expected results.
	 * @param array  $variation   Web font to test.
	 * @param string $font_family Optional. Font family for this variation.
	 */
	public function test_wp_register_webfont( $expected, array $variation, $font_family = '' ) {
		$this->assertSame( $expected, wp_register_webfont( $variation, $font_family ), 'Font family handle should be returned' );
		$this->assertSame( $expected, wp_webfonts()->get_registered(), 'Web fonts should match registered queue' );
		$this->assertSame( array(), wp_webfonts()->get_enqueued(), 'No web fonts should be enqueued' );
	}

	/**
	 * Data provider.
	 *
	 * @return array[]
	 */
	public function data_wp_register_webfont() {
		return array(
			'font family not keyed' => array(
				'webfonts' => array(
					array(
						array(
							'provider'     => 'local',
							'font-family'  => 'Source Serif Pro',
							'font-style'   => 'normal',
							'font-weight'  => '200 900',
							'font-stretch' => 'normal',
							'src'          => 'https://example.com/assets/fonts/source-serif-pro/SourceSerif4Variable-Roman.ttf.woff2',
							'font-display' => 'fallback',
						),
					),
				),
				'expected' => array(
					'wp_register_webfonts' => array(),
					'get_registered'       => array(),
				),
			),
			'font family keyed with slug' => array(
				'webfonts' => array(
					'source-serif-pro' => array(
						array(
							'provider'     => 'local',
							'font-family'  => 'Source Serif Pro',
							'font-style'   => 'normal',
							'font-weight'  => '200 900',
							'font-stretch' => 'normal',
							'src'          => 'https://example.com/assets/fonts/source-serif-pro/SourceSerif4Variable-Roman.ttf.woff2',
							'font-display' => 'fallback',
						),
					),
				),
				'expected' => array(
					'wp_register_webfonts' => array( 'source-serif-pro' ),
					'get_registered'       => array(
						'source-serif-pro',
						'source-serif-pro-200-900-normal',
					),
				),
			),
			'font family keyed with name' => array(
				'webfonts' => array(
					'Source Serif Pro' => array(
						array(
							'provider'     => 'local',
							'font-family'  => 'Source Serif Pro',
							'font-style'   => 'normal',
							'font-weight'  => '200 900',
							'font-stretch' => 'normal',
							'src'          => 'https://example.com/assets/fonts/source-serif-pro/SourceSerif4Variable-Roman.ttf.woff2',
							'font-display' => 'fallback',
						),
						array(
							'provider'     => 'local',
							'font-family'  => 'Source Serif Pro',
							'font-style'   => 'italic',
							'font-weight'  => '200 900',
							'font-stretch' => 'normal',
							'src'          => 'https://example.com/assets/fonts/source-serif-pro/SourceSerif4Variable-Italic.ttf.woff2',
							'font-display' => 'fallback',
						),
					),
				),
				'expected' => array(
					'wp_register_webfonts' => array( 'source-serif-pro' ),
					'get_registered'       => array(
						'source-serif-pro',
						'source-serif-pro-200-900-normal',
						'source-serif-pro-200-900-italic',
					),
				),
			),
		);
	}
}

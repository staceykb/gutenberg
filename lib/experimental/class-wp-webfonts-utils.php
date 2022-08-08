<?php
/**
 * Webfont API's utility helpers.
 *
 * @package    WordPress
 * @subpackage WebFonts
 * @since      6.1.0
 */

if ( class_exists( 'WP_Webfonts_Utils' ) ) {
	return;
}

/**
 * Utility helpers for the Webfonts API.
 *
 * @since 6.1.0
 */
class WP_Webfonts_Utils {

	/**
	 * Converts the given font family into a handle.
	 *
	 * @since 6.1.0
	 *
	 * @param string $font_family Font family to convert into a handle.
	 * @return string|null The font family handle on success. Else, null.
	 */
	public static function convert_font_family_into_handle( $font_family ) {
		if ( ! is_string( $font_family ) || empty( $font_family ) ) {
			return null;
		}

		return sanitize_title( $font_family );
	}

	/**
	 * Converts the given variation and its font-family into a handle.
	 *
	 * @since 6.1.0
	 *
	 * @param string $font_family The font family's handle for this variation.
	 * @param array  $variation   An array of variation properties.
	 * @return string|null The variation handle.
	 */
	public static function convert_variation_into_handle( $font_family, array $variation ) {
		$handle = '';
		foreach ( array( 'font-weight', 'font-style' ) as $property ) {
			if ( empty( $variation[ $property ] ) || ! is_string( $variation[ $property ] ) ) {
				continue;
			}

			$handle .= ' ' . $variation[ $property ];
		}

		if ( '' === $handle ) {
			return null;
		}

		return sanitize_title( $font_family . $handle );
	}

	/**
	 * Gets the font family from the variation.
	 *
	 * @since 6.1.0
	 *
	 * @param array $variation An array of variation properties to search.
	 * @return string|null The font family if defined. Else, null.
	 */
	public static function get_font_family_from_variation( array $variation ) {
		return static::search_for_font_family( $variation, __METHOD__ );
	}

	/**
	 * Checks if the font family is defined.
	 *
	 * @since 6.1.0
	 *
	 * @param string $font_family Font family to check.
	 * @return bool
	 */
	public static function is_font_family_defined( $font_family ) {
		return ( is_string( $font_family ) && '' !== $font_family );
	}

	/**
	 * Searches the variation array to extract the font family.
	 *
	 * @since 6.1.0
	 *
	 * @param array  $haystack      An array of variation properties to search.
	 * @param string $caller_method Method calling this private method.
	 * @return string|null The font family when found. Else, null.
	 */
	private static function search_for_font_family( array $haystack, $caller_method ) {
		if ( array_key_exists( 'fontFamily', $haystack ) ) {
			$key = 'fontFamily';
		} elseif ( array_key_exists( 'font-family', $haystack ) ) {
			$key = 'font-family';
		} else {
			_doing_it_wrong( $caller_method, __( 'Font family not found.', 'gutenberg' ), '6.1.0' );
			return null;
		}

		if ( static::is_font_family_defined( $haystack[ $key ] ) ) {
			return $haystack[ $key ];
		}

		_doing_it_wrong( $caller_method, __( 'Font family not defined in the variation.', 'gutenberg' ), '6.1.0' );
		return null;
	}
}

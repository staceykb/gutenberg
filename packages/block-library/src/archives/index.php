<?php
/**
 * Server-side rendering of the `core/archives` block.
 *
 * @package WordPress
 */

$show_post_count = ! empty( $attributes['showPostCounts'] );
$type            = isset( $attributes['type'] ) ? $attributes['type'] : 'monthly';
$class           = '';

if ( ! empty( $attributes['displayAsDropdown'] ) ) {

	$class .= ' wp-block-archives-dropdown';

	$dropdown_id = wp_unique_id( 'wp-block-archives-' );
	$title       = __( 'Archives' );

	/** This filter is documented in wp-includes/widgets/class-wp-widget-archives.php */
	$dropdown_args = apply_filters(
		'widget_archives_dropdown_args',
		array(
			'type'            => $type,
			'format'          => 'option',
			'show_post_count' => $show_post_count,
		)
	);

	$dropdown_args['echo'] = 0;

	$archives = wp_get_archives( $dropdown_args );

	$classnames = esc_attr( $class );

	$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $classnames ) );

	switch ( $dropdown_args['type'] ) {
		case 'yearly':
			$label = __( 'Select Year' );
			break;
		case 'monthly':
			$label = __( 'Select Month' );
			break;
		case 'daily':
			$label = __( 'Select Day' );
			break;
		case 'weekly':
			$label = __( 'Select Week' );
			break;
		default:
			$label = __( 'Select Post' );
			break;
	}

	$block_content = '<label for="' . esc_attr( $dropdown_id ) . '">' . esc_html( $title ) . '</label>
<select id="' . esc_attr( $dropdown_id ) . '" name="archive-dropdown" onchange="document.location.href=this.options[this.selectedIndex].value;">
<option value="">' . esc_html( $label ) . '</option>' . $archives . '</select>';

	echo sprintf(
		'<div %1$s>%2$s</div>',
		$wrapper_attributes,
		$block_content
	);
	return;
}

$class .= ' wp-block-archives-list';

/** This filter is documented in wp-includes/widgets/class-wp-widget-archives.php */
$archives_args = apply_filters(
	'widget_archives_args',
	array(
		'type'            => $type,
		'show_post_count' => $show_post_count,
	)
);

$archives_args['echo'] = 0;

$archives = wp_get_archives( $archives_args );

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => $class ) );

if ( empty( $archives ) ) {
	echo sprintf(
		'<div %1$s>%2$s</div>',
		$wrapper_attributes,
		__( 'No archives to show.' )
	);
	return;
}

echo sprintf(
	'<ul %1$s>%2$s</ul>',
	$wrapper_attributes,
	$archives
);

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';

/**
 * Filters registered block settings, adding an `__experimentalLabel` callback if one does not already exist.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
export function addLabelCallback( settings ) {
	// If labels provide their own label callback, do not override it.
	if ( settings.__experimentalLabel ) {
		return settings;
	}
	if ( hasBlockSupport( settings, '__experimentalLabel' ) ) {
		settings.__experimentalLabel = ( attributes, { context } ) => {
			const { __experimentalMetadata: meta } = attributes;

			// In the list view, use the block's name sattribute as the label.
			if ( context === 'list-view' && meta?.name ) {
				return meta.name;
			}
		};
	}

	return settings;
}

addFilter(
	'blocks.registerBlockType',
	'core/metadata/addLabelCallback',
	addLabelCallback
);

/**
 * External dependencies
 */
import { has } from 'lodash';

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';

/**
 * Filters registered block settings, extending attributes to include `metadata`.
 *
 * see: https://github.com/WordPress/gutenberg/pull/40393/files#r864632012
 *
 * @param {Object} blockTypeSettings Original block settings.
 * @return {Object} Filtered block settings.
 */
export function addMetaAttribute( blockTypeSettings ) {
	// Allow blocks to specify their own attribute definition with default values if needed.
	if (
		has( blockTypeSettings.attributes, [
			'__experimentalMetadata',
			'type',
		] )
	) {
		return blockTypeSettings;
	}
	if (
		hasBlockSupport( blockTypeSettings, '__experimentalMetadata', false )
	) {
		blockTypeSettings.attributes = {
			...blockTypeSettings.attributes,
			__experimentalMetadata: {
				type: 'object',
			},
		};
	}

	return blockTypeSettings;
}

export function addSaveProps( extraProps, blockType, attributes ) {
	if ( hasBlockSupport( blockType, '__experimentalMeta' ) ) {
		extraProps.__experimentalMeta = attributes.__experimentalMeta;
	}

	return extraProps;
}

addFilter(
	'blocks.registerBlockType',
	'core/meta/addMetaAttribute',
	addMetaAttribute
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'core/meta/save-props',
	addSaveProps
);

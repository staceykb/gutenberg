/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { hasBlockMetadataSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import { MenuItem } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockSettingsMenuControls from '../components/block-settings-menu-controls';

/**
 * Internal dependencies
 */

/**
 * Filters registered block settings, adding an `__experimentalLabel` callback if one does not already exist.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
export function addLabelCallback( settings ) {
	// If blocks provide their own label callback, do not override it.
	if ( settings.__experimentalLabel ) {
		return settings;
	}

	// Check whether block metadata is supported before using it.
	if ( hasBlockMetadataSupport( settings, 'name' ) ) {
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

export const withOptionsMenuItem = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		const { name: blockName, isSelected } = props;

		const supportsBlockNaming = hasBlockMetadataSupport(
			blockName,
			'name'
		);

		return (
			<>
				{ isSelected && (
					<BlockSettingsMenuControls>
						{ () => (
							<MenuItem
								disabled={ ! supportsBlockNaming }
								onClick={ () => {
									// eslint-disable-next-line no-console
									console.log(
										`can't toggle editing from this context`
									);
									//toggleLabelEditingMode( true );
								} }
							>
								{ __( 'Rename' ) }
							</MenuItem>
						) }
					</BlockSettingsMenuControls>
				) }
				<BlockEdit { ...props } />
			</>
		);
	},
	'withOptionsMenuItem'
);

addFilter(
	'blocks.registerBlockType',
	'core/metadata/addLabelCallback',
	addLabelCallback
);

// addFilter(
// 	'editor.BlockEdit',
// 	'core/editor/align/with-toolbar-controls',
// 	withOptionsMenuItem
// );

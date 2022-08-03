/**
 * WordPress dependencies
 */
import { ToolbarGroup, ToolbarItem } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockSettingsDropdown from './block-settings-dropdown';
import BlockEditVisuallyButton from './block-edit-visually-button';

export function BlockSettingsMenu( { clientIds, clientId, ...props } ) {
	return (
		<>
			<BlockEditVisuallyButton clientIds={ clientIds } { ...props } />
			<ToolbarGroup>
				<ToolbarItem>
					{ ( toggleProps ) => (
						<BlockSettingsDropdown
							clientId={ clientId }
							clientIds={ clientIds }
							toggleProps={ toggleProps }
							{ ...props }
						/>
					) }
				</ToolbarItem>
			</ToolbarGroup>
		</>
	);
}

export default BlockSettingsMenu;

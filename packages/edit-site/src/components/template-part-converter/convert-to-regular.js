/**
 * WordPress dependencies
 */
import { useSelect, useSuspenseSelect, useDispatch } from '@wordpress/data';
import {
	BlockSettingsMenuControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function ConvertToRegularBlocks( { clientId } ) {
	const { getBlocks } = useSelect( blockEditorStore );
	const { replaceBlocks } = useDispatch( blockEditorStore );

	const canRemove = useSuspenseSelect(
		( select ) => select( blockEditorStore ).canRemoveBlock( clientId ),
		[ clientId ]
	);

	if ( ! canRemove ) {
		return null;
	}

	return (
		<BlockSettingsMenuControls>
			{ ( { onClose } ) => (
				<MenuItem
					onClick={ () => {
						replaceBlocks( clientId, getBlocks( clientId ) );
						onClose();
					} }
				>
					{ __( 'Detach blocks from template part' ) }
				</MenuItem>
			) }
		</BlockSettingsMenuControls>
	);
}

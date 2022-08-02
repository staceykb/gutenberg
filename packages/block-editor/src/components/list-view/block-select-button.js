/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalHStack as HStack,
	__experimentalTruncate as Truncate,
	__experimentalInputControl as InputControl,
	MenuItem,
} from '@wordpress/components';
import { forwardRef, useRef, useState, useEffect } from '@wordpress/element';
import { Icon, lock } from '@wordpress/icons';
import { SPACE, ENTER, ESCAPE } from '@wordpress/keycodes';
import { useSelect, useDispatch } from '@wordpress/data';
import { hasBlockMetadataSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import useBlockDisplayInformation from '../use-block-display-information';
import useBlockDisplayTitle from '../block-title/use-block-display-title';
import ListViewExpander from './expander';
import { useBlockLock } from '../block-lock';
import { store as blockEditorStore } from '../../store';
import BlockSettingsMenuControls from '../block-settings-menu-controls';

const SINGLE_CLICK = 1;
const DOUBLE_CLICK = 2;

function ListViewBlockSelectButton(
	{
		className,
		block,
		onClick,
		onToggleExpanded,
		tabIndex,
		onFocus,
		onDragStart,
		onDragEnd,
		draggable,
		isSelected,
	},
	ref
) {
	const { clientId } = block;
	const clickHandlerTimer = useRef();
	const inputRef = useRef();

	// Setting managed via `toggleLabelEditingMode` handler.
	const [ labelEditingMode, setLabelEditingMode ] = useState( false );

	const blockInformation = useBlockDisplayInformation( clientId );
	const blockTitle = useBlockDisplayTitle( {
		clientId,
		context: 'list-view',
	} );

	const [ inputValue, setInputValue ] = useState( blockTitle );
	const { isLocked } = useBlockLock( clientId );
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const { blockName, blockAttributes } = useSelect(
		( select ) => {
			const blockObject = select( blockEditorStore ).getBlock( clientId );
			return {
				blockName: blockObject?.name,
				blockAttributes: blockObject?.attributes,
			};
		},
		[ clientId ]
	);

	const supportsBlockNaming = hasBlockMetadataSupport(
		blockName,
		'name',
		false
	);

	const toggleLabelEditingMode = ( value ) => {
		if ( ! supportsBlockNaming ) {
			return;
		}

		setLabelEditingMode( value );
	};

	// The `href` attribute triggers the browser's native HTML drag operations.
	// When the link is dragged, the element's outerHTML is set in DataTransfer object as text/html.
	// We need to clear any HTML drag data to prevent `pasteHandler` from firing
	// inside the `useOnBlockDrop` hook.
	const onDragStartHandler = ( event ) => {
		event.dataTransfer.clearData();
		onDragStart?.( event );
	};

	function onKeyDownHandler( event ) {
		// Handle default mode.
		if (
			! labelEditingMode &&
			( event.keyCode === ENTER || event.keyCode === SPACE )
		) {
			onClick( event );
		}

		// Handle Label editing mode.
		if ( labelEditingMode ) {
			// Trap events to input when editing to avoid
			// default list view key handing (e.g. arrow
			// keys for navigation).
			event.stopPropagation();

			// Handle ENTER and ESC exits editing mode.
			if ( event.keyCode === ENTER || event.keyCode === ESCAPE ) {
				if ( event.keyCode === ENTER ) {
					// Submit changes only for ENTER.
					updateBlockAttributes( clientId, {
						// Include existing metadata (if present) to avoid overwriting existing.
						__experimentalMetadata: {
							...( blockAttributes?.__experimentalMetadata &&
								blockAttributes?.__experimentalMetadata ),
							name: inputValue,
						},
					} );
				}
				toggleLabelEditingMode( false );
			}
		}
	}

	useEffect( () => {
		if ( labelEditingMode ) {
			// Focus and select all text on entering label editing mode.
			inputRef?.current?.focus();
			inputRef?.current?.select();
		}
	}, [ labelEditingMode ] );

	// The `isSelected` check ensures the `BlockSettingsMenuControls` fill
	// doesn't render multiple times. The block controls has similar internal check.
	const shouldRenderEditLabelMenuControl = isSelected;

	return (
		<>
			<Button
				className={ classnames(
					'block-editor-list-view-block-select-button',
					className,
					{
						'has-block-naming-support': supportsBlockNaming,
					}
				) }
				onClick={ ( event ) => {
					// Avoid click delays for blocks that don't support naming interaction.
					if ( ! supportsBlockNaming ) {
						onClick( event );
						return;
					}

					clearTimeout( clickHandlerTimer.current );

					if ( labelEditingMode ) {
						event.preventDefault();
						event.stopPropagation();
						return;
					}

					if ( event.detail === SINGLE_CLICK ) {
						clickHandlerTimer.current = setTimeout( () => {
							onClick( event );
						}, 200 );
					} else if ( event.detail === DOUBLE_CLICK ) {
						toggleLabelEditingMode( true );
					}
				} }
				onKeyDown={ onKeyDownHandler }
				ref={ ref }
				tabIndex={ tabIndex }
				onFocus={ onFocus }
				onDragStart={ onDragStartHandler }
				onDragEnd={ onDragEnd }
				draggable={ draggable }
				href={ `#block-${ clientId }` }
				aria-hidden={ true }
			>
				<ListViewExpander onClick={ onToggleExpanded } />
				<BlockIcon icon={ blockInformation?.icon } showColors />
				<HStack
					alignment="center"
					className="block-editor-list-view-block-select-button__label-wrapper"
					justify="flex-start"
					spacing={ 1 }
				>
					<span className="block-editor-list-view-block-select-button__title">
						{ supportsBlockNaming && labelEditingMode ? (
							<InputControl
								ref={ inputRef }
								value={ inputValue }
								onChange={ ( nextValue ) => {
									setInputValue( nextValue ?? '' );
								} }
								onBlur={ () => {
									toggleLabelEditingMode( false );
								} }
							/>
						) : (
							<Truncate ellipsizeMode="auto">
								{ blockTitle }
							</Truncate>
						) }
					</span>
					{ blockInformation?.anchor && (
						<span className="block-editor-list-view-block-select-button__anchor">
							{ blockInformation.anchor }
						</span>
					) }
					{ isLocked && (
						<span className="block-editor-list-view-block-select-button__lock">
							<Icon icon={ lock } />
						</span>
					) }
				</HStack>

				{ shouldRenderEditLabelMenuControl && (
					<BlockSettingsMenuControls>
						{ () => (
							<MenuItem
								disabled={ ! supportsBlockNaming }
								onClick={ () => {
									toggleLabelEditingMode( true );
								} }
							>
								{ __( 'Edit label' ) }
							</MenuItem>
						) }
					</BlockSettingsMenuControls>
				) }
			</Button>
		</>
	);
}

export default forwardRef( ListViewBlockSelectButton );

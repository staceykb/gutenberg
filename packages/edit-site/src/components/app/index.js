/**
 * WordPress dependencies
 */
import { SlotFillProvider } from '@wordpress/components';
import { Suspense } from '@wordpress/element';
import { UnsavedChangesWarning } from '@wordpress/editor';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { PluginArea } from '@wordpress/plugins';
import { Icon, wordpress } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { Routes } from '../routes';
import Editor from '../editor';
import List from '../list';
import NavigationSidebar from '../navigation-sidebar';
import getIsListPage from '../../utils/get-is-list-page';

const LoadingScreen = () => (
	<div
		style={ {
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			background: '#fff',
			zIndex: 999999,
		} }
	>
		<div
			style={ {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				height: '100%',
			} }
		>
			<Icon
				icon={ wordpress }
				size="96"
				style={ {
					animation: 'loadingpulse 1s linear infinite',
				} }
			/>
		</div>
	</div>
);

export default function EditSiteApp( { reboot } ) {
	const { createErrorNotice } = useDispatch( noticesStore );

	function onPluginAreaError( name ) {
		createErrorNotice(
			sprintf(
				/* translators: %s: plugin name */
				__(
					'The "%s" plugin has encountered an error and cannot be rendered.'
				),
				name
			)
		);
	}

	return (
		<SlotFillProvider>
			<UnsavedChangesWarning />

			<Suspense fallback={ <LoadingScreen /> }>
				<Routes>
					{ ( { params } ) => {
						const isListPage = getIsListPage( params );

						return (
							<>
								{ isListPage ? (
									<List />
								) : (
									<Editor onError={ reboot } />
								) }
								<PluginArea onError={ onPluginAreaError } />
								{ /* Keep the instance of the sidebar to ensure focus will not be lost
								 * when navigating to other pages. */ }
								<NavigationSidebar
									// Open the navigation sidebar by default when in the list page.
									isDefaultOpen={ !! isListPage }
									activeTemplateType={
										isListPage ? params.postType : undefined
									}
								/>
							</>
						);
					} }
				</Routes>
			</Suspense>
		</SlotFillProvider>
	);
}

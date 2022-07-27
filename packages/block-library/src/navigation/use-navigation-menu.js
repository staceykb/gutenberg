/**
 * WordPress dependencies
 */
import {
	store as coreStore,
	__experimentalUseResourcePermissions as useResourcePermissions,
} from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default function useNavigationMenu( ref ) {
	const permissions = useResourcePermissions( 'navigation', ref );

	return useSelect(
		( select ) => {
			const [
				hasResolvedPermissions,
				{ canCreate, canUpdate, canDelete, isResolving },
			] = permissions;

			const {
				navigationMenus,
				isResolvingNavigationMenus,
				hasResolvedNavigationMenus,
			} = selectNavigationMenus( select, ref );

			const {
				navigationMenu,
				isNavigationMenuResolved,
				isNavigationMenuMissing,
			} = selectExistingMenu( select, ref );

			return {
				navigationMenus,
				isResolvingNavigationMenus,
				hasResolvedNavigationMenus,

				navigationMenu,
				isNavigationMenuResolved,
				isNavigationMenuMissing,

				canSwitchNavigationMenu: ref
					? navigationMenus?.length > 1
					: navigationMenus?.length > 0,

				canUserCreateNavigationMenu: canCreate,
				isResolvingCanUserCreateNavigationMenu: isResolving,
				hasResolvedCanUserCreateNavigationMenu: hasResolvedPermissions,

				canUserUpdateNavigationMenu: canUpdate,
				hasResolvedCanUserUpdateNavigationMenu: ref
					? hasResolvedPermissions
					: undefined,

				canUserDeleteNavigationMenu: canDelete,
				hasResolvedCanUserDeleteNavigationMenu: ref
					? hasResolvedPermissions
					: undefined,
			};
		},
		[ ref, permissions ]
	);
}

function selectNavigationMenus( select ) {
	const { getEntityRecords, hasFinishedResolution, isResolving } =
		select( coreStore );

	const args = [
		'postType',
		'wp_navigation',
		{ per_page: -1, status: 'publish' },
	];
	return {
		navigationMenus: getEntityRecords( ...args ),
		isResolvingNavigationMenus: isResolving( 'getEntityRecords', args ),
		hasResolvedNavigationMenus: hasFinishedResolution(
			'getEntityRecords',
			args
		),
	};
}

function selectExistingMenu( select, ref ) {
	if ( ! ref ) {
		return {
			isNavigationMenuResolved: false,
			isNavigationMenuMissing: true,
		};
	}

	const { getEntityRecords, getEditedEntityRecords, hasFinishedResolution } =
		select( coreStore );

	const args = [
		'postType',
		'wp_navigation',
		{
			slug: ref, // ref is the post.slug field
		},
	];
	const navigationMenu = getEntityRecords( ...args )[ 0 ];
	const editedNavigationMenu = getEditedEntityRecords( ...args )[ 0 ];
	const hasResolvedNavigationMenu = hasFinishedResolution(
		'getEditedEntityRecords',
		args
	);

	console.log( { navigationMenu } );
	return {
		isNavigationMenuResolved: hasResolvedNavigationMenu,
		isNavigationMenuMissing: hasResolvedNavigationMenu && ! navigationMenu,

		// getEditedEntityRecord will return the post regardless of status.
		// Therefore if the found post is not published then we should ignore it.
		navigationMenu:
			editedNavigationMenu.status === 'publish'
				? editedNavigationMenu
				: null,
	};
}

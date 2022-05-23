/**
 * External dependencies
 */
import { every } from 'lodash';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Shortcode transforms don't currently have a tranform method and so can't use a selector to
 * retrieve the data for each image being transformer, so this selector handle this post transformation.
 *
 * @param {Array} shortCodeTransforms An array of image data passed from the shortcode transform.
 *
 * @return {Array} An array of extended image data objects for each of the shortcode transform images.
 */
export default function useShortCodeTransform( shortCodeTransforms ) {
	const newImageData = useSelect(
		( select ) => {
			if ( ! shortCodeTransforms || shortCodeTransforms.length === 0 ) {
				return;
			}

			const imageIds = shortCodeTransforms.map( ( image ) => image.id );

			return select( coreStore ).getMediaItems( {
				include: imageIds.join( ',' ),
				per_page: imageIds.length,
				orderby: 'include',
			} );
		},
		[ shortCodeTransforms ]
	);

	if ( ! newImageData ) {
		return;
	}

	if ( every( newImageData, ( img ) => img && img.source_url ) ) {
		return newImageData.map( ( imageData ) => {
			return {
				id: imageData.id,
				type: 'image',
				url: imageData.source_url,
				mime: imageData.mime_type,
				alt: imageData.alt_text,
				link: imageData.link,
				caption: imageData?.caption?.raw,
			};
		} );
	}
}

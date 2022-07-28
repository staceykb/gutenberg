/**
 * External dependencies
 */
const path = require( 'path' );
const fs = require( 'fs/promises' );

/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Paragraph', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllMedia();
	} );

	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test.afterEach( async ( { requestUtils } ) => {
		await Promise.all( [
			requestUtils.deleteAllPosts(),
			requestUtils.deleteAllMedia(),
		] );
	} );

	test( 'should output unwrapped editable paragraph', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( {
			name: 'core/paragraph',
		} );
		await page.keyboard.type( '1' );

		const firstBlockTagName = await page.evaluate( () => {
			return document.querySelector(
				'.block-editor-block-list__layout .wp-block'
			).tagName;
		} );

		// The outer element should be a paragraph. Blocks should never have any
		// additional div wrappers so the markup remains simple and easy to
		// style.
		expect( firstBlockTagName ).toBe( 'P' );
	} );

	test( 'should allow dropping an image on en empty paragraph block', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'core/paragraph' } );
		const emptyParagraphBlock = page.locator(
			'[data-type="core/paragraph"]'
		);

		const testImagePath = path.join(
			__dirname,
			'../../../assets/10x10_e2e_test_image_z9T8jK.png'
		);
		const testImage = await fs.readFile( testImagePath, 'base64' );
		const dataTransfer = await page.evaluateHandle(
			async ( [ base64 ] ) => {
				const blobResponse = await window.fetch(
					`data:image/png;base64,${ base64 }`
				);
				const blob = await blobResponse.blob();
				const file = new window.File( [ blob ], 'test-image.png', {
					type: 'image/png',
				} );
				const dt = new window.DataTransfer();
				dt.items.add( file );
				return dt;
			},
			[ testImage ]
		);

		const dropZone = emptyParagraphBlock.locator(
			'[data-is-drop-zone="true"]'
		);
		// Simulate dragging from outside the browser.
		await page.dispatchEvent( 'html', 'dragenter', { dataTransfer } );
		await dropZone.dispatchEvent( 'dragenter', { dataTransfer } );

		await expect(
			emptyParagraphBlock.locator( 'text="Drop files to upload"' )
		).toBeVisible();

		await dropZone.dispatchEvent( 'drop', { dataTransfer } );

		const imageBlock = page.locator(
			'role=document[name="Block: Image"i]'
		);
		await expect( imageBlock ).toBeVisible();
		await expect( imageBlock.locator( 'role=img' ) ).toHaveAttribute(
			'src',
			/test-image\.png$/
		);
	} );
} );

/**
 * External dependencies
 */
import React from 'react';
import { View } from 'react-native';

/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	subscribeMediaUpload,
	subscribeMediaSave,
} from '@wordpress/react-native-bridge';

/**
 * Internal dependencies
 */
import styles from './styles.scss';

export const STORY_SAVE_STATE_SAVING = 1;
export const STORY_SAVE_STATE_SUCCEEDED = 2;
export const STORY_SAVE_STATE_FAILED = 3;
export const STORY_SAVE_STATE_RESET = 4;

export const STORY_UPLOAD_STATE_UPLOADING = 5;
export const STORY_UPLOAD_STATE_SUCCEEDED = 6;
export const STORY_UPLOAD_STATE_FAILED = 7;
export const STORY_UPLOAD_STATE_RESET = 8;

export class StoryUpdateProgress extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			progress: 0,
			isSaveInProgress: false,
			isSaveFailed: false,
			isUploadInProgress: false,
			isUploadFailed: false,
		};

		this.mediaUpload = this.mediaUpload.bind( this );
		this.mediaSave = this.mediaSave.bind( this );
	}

	componentDidMount() {
		this.addMediaUploadListener();
		this.addMediaSaveListener();
	}

	componentWillUnmount() {
		this.removeMediaUploadListener();
		this.removeMediaSaveListener();
	}

	mediaIdContainedInMediaFiles( mediaId, mediaFiles ) {
		// TODO check here
		if ( mediaId !== undefined && mediaFiles !== undefined ) {
			return true;
		}
		return false;
	}

	mediaUpload( payload ) {
		const { mediaFiles } = this.props;

		if (
			this.mediaIdContainedInMediaFiles( payload.mediaId, mediaFiles ) ===
			false
		) {
			return;
		}
		// if ( payload.mediaId !== mediaId ) {
		// 	return;
		// }

		switch ( payload.state ) {
			case STORY_UPLOAD_STATE_UPLOADING:
				this.updateMediaProgress( payload );
				break;
			case STORY_UPLOAD_STATE_SUCCEEDED:
				this.finishMediaUploadWithSuccess( payload );
				break;
			case STORY_UPLOAD_STATE_FAILED:
				this.finishMediaUploadWithFailure( payload );
				break;
			case STORY_UPLOAD_STATE_RESET:
				this.mediaUploadStateReset( payload );
				break;
		}
	}

	mediaSave( payload ) {
		const { mediaFiles } = this.props;

		if (
			this.mediaIdContainedInMediaFiles( payload.mediaId, mediaFiles ) ===
			false
		) {
			return;
		}
		// if ( payload.mediaId !== mediaId ) {
		// 	return;
		// }

		switch ( payload.state ) {
			case STORY_SAVE_STATE_SAVING:
				this.updateMediaSaveProgress( payload );
				break;
			case STORY_SAVE_STATE_SUCCEEDED:
				this.finishMediaSaveWithSuccess( payload );
				break;
			case STORY_SAVE_STATE_FAILED:
				this.finishMediaSaveWithFailure( payload );
				break;
			case STORY_SAVE_STATE_RESET:
				this.mediaUploadStateReset( payload );
				break;
		}
	}

	// ---- Story (media) save actions
	updateMediaSaveProgress( payload ) {
		this.setState( {
			progress: payload.progress,
			isUploadInProgress: false,
			isUploadFailed: false,
			isSaveInProgress: true,
			isSaveFailed: false,
		} );
		if ( this.props.onUpdateMediaSaveProgress ) {
			this.props.onUpdateMediaSaveProgress( payload );
		}
	}

	finishMediaSaveWithSuccess( payload ) {
		this.setState( { isSaveInProgress: false } );
		if ( this.props.onFinishMediaSaveWithSuccess ) {
			this.props.onFinishMediaSaveWithSuccess( payload );
		}
	}

	finishMediaSaveWithFailure( payload ) {
		this.setState( { isSaveInProgress: false, isSaveFailed: true } );
		if ( this.props.onFinishMediaUploadWithFailure ) {
			this.props.onFinishMediaUploadWithFailure( payload );
		}
	}

	mediaSaveStateReset( payload ) {
		this.setState( { isUploadInProgress: false, isUploadFailed: false } );
		if ( this.props.onMediaSaveStateReset ) {
			this.props.onMediaSaveStateReset( payload );
		}
	}

	// ---- Story upload actions
	updateMediaProgress( payload ) {
		this.setState( {
			progress: payload.progress,
			isUploadInProgress: true,
			isUploadFailed: false,
			isSaveInProgress: false,
			isSaveFailed: false,
		} );
		if ( this.props.onUpdateMediaProgress ) {
			this.props.onUpdateMediaProgress( payload );
		}
	}

	finishMediaUploadWithSuccess( payload ) {
		this.setState( { isUploadInProgress: false, isSaveInProgress: false } );
		if ( this.props.onFinishMediaUploadWithSuccess ) {
			this.props.onFinishMediaUploadWithSuccess( payload );
		}
	}

	finishMediaUploadWithFailure( payload ) {
		this.setState( { isUploadInProgress: false, isUploadFailed: true } );
		if ( this.props.onFinishMediaUploadWithFailure ) {
			this.props.onFinishMediaUploadWithFailure( payload );
		}
	}

	mediaUploadStateReset( payload ) {
		this.setState( { isUploadInProgress: false, isUploadFailed: false } );
		if ( this.props.onMediaUploadStateReset ) {
			this.props.onMediaUploadStateReset( payload );
		}
	}

	addMediaUploadListener() {
		//if we already have a subscription not worth doing it again
		if ( this.subscriptionParentMediaUpload ) {
			return;
		}
		this.subscriptionParentMediaUpload = subscribeMediaUpload(
			( payload ) => {
				this.mediaUpload( payload );
			}
		);
	}

	removeMediaUploadListener() {
		if ( this.subscriptionParentMediaUpload ) {
			this.subscriptionParentMediaUpload.remove();
		}
	}

	addMediaSaveListener() {
		//if we already have a subscription not worth doing it again
		if ( this.subscriptionParentMediaSave ) {
			return;
		}
		this.subscriptionParentMediaSave = subscribeMediaSave( ( payload ) => {
			this.mediaSave( payload );
		} );
	}

	removeMediaSaveListener() {
		if ( this.subscriptionParentMediaSave ) {
			this.subscriptionParentMediaSave.remove();
		}
	}

	render() {
		const { renderContent = () => null } = this.props;
		const {
			isUploadInProgress,
			isUploadFailed,
			isSaveInProgress,
			isSaveFailed,
		} = this.state;
		const showSpinner =
			this.state.isUploadInProgress || this.state.isSaveInProgress;
		const progress = this.state.progress * 100;
		// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
		const retryMessage = __(
			'Failed to insert media.\nPlease tap for options.'
		);

		return (
			<View style={ styles.mediaUploadProgress } pointerEvents="box-none">
				{ showSpinner && (
					<View style={ styles.progressBar }>
						<Spinner progress={ progress } />
					</View>
				) }
				{ renderContent( {
					isUploadInProgress,
					isUploadFailed,
					isSaveInProgress,
					isSaveFailed,
					retryMessage,
				} ) }
			</View>
		);
	}
}

export default StoryUpdateProgress;

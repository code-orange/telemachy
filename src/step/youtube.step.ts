import { TourStep } from './tourstep';

/**
 * Tour step that shows a Youtube video in the middle of the page
 */
export class YoutubeTourStep extends TourStep {
	/**
	 * Video id
	 */
	public video: string;

	public constructor(video: string) {
		super();
		this.video = video;
	}
}

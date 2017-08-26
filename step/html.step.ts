import { TourStep } from './tourstep';

/**
 * Tour step that shows some HTML in the middle of the page
 */
export class HTMLTourStep extends TourStep {
	/**
	 * HTML to display in this step
	 */
	public body: string;

	public constructor(body: string) {
		super();
		this.body = body;
	}
}

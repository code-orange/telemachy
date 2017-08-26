import { TourStep } from './tourstep';

/**
 * Tour step that highlights an element on the page with some explanation
 */
export class ElementTourStep extends TourStep {
	/**
	 * Element to highlight
	 */
	public domElement: Element;
	/**
	 * HTML to display in this step
	 */
	public body: string;

	public constructor(selector: string, body: string) {
		super();
		this.domElement = window.document.querySelector(selector);
		if (!(this.domElement instanceof Element)) {
			throw new Error("Couldn't find the element you selected");
		}
		this.body = body;
	}
}

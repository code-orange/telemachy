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

	public constructor(selector: string, body: string, async?: boolean) {
		super();
		this.domElement = window.document.querySelector(selector);
		if (!(this.domElement instanceof Element)) {
			if (async) {
				let timeout = 100;
				var retry = () => {
					// Give up eventually
					if (timeout <= 2000) {
						this.domElement = window.document.querySelector(selector);
						if (!(this.domElement instanceof Element)) {
							timeout *= 2;
							setTimeout(retry, timeout);
						}
					}
				};
				setTimeout(retry, timeout);
			} else {
				throw new Error("Couldn't find the element you selected");
			}
		}
		this.body = body;
	}

	//region DOM position helpers
	get top(): string {
		if (!this.domElement) {
			return '0';
		}
		return this.domElement.getBoundingClientRect().top + 'px';
	}
	get bottom(): string {
		if (!this.domElement) {
			return '0';
		}
		return this.domElement.getBoundingClientRect().bottom + 'px';
	}
	get left(): string {
		if (!this.domElement) {
			return '0';
		}
		return this.domElement.getBoundingClientRect().left + 'px';
	}
	get right(): string {
		if (!this.domElement) {
			return '0';
		}
		return this.domElement.getBoundingClientRect().right + 'px';
	}
	get documentHeight(): string {
		return document.body.scrollHeight + 'px';
	}
	get documentWidth(): string {
		return document.body.scrollWidth + 'px';
	}
	get toBottom(): string {
		if (!this.domElement) {
			return '0';
		}
		return (document.body.scrollHeight - this.domElement.getBoundingClientRect().bottom) + 'px';
	}
	get toRight(): string {
		if (!this.domElement) {
			return '0';
		}
		return (document.body.scrollWidth - this.domElement.getBoundingClientRect().right) + 'px';
	}
	get fromLeft(): string {
		if (!this.domElement) {
			return '0';
		}
		return (document.body.scrollWidth - this.domElement.getBoundingClientRect().left) + 'px';
	}
	get fromTop(): string {
		if (!this.domElement) {
			return '0';
		}
		return (document.body.scrollHeight - this.domElement.getBoundingClientRect().top) + 'px';
	}
	get height(): string {
		if (!this.domElement) {
			return '0';
		}
		return this.domElement.getBoundingClientRect().height + 'px';
	}
	get width(): string {
		if (!this.domElement) {
			return '0';
		}
		return this.domElement.getBoundingClientRect().width + 'px';
	}
	//endregion
}

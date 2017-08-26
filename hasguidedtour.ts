import { TourStep } from './step/tourstep';

export interface HasGuidedTour {
	/**
	 * Return tour steps that should be used to tour this component
	 */
	getTour(): TourStep[];
	/**
	 * Whether or not to autostart the tour for this component when it is navigated to
	 */
	tourAutoStart?: () => boolean;
}
export function componentHasGuidedTour(object: any) : object is HasGuidedTour {
	return 'getTour' in object;
}

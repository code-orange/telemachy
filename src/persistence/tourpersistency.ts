import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class TourPersistency {
	constructor() {
	}

	/**
	 * Whether a tour should be started
	 *
	 * @param componentName Name of the component that the user has arrived at
	 * @returns {Observable<boolean>}
	 */
	public shouldStart(componentName: string): Observable<boolean> {
		if (typeof window === 'undefined') {
			// If we are in a server-side render, never start
			return Observable.of(false);
		}
		if (window.screen.width <= 900) {
			return Observable.of(false);
		}
		return Observable.of(true);
	}

	/**
	 * Finish the tour for a component
	 * @param componentName
	 */
	public finish(componentName: string) {}

	/**
	 * Skip the tour for a component
	 * @param componentName
	 */
	public skip(componentName: string) {}
}

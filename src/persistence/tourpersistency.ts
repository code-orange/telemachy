import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable()
export class TourPersistency {
	constructor() {
	}

	/**
	 * Whether a tour should be started
	 *
	 * @param componentName Name of the component that the user has arrived at
	 */
	public shouldStart(componentName: string): Observable<boolean> {
		if (typeof window === 'undefined') {
			// If we are in a server-side render, never start
			return of(false);
		}
		if (window.screen.width <= 900) {
			return of(false);
		}
		return of(true);
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

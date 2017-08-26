import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { HasGuidedTour, componentHasGuidedTour } from './hasguidedtour';
import { TourStep } from './step/tourstep';
import { TourPersistency } from './persistence/tourpersistency';

interface Component {
	prototype: any
}

@Injectable()
export class TelemachyService {
	constructor(Router: Router, ActivatedRoute: ActivatedRoute, private TourPersistency: TourPersistency) {
		Router.events.subscribe((e) => {
			if (e instanceof NavigationEnd) {
				this.recurseRouteTree(ActivatedRoute.snapshot);
			}
		});
		this.currentTourStep = new Subject<TourStep>();
	}

	private recurseRouteTree = (state: ActivatedRouteSnapshot) => {
		// TODO: Find all, only trigger when it is new
		if (state.component) {
			let c = (state.component as Component).prototype;
			if (componentHasGuidedTour(c) && c.tourAutoStart && c.tourAutoStart()) {
				this.startTour((state.component as Component).prototype as HasGuidedTour);
			}
		}
		state.children.forEach(this.recurseRouteTree);
	};

	private activeTour: TourStep[];
	private activeStep: number = -1;
	private activeComponent: string;

	private currentTourStep: Subject<TourStep>;

	/**
	 * Attempt to start the tour for a component
	 * @param component
	 */
	public startTour(component: HasGuidedTour) {
		// Multiple components might want to get their tour started at the same time
		// We go with the first one that decides it should be loaded and ignore the rest
		this.TourPersistency.shouldStart(component.constructor.name).first().subscribe((shouldStart) => {
			if (shouldStart) {
				// Only start if we are not started
				if (this.activeStep < 0) {
					this.activeTour = component.getTour();
					this.activeStep = 0;
					this.activeComponent = component.constructor.name;

					this.emit();
				}
			}
		});
	}

	public canGoBack(): boolean {
		return this.activeStep >= 1;
	}
	public canFinish(): boolean {
		if (!this.activeTour) {
			return false;
		}
		return this.activeStep === (this.activeTour.length - 1);
	}

	public finish() {
		if (this.canFinish()) {
			this.TourPersistency.finish(this.activeComponent);
			this.reset();
		}
	}
	public skip() {
		this.TourPersistency.skip(this.activeComponent);
		this.reset();
	}
	public next() {
		if (this.activeStep < (this.activeTour.length - 1)) {
			this.activeStep += 1;
		}
		this.emit();
	}
	public previous() {
		if (this.canGoBack()) {
			this.activeStep -= 1;
		}
		this.emit();
	}

	private reset() {
		this.activeTour = null;
		this.activeStep = -1;
		this.activeComponent = null;

		this.emit();
	}

	private emit() {
		if (!this.activeTour) {
			this.currentTourStep.next(null);
		} else {
			this.currentTourStep.next(this.activeTour[this.activeStep]);
		}
	}

	public subscribeStep(generatorOrNext?: any, error?: any, complete?: any) {
		return this.currentTourStep.subscribe(generatorOrNext, error, complete);
	}
}

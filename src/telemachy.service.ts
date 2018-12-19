import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { HasGuidedTour, componentHasGuidedTour } from './hasguidedtour';
import { TourStep } from './step/tourstep';
import { ElementTourStep } from './step/element.step';
import { TourPersistency } from './persistence/tourpersistency';

interface Component {
	prototype: any
}

@Injectable()
export class TelemachyService {
	constructor(Router: Router, ActivatedRoute: ActivatedRoute, private TourPersistency: TourPersistency) {
		Router.events.subscribe((e) => {
			if (e instanceof NavigationEnd) {
				this.seenComponent = null;
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
				this.seenComponent = c;
				this.startTour(c);
			}
		}
		state.children.forEach(this.recurseRouteTree);
	};

	private activeTour: TourStep[];
	private activeStep: number = -1;
	private activeComponent: string;

	private currentTourStep: Subject<TourStep>;

	private seenComponent: HasGuidedTour;

	private startEventListener: {(): void}[] = [];
	private endEventListener: {(): void}[] = [];

	private startTourForComponent(component: HasGuidedTour) {
		// Only start if we are not started
		if (this.activeStep < 0) {
			this.startEventListener.forEach(func => func());
			this.activeTour = component.getTour();
			this.activeStep = 0;
			this.activeComponent = component.constructor.name;

			this.emit();
		}
	}

	/**
	 * Attempt to start the tour for a component
	 * @param component
	 */
	public startTour(component: HasGuidedTour) {
		// Multiple components might want to get their tour started at the same time
		// We go with the first one that decides it should be loaded and ignore the rest
		this.TourPersistency.shouldStart(component.constructor.name).pipe(first()).subscribe((shouldStart: any) => {
			if (shouldStart) {
				this.startTourForComponent(component);
			}
		});
	}

	/**
	 * Indicates if there is a tour that could be restarted
	 */
	public canRestart(): boolean {
		return ((this.activeStep === -1) && (!!this.seenComponent));
	}

	/**
	 * Restarts the tour for a component (no guarantee which) that is visible right now
	 */
	public restartTour() {
		this.startTourForComponent(this.seenComponent);
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
	public scrollViewport(step: any) {
		const rightBound = (window.pageXOffset + window.innerWidth) - parseInt(step.right);
		const leftBound = parseInt(step.left) - window.pageXOffset;
		if(rightBound < 0) {
			window.scrollTo(parseInt(step.left), 0);
		}
		if(leftBound < 0) {
			window.scrollTo(parseInt(step.left), 0);
		}
	}
	public next() {
		if (this.activeStep < (this.activeTour.length - 1)) {
			this.activeStep += 1;

			// Workaround for broken elements, just skip ahead
			if (this.activeTour[this.activeStep] instanceof ElementTourStep && !(this.activeTour[this.activeStep] as ElementTourStep).domElement) {
				if (this.canFinish()) {
					this.finish();
				} else {
					this.next();
				}
			}
		}
		this.emit();
		const step = this.activeTour[this.activeStep];
		this.scrollViewport(step);
	}
	public previous() {
		if (this.canGoBack()) {
			this.activeStep -= 1;

			// Workaround for broken elements, just skip back or stay in the same position
			if (this.activeTour[this.activeStep] instanceof ElementTourStep && !(this.activeTour[this.activeStep] as ElementTourStep).domElement) {
				if (this.canGoBack()) {
					this.previous();
				} else {
					this.next();
				}
			}
		}
		this.emit();
		const step = this.activeTour[this.activeStep];
		this.scrollViewport(step);
	}

	private reset() {
		this.activeTour = null;
		this.activeStep = -1;
		this.activeComponent = null;
		this.emit();
		this.endEventListener.forEach(func => func());
	}

	private emit() {
		if (!this.activeTour) {
			this.currentTourStep.next(null);
		} else {
			this.currentTourStep.next(this.activeTour[this.activeStep]);
		}
	}

	public subscribeStep(generatorOrNext?: any, error?: any, complete?: any): Subscription {
		return this.currentTourStep.subscribe(generatorOrNext, error, complete);
	}

	public get progress(): number {
		return this.activeStep + 1;
	}
	public get total(): number {
		return this.activeTour.length;
	}

	public addEventListener(type: string, listener: () => void) {
		if(type == 'start') {
			this.startEventListener.push(listener);
		}
		if(type == 'end') {
			this.endEventListener.push(listener);
		}
	}

	public removeEventListener(type: string, listener: () => void) {
		if(type == 'start') {
			const index = this.startEventListener.indexOf(listener);
			this.startEventListener.splice(index, 1);
		}
		if(type == 'end') {
			const index = this.endEventListener.indexOf(listener);
			this.endEventListener.splice(index, 1);
		}
	}

	public removeAllEventListeners() {
		this.startEventListener = [];
		this.endEventListener = [];
	}
}

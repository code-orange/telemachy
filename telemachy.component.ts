import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { TelemachyService } from './telemachy.service';
import { TourStep } from './step/tourstep';

@Component({
	selector: 'telemachy-tour',
	template: `
		<pre *ngIf="step">{{step.constructor.name}} {{step | json}}</pre>
		<button *ngIf="canGoBack()" (click)="previous()">Previous</button>
		<button *ngIf="!canFinish()" (click)="next()">Next</button>
		<button *ngIf="canFinish()" (click)="finish()">Finish</button>
		<button (click)="skip()">Skip</button>
		`,
	styles: [

	]
})
export class TelemachyTourComponent implements OnInit, OnDestroy {
	private sub: Subscription;
	public step: TourStep;

	constructor(private TelemachyService: TelemachyService) {}

	ngOnInit() {
		this.sub = this.TelemachyService.subscribeStep((step: TourStep) => {
			this.step = step;
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	public canGoBack(): boolean {
		return this.TelemachyService.canGoBack();
	}
	public canFinish(): boolean {
		return this.TelemachyService.canFinish();
	}

	public finish() {
		return this.TelemachyService.finish();
	}
	public skip() {
		return this.TelemachyService.skip();
	}
	public next() {
		return this.TelemachyService.next();
	}
	public previous() {
		return this.TelemachyService.previous();
	}
}

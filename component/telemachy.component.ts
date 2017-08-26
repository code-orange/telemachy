import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from '../../../node_modules/rxjs/Subscription.d';

import { TelemachyService } from './../telemachy.service';
import { TourStep } from './../step/tourstep';
import { YoutubeTourStep } from './../step/youtube.step';
import { HTMLTourStep } from './../step/html.step';
import { ElementTourStep } from './../step/element.step';

@Component({
	selector: 'telemachy-tour',
	templateUrl: './telemachy.component.html',
	styleUrls: ['./telemachy.component.css']
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

	public isYoutube(step: TourStep) {
		return step instanceof YoutubeTourStep;
	}
	public isHtml(step: TourStep) {
		return step instanceof HTMLTourStep;
	}
	public isElement(step: TourStep) {
		return step instanceof ElementTourStep;
	}

	public get progress(): number {
		return this.TelemachyService.progress;
	}
	public get total(): number {
		return this.TelemachyService.total;
	}
}

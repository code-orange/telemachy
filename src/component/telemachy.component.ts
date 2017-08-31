import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

	private cachedVideoId: string;
	private cachedVideoResource: SafeResourceUrl;

	constructor(private TelemachyService: TelemachyService, private DomSanitizer: DomSanitizer) {}

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

	public get documentWidth(): string {
		return document.body.scrollWidth + 'px';
	}
	public get documentHeight(): string {
		return document.body.scrollHeight + 'px';
	}


	public getVideoUrl() {
		let video = (this.step as YoutubeTourStep).video;
		if (this.cachedVideoId === video) {
			return this.cachedVideoResource;
		}
		this.cachedVideoId = video;
		this.cachedVideoResource = this.DomSanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + '?rel=0');
		return this.cachedVideoResource;
	}

	public onKey($event: KeyboardEvent) {
		if ($event.key === "ArrowRight") {
			this.next();
		} else if ($event.key === "ArrowLeft") {
			this.previous();
		}
	}
}

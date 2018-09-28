import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocalStorageService } from 'angular-2-local-storage';

import { TourPersistency } from './tourpersistency';

const TOUR_PREFIX = 'telemachy_tour_';

@Injectable()
export class LocalstorageTourPersistency extends TourPersistency {
	constructor(private ls: LocalStorageService) {
		super();
	}

	public shouldStart(componentName:string):Observable<boolean> {
		return super.shouldStart(componentName).pipe(
			map((shouldStart: boolean) => {
				return shouldStart && !this.ls.get(this.keyFor(componentName));
			})
		);
	}

	public finish(componentName:string) {
		this.ls.set(this.keyFor(componentName), 'finished');
	}

	public skip(componentName:string) {
		this.ls.set(this.keyFor(componentName), 'skipped');
	}

	private keyFor(componentName: string): string {
		return TOUR_PREFIX + componentName;
	}
}

export function LocalstorageTourPersistencyFactory(LocalStorageService: LocalStorageService) {
	return new LocalstorageTourPersistency(LocalStorageService);
}

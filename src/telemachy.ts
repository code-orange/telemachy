// TODO: Move this to a separate package
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HasGuidedTour } from './hasguidedtour';
import { TelemachyService } from './telemachy.service';
import { TelemachyTourComponent } from './component/telemachy.component';

import { TourPersistency } from './persistence/tourpersistency';
import { LocalstorageTourPersistency, LocalstorageTourPersistencyFactory } from './persistence/localstorage';

import { TourStep } from './step/tourstep';
import { ElementTourStep } from './step/element.step';
import { HTMLTourStep } from './step/html.step';
import { YoutubeTourStep } from './step/youtube.step';

@NgModule({
	imports: [CommonModule],
	providers: [TourPersistency, TelemachyService],
	declarations: [TelemachyTourComponent],
	exports: [TelemachyTourComponent]
})
class TelemachyModule {}

export { TelemachyModule, HasGuidedTour, TourPersistency, LocalstorageTourPersistency, LocalstorageTourPersistencyFactory, TourStep, ElementTourStep, HTMLTourStep, YoutubeTourStep, TelemachyService, TelemachyTourComponent};

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { reducers } from './core/store/reducers';
import { StatusEffects } from './core/store/status/effects';
import { ScheduleEffects } from './core/store/schedule/effects';
import { CoreModule } from './core/core.module';

export const APP_IMPORTS = [
	BrowserModule,
	HttpModule,
	FormsModule,
	StoreModule.forRoot(reducers),
	EffectsModule.forRoot([
		StatusEffects,
		ScheduleEffects,
	]),
	CoreModule.forRoot(),
];

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';
import { reducers } from './core/store/reducers';
import { ScheduleEffects } from './core/store/schedule/effects';
import { StatusEffects } from './core/store/status/effects';

export const storeDevTools = environment.production ?
	[] :
	StoreDevtoolsModule.instrument({ maxAge: 25 });

export const APP_IMPORTS = [
	BrowserModule,
	HttpClientModule,
	FormsModule,
	StoreModule.forRoot(reducers),
	EffectsModule.forRoot([
		StatusEffects,
		ScheduleEffects,
	]),
	storeDevTools,
	CoreModule.forRoot(),
];

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { reducers } from './core/store/reducers';
import { StatusEffects } from './core/store/status/effects';
import { ScheduleEffects } from './core/store/schedule/effects';

// import { AppRoutingModule } from './app-routing.module';

// import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
// import { SubSectionModule } from './sub-section/sub-section.module';
// import { ProfileModule } from './profile/profile.module';

export const APP_IMPORTS = [
	BrowserModule,
	HttpModule,
	FormsModule,
	StoreModule.forRoot(reducers),
	EffectsModule.forRoot([
		StatusEffects,
		ScheduleEffects,
	]),

	// AppRoutingModule,
	CoreModule.forRoot(),

	// AuthModule,
	// SubSectionModule,
	// ProfileModule,
];

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { MaterialModule } from './material.module';
import { ScheduleService } from './store/schedule/service';
import { StatusService } from './store/status/service';

@NgModule({
	imports: [
		CommonModule,
	],
	exports: [
		MaterialModule,
	],
})
export class CoreModule {
	public static forRoot(): ModuleWithProviders {
		return {
			ngModule: CoreModule,
			providers: [
				StatusService,
				ScheduleService,
			],
		};
	}
}

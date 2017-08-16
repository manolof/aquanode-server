import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material.module';
import { StatusService } from './store/status/service';
import { ScheduleService } from './store/schedule/service';

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

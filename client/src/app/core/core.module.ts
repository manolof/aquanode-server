import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { MaterialModule } from './material.module';
import { ScheduleService } from './store/schedule/service';
import { StatusService } from './store/status/service';

@NgModule({
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

	/**
	 * Prevent CoreModule from being imported more than once.
	 * See https://angular.io/guide/styleguide#prevent-re-import-of-the-core-module
	 *
	 * @param {CoreModule} parentModule
	 */
	constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
		if (parentModule) {
			throw new Error('CoreModule has already been loaded. ' +
				'Import CoreModule only in the AppModule!');
		}
	}
}

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { APP_IMPORTS } from './app.imports';
import { APP_DECLARATIONS } from './app.declarations';

@NgModule({
	imports: APP_IMPORTS,
	declarations: APP_DECLARATIONS,
	// providers: APP_PROVIDERS,
	bootstrap: [AppComponent]
})
export class AppModule {
}

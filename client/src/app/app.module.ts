import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { APP_DECLARATIONS } from './app.declarations';
import { APP_IMPORTS } from './app.imports';

@NgModule({
	imports: APP_IMPORTS,
	declarations: APP_DECLARATIONS,
	bootstrap: [AppComponent]
})
export class AppModule {
}


// Import the core angular services.
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

// Import the application components and services.
import { AppComponent } from "./app.component";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

var routes: Routes = [];

/*

	/app/preview  =>
	/app/preview/breadboard/:id

	/app/build/breadboard/:id/view
	/app/build/breadboard/:id/edit --> the breadboard itself?
	/app/build/breadboard/:id/items/add/:type
	/app/build/breadboard/:id/items/edit/:id



*/

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@NgModule({
	imports: [
		BrowserModule,
		RouterModule.forRoot( routes )
	],
	providers: [],
	declarations: [
		AppComponent
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {
	// ...
}

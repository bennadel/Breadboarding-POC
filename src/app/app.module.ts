
// Import the core angular services.
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";

// Import the application components and services.
import { AppComponent } from "./app.component";
import { BuildView } from "./views/build-view/build-view.module";
import { PreviewView } from "./views/preview-view/preview-view.module";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// When we included a routable view into the router tree, we have to define the routes
// and, SOMETIMES, import the view modules (when statically loaded). In order to keep
// the routing semantics consistent across our views, I'm pushing both the ROUTE and
// MODULE definitions into the subview. This way, the parent context always SPREADS both
// the modules (into the imports) and the routes (into the RouterModule) into its own
// definition. This allows a module to switch from statically loaded to lazy loaded
// without the parent context having to know about it.
export interface RoutableView {
	modules: any[],
	routes: Routes
}

@NgModule({
	imports: [
		BrowserModule,

		// NOTE: When a routing module is statically included, then the routing module
		// needs to be explicitly imported. In order to not worry about this divergence,
		// let's let the child module define the importable modules (which may or may
		// not be an EMPTY ARRAY - empty if lazy-loaded).
		...BuildView.modules,
		...PreviewView.modules,

		RouterModule.forRoot(
			/*
				/app/preview  =>
				/app/preview/breadboard/:id

				/app/build/breadboard/:id/view
				/app/build/breadboard/:id/edit --> the breadboard itself?
				/app/build/breadboard/:id/items/add/:type
				/app/build/breadboard/:id/items/edit/:id
			*/
			[
				{
					path: "",
					pathMatch: "full",
					redirectTo: "app"
				},
				{
					path: "app",
					children: [
						...BuildView.routes,
						...PreviewView.routes,
						{
							path: "",
							pathMatch: "full",
							redirectTo: "preview"
						}
					]
				}
			],
			{
				// Tell the router to use the hash instead of HTML5 pushstate.
				useHash: true,

				// Enable the Angular 6+ router features for scrolling and anchors.
				scrollPositionRestoration: "enabled",
				anchorScrolling: "enabled",
				enableTracing: false
			}
		)
	],
	providers: [
		// CAUTION: We don't need to specify the LocationStrategy because we are setting
		// the "useHash" property in the Router module above (which will be setting the
		// strategy provider for us).
		// --
		// {
		// 	provide: LocationStrategy,
		// 	useClass: HashLocationStrategy
		// }
	],
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

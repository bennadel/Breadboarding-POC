
// Import the core angular services.
import { NgModule } from "@angular/core";

// Import the application components and services.
import { ViewViewComponent } from "./view-view.component";
import { RoutableView } from "~/app/app.module";
import { SharedModule } from "~/app/shared/shared.module";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		ViewViewComponent
	]
})
export class ViewViewModule {
	// ...
}

export var ViewView: RoutableView = {
	modules: [
		// NOTE: Since this module's routes are being included directly in the parent
		// module's router definition, we need to tell the parent module to import this
		// module. Otherwise, the application won't know about the declared components
		// and services.
		ViewViewModule
	],
	routes: [
		{
			path: "view",
			component: ViewViewComponent
		}
	]
};

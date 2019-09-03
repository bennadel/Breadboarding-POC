
// Import the core angular services.
import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";

// Import the application components and services.
import { PreviewViewComponent } from "./preview-view.component";
import { RoutableView } from "~/app/app.module";
import { SharedModule } from "~/app/shared/shared.module";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		PreviewViewComponent
	]
})
export class PreviewViewModule {
	// ...
}

export var PreviewView: RoutableView = {
	modules: [
		// NOTE: Since this module's routes are being included directly in the parent
		// module's router definition, we need to tell the parent module to import this
		// module. Otherwise, the application won't know about the declared components
		// and services.
		PreviewViewModule
	],
	routes: [
		{
			path: "preview",
			children: [
				{
					path: "",
					pathMatch: "full",
					// Internally, the component will see "first" and then redirect to
					// the first breadboard in the workflow.
					redirectTo: "first"
				},
				{
					path: ":breadboardID",
					component: PreviewViewComponent
				}
			]
		}
	]
};

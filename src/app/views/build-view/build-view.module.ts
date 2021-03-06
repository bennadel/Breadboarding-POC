
// Import the core angular services.
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";

// Import the application components and services.
import { AddActionView } from "./add-action-view/add-action-view.module";
import { AddBreadboardView } from "./add-breadboard-view/add-breadboard-view.module";
import { AddFieldView } from "./add-field-view/add-field-view.module";
import { AddPlaceholderView } from "./add-placeholder-view/add-placeholder-view.module";
import { AddTextView } from "./add-text-view/add-text-view.module";
import { BuildBreadboardComponent } from "./components/build-breadboard.component";
import { BuildViewComponent } from "./build-view.component";
import { EditActionView } from "./edit-action-view/edit-action-view.module";
import { EditBreadboardView } from "./edit-breadboard-view/edit-breadboard-view.module";
import { EditFieldView } from "./edit-field-view/edit-field-view.module";
import { EditPlaceholderView } from "./edit-placeholder-view/edit-placeholder-view.module";
import { EditTextView } from "./edit-text-view/edit-text-view.module";
import { RoutableView } from "~/app/app.module";
import { SharedModule } from "~/app/shared/shared.module";
import { ViewView } from "./view-view/view-view.module";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@NgModule({
	imports: [
		SharedModule,
		DragDropModule,
		// NOTE: When a routing module is statically included, then the routing module
		// needs to be explicitly imported. In order to not worry about this divergence,
		// let's let the child module define the importable modules (which may or may
		// not be an EMPTY ARRAY - empty if lazy-loaded).
		...AddActionView.modules,
		...AddBreadboardView.modules,
		...AddFieldView.modules,
		...AddPlaceholderView.modules,
		...AddTextView.modules,
		...EditActionView.modules,
		...EditBreadboardView.modules,
		...EditFieldView.modules,
		...EditPlaceholderView.modules,
		...EditTextView.modules,
		...ViewView.modules
	],
	declarations: [
		BuildBreadboardComponent,
		BuildViewComponent
	]
})
export class BuildViewModule {
	// ...
}

export var BuildView: RoutableView = {
	modules: [
		// NOTE: Since this module's routes are being included directly in the parent
		// module's router definition, we need to tell the parent module to import this
		// module. Otherwise, the application won't know about the declared components
		// and services.
		BuildViewModule
	],
	routes: [
		{
			path: "build",
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
					component: BuildViewComponent,
					children: [
						{
							path: "",
							pathMatch: "full",
							redirectTo: "view"
						},
						...AddActionView.routes,
						...AddBreadboardView.routes,
						...AddFieldView.routes,
						...AddPlaceholderView.routes,
						...AddTextView.routes,
						...EditActionView.routes,
						...EditBreadboardView.routes,
						...EditFieldView.routes,
						...EditPlaceholderView.routes,
						...EditTextView.routes,
						...ViewView.routes						
					]
				}
			]
		}
	]
};

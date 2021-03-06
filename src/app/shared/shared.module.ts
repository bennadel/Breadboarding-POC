
// Import the core angular services.
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

// Import the application components and services.
import { InputAutofocusDirective } from "./directives/autofocus.directive";
import { SmallBreadboardComponent } from "./components/small-breadboard/small-breadboard.component";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

var sharedModules = [
	CommonModule,
	FormsModule,
	RouterModule
];

var sharedDeclarations: any[] = [
	InputAutofocusDirective,
	SmallBreadboardComponent
];

// The goal of the SharedModule is to organize declarations and other modules that will
// be imported into other modules (for rendering).
@NgModule({
	imports: [
		CommonModule
	],
	exports: [
		...sharedDeclarations,
		...sharedModules
	],
	declarations: [
		...sharedDeclarations
	]
})
export class SharedModule {
	// ...
}

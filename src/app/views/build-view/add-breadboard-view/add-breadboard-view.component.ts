
// Import the core angular services.
import { Component } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-add-breadboard-view",
	styleUrls: [
		"./add-breadboard-view.component.less",
		// TODO: Research a better way to style a shared set of elements that is not
		// an actual component. I wish I was better at CSS methodologies.
		"../../../../app/shared/less/aside-form.less"
	],
	templateUrl: "./add-breadboard-view.component.htm"
})
export class AddBreadboardViewComponent {

	// I initialize the view component.
	constructor() {

		// ....

	}

}

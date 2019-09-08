
// Import the core angular services.
import { Component } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-add-field-view",
	styleUrls: [
		"./add-field-view.component.less",
		// TODO: Research a better way to style a shared set of elements that is not
		// an actual component. I wish I was better at CSS methodologies.
		"../../../../app/shared/less/aside-form.less"
	],
	templateUrl: "./add-field-view.component.htm"
})
export class AddFieldViewComponent {

	// I initialize the view component.
	constructor() {

		// ....

	}

}

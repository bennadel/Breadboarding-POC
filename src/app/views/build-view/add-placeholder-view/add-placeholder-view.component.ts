
// Import the core angular services.
import { Component } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-add-placeholder-view",
	styleUrls: [
		"./add-placeholder-view.component.less",
		// TODO: Research a better way to style a shared set of elements that is not
		// an actual component. I wish I was better at CSS methodologies.
		"../../../../app/shared/less/aside-form.less"
	],
	templateUrl: "./add-placeholder-view.component.html"
})
export class AddPlaceholderViewComponent {

	// I initialize the view component.
	constructor() {

		// ....

	}

}

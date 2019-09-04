
// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";
import { sampleData } from "~/app/shared/interfaces/breadboard";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "preview-view",
	styleUrls: [ "./preview-view.component.less" ],
	templateUrl: "./preview-view.component.htm"
})
export class PreviewViewComponent {

	public breadboards: Breadboard[];

	// I initialize the view component.
	constructor(
		activatedRoute: ActivatedRoute,
		router: Router
		) {

		this.breadboards = sampleData;

	}

}

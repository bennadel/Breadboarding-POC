
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
	selector: "poc-build-view",
	styleUrls: [ "./build-view.component.less" ],
	templateUrl: "./build-view.component.htm"
})
export class BuildViewComponent {

	public breadboards: Breadboard[];
	public selectedBreadboard: Breadboard;

	// I initialize the view component.
	constructor(
		activatedRoute: ActivatedRoute,
		router: Router
		) {

		this.breadboards = sampleData;
		this.selectedBreadboard = sampleData[ 0 ];

	}

}

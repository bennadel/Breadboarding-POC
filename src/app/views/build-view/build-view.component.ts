
// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

// Import the core angular services.
import { Component } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "build-view",
	styleUrls: [ "./build-view.component.less" ],
	templateUrl: "./build-view.component.htm"
})
export class BuildViewComponent {

	// I initialize the view component.
	constructor(
		activatedRoute: ActivatedRoute,
		router: Router
		) {

		console.warn( "Build constructor" );

		console.log( activatedRoute.snapshot.params );

	}

}

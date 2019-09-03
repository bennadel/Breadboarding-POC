
// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

// Import the core angular services.
import { Component } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "preview-view",
	styleUrls: [ "./preview-view.component.less" ],
	templateUrl: "./preview-view.component.htm"
})
export class PreviewViewComponent {

	// I initialize the view component.
	constructor(
		activatedRoute: ActivatedRoute,
		router: Router
		) {

		console.warn( "Preview constructor" );

		console.log( activatedRoute.snapshot.params );

	}

}


// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-view-view",
	host: {
		"(window:keydown.a)": "gotoAdd( $event, 'add-action' )",
		"(window:keydown.b)": "gotoAdd( $event, 'add-breadboard' )",
		"(window:keydown.f)": "gotoAdd( $event, 'add-field' )",
		"(window:keydown.p)": "gotoAdd( $event, 'add-placeholder' )",
		"(window:keydown.t)": "gotoAdd( $event, 'add-text' )",
	},
	styleUrls: [ "./view-view.component.less" ],
	templateUrl: "./view-view.component.htm"
})
export class ViewViewComponent {

	private activatedRoute: ActivatedRoute;
	private router: Router;

	// I initialize the view component.
	constructor(
		activatedRoute: ActivatedRoute,
		router: Router
		) {

		this.activatedRoute = activatedRoute;
		this.router = router;

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I navigate to the given action segment.
	public gotoAdd( event: KeyboardEvent, segment: string ) : void {

		event.preventDefault();

		this.router.navigate(
			[ `../${ segment }` ],
			{
				relativeTo: this.activatedRoute
			}
		);

	}

}

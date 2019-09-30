
// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

// Import the application components and services.
import { BreadboardService } from "~/app/shared/services/breadboard.service";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-add-text-view",
	host: {
		"(window:keydown.escape)": "handleEscape()"
	},
	styleUrls: [
		"./add-text-view.component.less",
		// TODO: Research a better way to style a shared set of elements that is not
		// an actual component. I wish I was better at CSS methodologies.
		"../../../../app/shared/less/aside-form.less"
	],
	templateUrl: "./add-text-view.component.html"
})
export class AddTextViewComponent {

	public form: {
		value: string;
	};

	private activatedRoute: ActivatedRoute;
	private breadboardService: BreadboardService;
	private router: Router;

	// I initialize the view component.
	constructor(
		activatedRoute: ActivatedRoute,
		breadboardService: BreadboardService,
		router: Router
		) {

		this.activatedRoute = activatedRoute;
		this.breadboardService = breadboardService;
		this.router = router;

		this.form = {
			value: ""
		};

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I handle the ESC key, taking the user out of the form view.
	public handleEscape() : void {

		this.navigateToView();

	}


	// I process the form submission.
	public processForm() : void {

		if ( ! this.form.value ) {

			return;

		}

		this.breadboardService
			.textItemAdd(
				this.activatedRoute.snapshot.params.breadboardID,
				{
					value: this.form.value
				}
			)
			.then(
				() => {

					this.navigateToView();

				}
			)
			.catch(
				( error ) => {

					console.warn( "Item could not be saved." );
					console.error( error );

				}
			)
		;

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I navigate the user back to the main build view.
	private navigateToView() : void {

		this.router.navigate(
			[ "../view" ],
			{
				relativeTo: this.activatedRoute
			}
		);

	}

}

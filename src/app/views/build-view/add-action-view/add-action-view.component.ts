
// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";
import { BreadboardService } from "~/app/shared/services/breadboard.service";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-add-action-view",
	host: {
		"(window:keydown.escape)": "handleEscape()"
	},
	styleUrls: [
		"./add-action-view.component.less",
		// TODO: Research a better way to style a shared set of elements that is not
		// an actual component. I wish I was better at CSS methodologies.
		"../../../../app/shared/less/aside-form.less"
	],
	templateUrl: "./add-action-view.component.html"
})
export class AddActionViewComponent {

	public breadboards: Breadboard[];
	public form: {
		label: string;
		target: string | null;
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

		this.breadboards = [];
		this.form = {
			label: "",
			target: null
		};

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I handle the ESC key, taking the user out of the form view.
	public handleEscape() : void {

		this.navigateToView();

	}


	// I get called once after the inputs have been bound for the first time.
	public ngOnInit() : void {

		this.breadboardService.breadboardGetAll().then(
			( breadboards ) => {

				this.breadboards = breadboards;

			}
		);

	}


	// I process the form submission.
	public processForm() : void {

		if ( ! this.form.label ) {

			return;

		}

		if ( this.form.target === null ) {

			var promise = this.breadboardService.breadboardAdd();

		} else {

			var promise = Promise.resolve( this.form.target );

		}

		promise.then(
			( targetBreadboardID ) => {

				var itemPromise = this.breadboardService.actionItemAdd(
					this.activatedRoute.snapshot.params.breadboardID,
					{
						label: this.form.label,
						target: targetBreadboardID
					}
				);

				return( itemPromise );

			}
		).then(
			() => {

				this.navigateToView();

			}
		).catch(
			( error ) => {

				console.warn( "Item could not be saved." );
				console.error( error );

			}
		);

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I navigate the user back to the main build view.
	public navigateToView() : void {

		this.router.navigate(
			[ "../view" ],
			{
				relativeTo: this.activatedRoute
			}
		);

	}

}


// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { delay } from "rxjs/operators";
import { Router } from "@angular/router";

// Import the application components and services.
import { BreadboardService } from "~/app/shared/services/breadboard.service";
import { Subscriptions } from "~/app/shared/services/subscriptions";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-edit-breadboard-view",
	host: {
		"(window:keydown.escape)": "handleEscape()"
	},
	styleUrls: [
		"./edit-breadboard-view.component.less",
		// TODO: Research a better way to style a shared set of elements that is not
		// an actual component. I wish I was better at CSS methodologies.
		"../../../../app/shared/less/aside-form.less"
	],
	templateUrl: "./edit-breadboard-view.component.html"
})
export class EditBreadboardViewComponent {

	public form: {
		title: string;
		description: string;
	};

	private activatedRoute: ActivatedRoute;
	private breadboardID: string;
	private breadboardService: BreadboardService;
	private router: Router;
	private subscriptions: Subscriptions;

	// I initialize the view component.
	constructor(
		activatedRoute: ActivatedRoute,
		breadboardService: BreadboardService,
		router: Router
		) {

		this.activatedRoute = activatedRoute;
		this.breadboardService = breadboardService;
		this.router = router;

		this.breadboardID = "";
		this.form = {
			title: "",
			description: ""
		};
		this.subscriptions = new Subscriptions();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I handle the ESC key, taking the user out of the form view.
	public handleEscape() : void {

		this.navigateToView();

	}


	// I get called once when the component is being unmounted.
	public ngOnDestroy() : void {

		this.subscriptions.unsubscribe();

	}


	// I get called once after the inputs have been bound for the first time.
	public ngOnInit() : void {

		// NOTE: I need to add the delay() here, otherwise the Router destroys and then
		// immediately re-creates the View Component. This is a long-standing bug in the
		// Angular Router (in my opinion).
		var paramsStream = this.activatedRoute.params.pipe( delay( 10 ) );

		this.subscriptions.add(
			paramsStream.subscribe(
				( params ) => {

					this.breadboardID = params.breadboardID;
					this.form.title = "";
					this.form.description = "";
					this.loadRemoteData();

				}
			)
		);

	}


	// I process the deletion request.
	public processDelete() : void {

		if ( ! window.confirm( "Delete this breadboard?" ) ) {

			return;

		}

		this.breadboardService
			.breadboardDeleteByID( this.breadboardID )
			.then(
				() => {

					// CAUTION: There is a wonky race-condition around deleting a
					// breadboard that I am not entirely sure how to handle. As such, for
					// this proof-of-concept, I'm going to ASSUME that the Build mode
					// will automatically handle the Router navigation based on the
					// "breadboard.delete" event. This is lame-sauce; but, I am not that
					// smart.

				}
			)
			.catch(
				( error ) => {

					console.warn( "Breadboard could not be deleted." );
					console.error( error );

				}
			)
		;
		
	}


	// I process the form submission.
	public processForm() : void {

		if ( ! this.form.title ) {

			return;

		}

		this.breadboardService
			.breadboardUpdateByID(
				this.breadboardID,
				{
					title: this.form.title,
					description: this.form.description
				}
			)
			.then(
				() => {

					this.navigateToView();

				}
			)
			.catch(
				( error ) => {

					console.warn( "Breadboard could not be saved." );
					console.error( error );

				}
			)
		;

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I load the remote Breadboard data based on the current breadboard ID.
	private loadRemoteData() : void {

		this.breadboardService
			.breadboardGetByID( this.breadboardID )
			.then(
				( breadboard ) => {

					this.form.title = breadboard.title;
					this.form.description = breadboard.description;

				}
			)
			.catch(
				( error ) => {

					console.warn( "Breadboard could not be loaded." );
					console.error( error );
					this.navigateToView();

				}
			)
		;

	}


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

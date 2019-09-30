
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
	selector: "poc-edit-placeholder-view",
	host: {
		"(window:keydown.escape)": "handleEscape()"
	},
	styleUrls: [
		"./edit-placeholder-view.component.less",
		// TODO: Research a better way to style a shared set of elements that is not
		// an actual component. I wish I was better at CSS methodologies.
		"../../../../app/shared/less/aside-form.less"
	],
	templateUrl: "./edit-placeholder-view.component.html"
})
export class EditPlaceholderViewComponent {

	public form: {
		label: string;
	};

	private activatedRoute: ActivatedRoute;
	private breadboardService: BreadboardService;
	private itemID: string;
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

		this.form = {
			label: ""
		};
		this.itemID = "";
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

					this.itemID = params.itemID;
					this.form.label = "";
					this.loadRemoteData();

				}
			)
		);

	}


	// I process the deletion request.
	public processDelete() : void {

		if ( ! window.confirm( "Delete this item?" ) ) {

			return;

		}

		this.breadboardService
			.placeholderItemDeleteByID( this.itemID )
			.then(
				() => {

					this.navigateToView();

				}
			)
			.catch(
				( error ) => {

					console.warn( "Item could not be deleted." );
					console.error( error );

				}
			)
		;
		
	}


	// I process the form submission.
	public processForm() : void {

		if ( ! this.form.label ) {

			return;

		}

		this.breadboardService
			.placeholderItemUpdateByID(
				this.itemID,
				{
					label: this.form.label
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

	// I load the remote Item data based on the current item ID.
	private loadRemoteData() : void {

		this.breadboardService
			.placeholderItemGetByID( this.itemID )
			.then(
				( item ) => {

					this.form.label = item.label;

				}
			)
			.catch(
				( error ) => {

					console.warn( "Item could not be loaded." );
					console.error( error );
					this.navigateToView();

				}
			)
		;

	}


	// I navigate the user back to the main build view.
	private navigateToView() : void {

		this.router.navigate(
			[ "../../view" ],
			{
				relativeTo: this.activatedRoute
			}
		);

	}

}

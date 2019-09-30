
// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";
import { BreadboardService } from "~/app/shared/services/breadboard.service";
import { DomainEventsService } from "~/app/shared/services/domain-events.service";
import { Subscriptions } from "~/app/shared/services/subscriptions";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-build-view",
	styleUrls: [ "./build-view.component.less" ],
	templateUrl: "./build-view.component.html"
})
export class BuildViewComponent {

	public breadboards: Breadboard[];
	public selectedBreadboard: Breadboard | null;

	private activatedRoute: ActivatedRoute;
	private breadboardService: BreadboardService;
	private domainEventsService: DomainEventsService;
	private router: Router;
	private subscriptions: Subscriptions;

	// I initialize the view component.
	constructor(
		activatedRoute: ActivatedRoute,
		breadboardService: BreadboardService,
		domainEventsService: DomainEventsService,
		router: Router
		) {

		this.activatedRoute = activatedRoute;
		this.breadboardService = breadboardService;
		this.domainEventsService = domainEventsService;
		this.router = router;

		this.breadboards = [];
		this.selectedBreadboard = null;
		this.subscriptions = new Subscriptions();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I get called once when the component is being unmounted.
	public ngOnDestroy() : void {

		this.subscriptions.unsubscribe();

	}


	// I get called once after the inputs have been bound for the first time.
	public ngOnInit() : void {

		this.subscriptions.add(
			this.activatedRoute.params.subscribe(
				( params ) => {

					this.selectBreadboard();

				}
			),
			this.domainEventsService.events.subscribe(
				( event ) => {

					// CAUTION: For the proof-of-concept, we're just going to reload the
					// data on any domain events. We know that the data is LOCAL, so we
					// know this will be instant. In reality, we would want to be more
					// targeted in how this works.
					this.loadRemoteData();

				}
			)
		);

		this.loadRemoteData();

	}


	// I return the ngFor iteration identifier for breadboards.
	public trackBy( index: number, breadboard: Breadboard ) : string {

		return( breadboard.id );

	}

	// ---
	// PRIVATE METHODS.
	// ---

	// I load the remote data needed for the view model.
	private loadRemoteData() : void {

		this.breadboards = [];

		this.breadboardService.breadboardGetAll()
			.then(
				( breadboards ) => {

					this.breadboards = breadboards;
					this.selectBreadboard();

				}
			)
			.catch(
				( error ) => {

					console.warn( "Breadboards could not be loaded." );
					console.log( error );

				}
			)
		;

	}


	// I select the target breadboard.
	private selectBreadboard() : void {

		var breadboardID = this.activatedRoute.snapshot.params.breadboardID;
		this.selectedBreadboard = null;

		// If the breadboards haven't loaded, or if there are no breadboards, just exit;
		// there's nothing to select.
		if ( ! this.breadboards.length ) {

			return;

		}

		// If the target breadboard is the "first" abstraction, then navigate to the
		// appropriate breadboard ID - this URL change will re-trigger the appropriate
		// breadboard selection.
		if ( breadboardID === "first" ) {

			this.router.navigate(
				[ "/app/build/" + this.breadboards[ 0 ].id ],
				{
					replaceUrl: true
				}
			);
			return;

		}

		// If we made it this far, we have breadboards and a target ID. Let's see if we
		// can locate the target breadboard.
		var foundBreadboard = this.breadboards.find(
			( breadboard ) => {

				return( breadboard.id === breadboardID );

			}
		);

		if ( foundBreadboard ) {

			this.selectedBreadboard = foundBreadboard;

		} else {

			// If the target breadboard ID wasn't valid, just redirect the user to the
			// first valid breadboard.
			this.router.navigate( [ "/app/build/first" ] );

		}

	}

}

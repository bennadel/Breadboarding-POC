
// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";
import { BreadboardingRuntime } from "~/app/shared/services/breadboarding.runtime";
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
	public subscriptions: Subscriptions;

	private activatedRoute: ActivatedRoute;
	private breadboardingRuntime: BreadboardingRuntime;
	private router: Router;

	// I initialize the view component.
	constructor(
		activatedRoute: ActivatedRoute,
		breadboardingRuntime: BreadboardingRuntime,
		router: Router
		) {

		this.activatedRoute = activatedRoute;
		this.breadboardingRuntime = breadboardingRuntime;
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

					var promise = ( params.breadboardID === "first" )
						? this.breadboardingRuntime.selectFirstBreadboard()
						: this.breadboardingRuntime.selectBreadboard( params.breadboardID )
					;

					promise.catch(
						( error ) => {

							console.group( "Error when selecting breadboard" );
							console.error( error );
							console.groupEnd();

						}
					);

				}
			),
			this.breadboardingRuntime.getBreadboards().subscribe(
				( breadboards ) => {

					this.breadboards = breadboards;

				}
			),
			this.breadboardingRuntime.getSelectedBreadboard().subscribe(
				( selectedBreadboard ) => {

					this.selectedBreadboard = selectedBreadboard;

				}
			)

		);

	}

}

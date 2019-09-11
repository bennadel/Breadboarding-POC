
// Import the core angular services.
import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

// Import the application components and services.
import { BreadboardingRuntime } from "~/app/shared/services/breadboarding.runtime";
import { Subscriptions } from "~/app/shared/services/subscriptions";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-add-text-view",
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
	private breadboardID: string;
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

		this.breadboardID = this.activatedRoute.snapshot.params.breadboardID;
		this.form = {
			value: ""
		};

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I get called once when the component is being unmounted.
	public ngOnDestroy() : void {

		// this.subscriptions.unsubscribe();

	}


	// I get called once after the inputs have been bound for the first time.
	public ngOnInit() : void {

	}


	public processForm() : void {

		if ( ! this.form.value ) {

			return;

		}

		this.breadboardingRuntime
			.addTextItem( this.breadboardID, this.form.value )
			.then(
				() => {

					this.router.navigate(
						[ "../view" ],
						{
							relativeTo: this.activatedRoute
						}
					);

				}
			)
		;

	}

}

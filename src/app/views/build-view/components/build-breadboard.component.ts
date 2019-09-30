
// Import the core angular services.
import { ChangeDetectionStrategy } from "@angular/core";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";
import { BreadboardItem } from "~/app/shared/interfaces/breadboard";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-build-breadboard",
	inputs: [ "breadboard" ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: [ "./build-breadboard.component.less" ],
	templateUrl: "./build-breadboard.component.html"
})
export class BuildBreadboardComponent {

	public breadboard!: Breadboard;

	private router: Router;

	// I inititialize the component.
	constructor( router: Router ) {

		this.router = router;

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public checkForShiftClick(
		event: MouseEvent,
		item: BreadboardItem
		) : void {

		if ( ( item.type === "action" ) && event.shiftKey ) {

			event.preventDefault();
			this.router.navigate( [ "/app/build/" + item.target ] );

		}

	}

	// I return the ngFor iteration identifier for items.
	public trackBy( index: number, item: BreadboardItem ) : string {

		return( item.id );

	}

}


// Import the core angular services.
import { ChangeDetectionStrategy } from "@angular/core";
import { Component } from "@angular/core";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";
import { BreadboardItem } from "~/app/shared/interfaces/breadboard";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-preview-breadboard",
	inputs: [ "breadboard" ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: [ "./preview-breadboard.component.less" ],
	templateUrl: "./preview-breadboard.component.html"
})
export class PreviewBreadboardComponent {

	public breadboard!: Breadboard;

	// ---
	// PUBLIC METHODS.
	// ---

	// I return the ngFor iteration identifier for items.
	public trackBy( index: number, item: BreadboardItem ) : string {

		return( item.id );

	}

}

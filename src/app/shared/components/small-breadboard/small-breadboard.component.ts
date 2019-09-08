
// Import the core angular services.
import { ChangeDetectionStrategy } from "@angular/core";
import { Component } from "@angular/core";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-small-breadboard",
	inputs: [ "breadboard" ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: [ "./small-breadboard.component.less" ],
	templateUrl: "./small-breadboard.component.html"
})
export class SmallBreadboardComponent {

	public breadboard!: Breadboard;

}

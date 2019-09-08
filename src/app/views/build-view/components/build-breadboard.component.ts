
// Import the core angular services.
import { ChangeDetectionStrategy } from "@angular/core";
import { Component } from "@angular/core";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-build-breadboard",
	inputs: [ "breadboard" ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: [ "./build-breadboard.component.less" ],
	templateUrl: "./build-breadboard.component.htm"
})
export class BuildBreadboardComponent {

	public breadboard!: Breadboard;

}

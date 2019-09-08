
// Import the core angular services.
import { ChangeDetectionStrategy } from "@angular/core";
import { Component } from "@angular/core";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-preview-breadboard",
	inputs: [ "breadboard" ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: [ "./preview-breadboard.component.less" ],
	templateUrl: "./preview-breadboard.component.htm"
})
export class PreviewBreadboardComponent {

	public breadboard!: Breadboard;

}


// Import the core angular services.
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { ChangeDetectionStrategy } from "@angular/core";
import { Component } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { moveItemInArray } from "@angular/cdk/drag-drop";
import { Router } from "@angular/router";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";
import { BreadboardItem } from "~/app/shared/interfaces/breadboard";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Component({
	selector: "poc-build-breadboard",
	inputs: [ "breadboard" ],
	outputs: [ "sortEvents: sort" ],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: [ "./build-breadboard.component.less" ],
	templateUrl: "./build-breadboard.component.html"
})
export class BuildBreadboardComponent {

	public breadboard!: Breadboard;
	public sortEvents: EventEmitter<string[]>;

	private router: Router;

	// I initialize the component.
	constructor( router: Router ) {

		this.router = router;

		this.sortEvents = new EventEmitter();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// When the user clicks on an Action item, I check to see if the SHIFT key is
	// pressed; and, if so, I navigate the user to the target breadboard rather than
	// taking the user to the Edit version of the Action.
	public checkForShiftClick(
		event: MouseEvent,
		item: BreadboardItem
		) : void {

		if ( ( item.type === "action" ) && event.shiftKey ) {

			event.preventDefault();
			this.router.navigate( [ "/app/build/" + item.target ] );

		}

	}


	// I handle the Drop event from the Material CDK, indicating that the user wants to
	// sort the items in the breadboard.
	public dropItem( event: CdkDragDrop<string[]> ) : void {

		if ( event.previousIndex === event.currentIndex ) {

			return;

		}

		// We're going to translate the drop event into an array of sorted IDs. First,
		// let's get the existing list of IDs.
		var itemIDs = this.breadboard.items.map(
			( item ) => {

				return( item.id );

			}
		);
		// ... then, move the selected item ID to its new location.
		moveItemInArray( itemIDs, event.previousIndex, event.currentIndex );

		this.sortEvents.emit( itemIDs );

	}


	// I return the ngFor iteration identifier for items.
	public trackBy( index: number, item: BreadboardItem ) : string {

		return( item.id );

	}

}

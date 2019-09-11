
// Import the core angular services.
import { Injectable } from "@angular/core";
// import { map } from "rxjs/operators";
import { Observable } from "rxjs";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";
import { BreadboardItem } from "~/app/shared/interfaces/breadboard";
import { BreadboardText } from "~/app/shared/interfaces/breadboard";
import { sampleData } from "~/app/shared/interfaces/breadboard";
import { SimpleStore } from "~/app/shared/services/simple-store";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export interface BreadboardingState {
	breadboards: Breadboard[];
	selectedBreadboard: Breadboard | null;
}

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Injectable({
	providedIn: "root"
})
export class BreadboardingRuntime {

	private store: SimpleStore<BreadboardingState>;

	// I initialize the runtime.
	constructor() {

		this.store = new SimpleStore({
			breadboards: sampleData,
			selectedBreadboard: null
		});

	}

	// ---
	// COMMAND METHODS.
	// ---

	public async addTextItem(
		breadboardID: string,
		value: string
		) : Promise<string> {

		var breadboards = this.store.getSnapshot().breadboards;
		var selectedBreadboard = this.store.getSnapshot().selectedBreadboard;
		var breadboard = breadboards.find(
			( breadboard ) => {

				return( breadboard.id === breadboardID );

			}
		);

		if ( ! breadboard ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found` ) );


		}

		if ( ! value ) {

			throw( new Error( "Empty text value" ) );

		}

		var nextID = `uuid-i-${ Date.now() }`;

		breadboard.items.push({
			type: "text",
			id: nextID,
			value: value
		});

		// TODO: Having to close these is bunk. Let's re-work the way we are storing the
		// Array of breadboards so that it's a list of IDs. And, the selected breadboard
		// should be a list of IDs as well. Then, we can be more flexible in the way that
		// we are managing state and deriving state.
		var newBreadboards = this.clone( breadboards );
		var newSelectedBreadboard = newBreadboards.find(
			( b ) => {

				return( b.id === ( selectedBreadboard && selectedBreadboard.id ) );

			}
		);

		this.store.setState({
			breadboards: newBreadboards,
			selectedBreadboard: newSelectedBreadboard
		});

		return( nextID );

	}


	public async selectFirstBreadboard() : Promise<void> {

		var breadboards = this.store.getSnapshot().breadboards;

		if ( ! breadboards.length ) {

			throw( new Error( "No breadboards" ) );

		}

		this.store.setState({
			selectedBreadboard: breadboards[ 0 ]
		});

	}


	public async selectBreadboard( breadboardID: string ) : Promise<void> {

		var breadboards = this.store.getSnapshot().breadboards;

		var selectedBreadboard = breadboards.find(
			( breadboard ) => {

				return( breadboard.id === breadboardID );

			}
		);
		
		if ( ! selectedBreadboard ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found` ) );

		}

		this.store.setState({
			selectedBreadboard: selectedBreadboard
		});

	}


	// ---
	// QUERY METHODS.
	// ---

	public getBreadboards() : Observable<Breadboard[]> {

		return( this.store.select( "breadboards" ) );

	}


	public getSelectedBreadboard() : Observable<Breadboard | null> {

		return( this.store.select( "selectedBreadboard" ) );

	}

	// ---
	// PRIVATE METHODS.
	// ---

	private clone<T>( value: T ) : T {

		return( JSON.parse( JSON.stringify( value ) ) );

	}

}

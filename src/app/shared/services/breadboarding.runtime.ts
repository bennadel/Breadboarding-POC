
// Import the core angular services.
import { combineLatest } from "rxjs";
import { produce } from "immer";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
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
	selectedBreadboardID: string | null;
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
			selectedBreadboardID: null
		});

	}

	// ---
	// COMMAND METHODS.
	// ---

	public async addFieldItem(
		breadboardID: string,
		label: string,
		value: string
		) : Promise<string> {

		var breadboards = this.store.getSnapshot().breadboards;
		var breadboardIndex = breadboards.findIndex(
			( breadboard ) => {

				return( breadboard.id === breadboardID );

			}
		);

		if ( breadboardIndex === -1 ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found` ) );

		}

		if ( ! label ) {

			throw( new Error( "Empty text label" ) );

		}

		var nextID = `uuid-i-${ Date.now() }`;

		var nextBreadboards = produce(
			breadboards,
			( draft ) => {

				var breadboard = draft[ breadboardIndex ];

				breadboard.items.push({
					type: "field",
					id: nextID,
					label: label,
					value: value
				});

			}
		);

		this.store.setState({
			breadboards: nextBreadboards
		});

		return( nextID );

	}


	public async addTextItem(
		breadboardID: string,
		value: string
		) : Promise<string> {

		var breadboards = this.store.getSnapshot().breadboards;
		var breadboardIndex = breadboards.findIndex(
			( breadboard ) => {

				return( breadboard.id === breadboardID );

			}
		);

		if ( breadboardIndex === -1 ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found` ) );

		}

		if ( ! value ) {

			throw( new Error( "Empty text value" ) );

		}

		var nextID = `uuid-i-${ Date.now() }`;

		var nextBreadboards = produce(
			breadboards,
			( draft ) => {

				var breadboard = draft[ breadboardIndex ];

				breadboard.items.push({
					type: "text",
					id: nextID,
					value: value
				});

			}
		);

		this.store.setState({
			breadboards: nextBreadboards
		});

		return( nextID );

	}


	public async selectFirstBreadboard() : Promise<void> {

		var breadboards = this.store.getSnapshot().breadboards;

		if ( ! breadboards.length ) {

			throw( new Error( "No breadboards" ) );

		}

		this.store.setState({
			selectedBreadboardID: breadboards[ 0 ].id
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
			selectedBreadboardID: breadboardID
		});

	}

	// ---
	// QUERY METHODS.
	// ---

	public getBreadboards() : Observable<Breadboard[]> {

		return( this.store.select( "breadboards" ) );

	}


	public getSelectedBreadboard() : Observable<Breadboard | null> {

		var stream = combineLatest(
			this.store.select( "breadboards" ),
			this.store.select( "selectedBreadboardID" ),
			( breadboards, selectedBreadboardID ) => {

				if ( ! selectedBreadboardID ) {

					return( null );

				}

				var selectedBreadboard = breadboards.find(
					( breadboard ) => {

						return( breadboard.id === selectedBreadboardID );

					}
				);

				return( selectedBreadboard || null );

			}
		);

		return( stream );

	}

	// ---
	// PRIVATE METHODS.
	// ---

}


// Import the core angular services.
import { Injectable } from "@angular/core";
import { produce } from "immer";

// Import the application components and services.
import { Breadboard } from "~/app/shared/interfaces/breadboard";
import { BreadboardAction } from "~/app/shared/interfaces/breadboard";
import { BreadboardField } from "~/app/shared/interfaces/breadboard";
import { BreadboardItem } from "~/app/shared/interfaces/breadboard";
import { BreadboardPlaceholder } from "~/app/shared/interfaces/breadboard";
import { BreadboardText } from "~/app/shared/interfaces/breadboard";
import { DomainEventsService } from "~/app/shared/services/domain-events.service";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

interface Index {
	breadboard: {
		[ id: string ]: number;
	};
	item: {
		[ id: string ]: [ number, number ];
	};
}

var LOCAL_STORAGE_KEY = "breadboarding_poc_db";

@Injectable({
	providedIn: "root"
})
export class BreadboardService {

	private breadboards: Breadboard[];
	private breadboardIndex: Index;
	private events: DomainEventsService;
	private pkeyBase: number;
	private pkeyCounter: number;
	
	// I initialize the breadboard service.
	constructor( events: DomainEventsService ) {

		this.breadboards = [];
		this.breadboardIndex = {
			breadboard: Object.create( null ),
			item: Object.create( null )
		};
		this.events = events;
		this.pkeyBase = Date.now();
		this.pkeyCounter = 0;

		this.loadDB();

		// If loading the breadboard data left us with no breadboards, let's add one -
		// the user interface isn't really designed to have NO breadboards.
		// --
		// NOTE: This is for the proof-of-concept. In reality, we probably would want
		// to handle this in a more graceful way.
		if ( ! this.breadboards.length ) {

			this.breadboardAdd();

		}

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public async actionItemAdd(
		breadboardID: string,
		patch: {
			label: string;
			target: string;
		}
		) : Promise<string> {

		var index = this.breadboardIndex.breadboard[ breadboardID ];

		if ( index === undefined ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found.` ) );

		}

		if ( this.breadboardIndex.breadboard[ patch.target ] === undefined ) {

			throw( new Error( `Breadboard target with ID ${ patch.target } not found.` ) );

		}

		if ( ! patch.label ) {

			throw( new Error( `Action label cannot be empty.` ) );

		}

		var itemID = this.nextPkey();

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				draft[ index ].items.push({
					type: "action",
					id: itemID,
					label: patch.label,
					target: patch.target
				});

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.add",
			payload: {
				breadboardID: breadboardID,
				itemID: itemID
			}
		});

		return( itemID );

	}


	public async actionItemDeleteByID( itemID: string ) : Promise<void> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "action" ) {

			throw( new Error( `Item with ID ${ itemID } is not an Action Item.` ) );

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				draft[ index[ 0 ] ].items.splice( index[ 1 ], 1 );

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.delete",
			payload: {
				breadboardID: breadboard.id,
				itemID: item.id
			}
		});

	}


	public async actionItemGetByID( itemID: string ) : Promise<BreadboardAction> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "action" ) {

			throw( new Error( `Item with ID ${ itemID } is not an Action Item.` ) );

		}

		return( item );

	}


	public async actionItemUpdateByID(
		itemID: string,
		patch: {
			label: string;
			target: string;
		}
		) : Promise<void> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "action" ) {

			throw( new Error( `Item with ID ${ itemID } is not an Action Item.` ) );

		}

		if ( this.breadboardIndex.breadboard[ patch.target ] === undefined ) {

			throw( new Error( `Breadboard target with ID ${ patch.target } not found.` ) );

		}

		if ( ! patch.label ) {

			throw( new Error( `Action label cannot be empty.` ) );

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				var draftItem = ( draft[ index[ 0 ] ].items[ index[ 1 ] ] as BreadboardAction );
				draftItem.label = patch.label;
				draftItem.target = patch.target;

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.update",
			payload: {
				breadboardID: breadboard.id,
				itemID: item.id
			}
		});

	}


	public async breadboardAdd() : Promise<string>;
	public async breadboardAdd( title: string ) : Promise<string>;
	public async breadboardAdd( title: string, description: string ) : Promise<string>;
	public async breadboardAdd( title: string = "", description: string = "" ) : Promise<string> {

		var breadboardID = this.nextPkey();

		if ( ! title ) {

			title = `Breadboard ${ ( this.breadboards.length + 1 ) }`;

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				draft.push({
					id: breadboardID,
					title: title,
					description: description,
					items: []
				});

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "breadboard.add",
			payload: {
				breadboardID: breadboardID
			}
		});

		return( breadboardID );

	}


	public async breadboardDeleteByID( breadboardID: string ) : Promise<void> {

		var index = this.breadboardIndex.breadboard[ breadboardID ];

		if ( index === undefined ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found.` ) );

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				var itemsToDelete: string[] = [];

				// Before we delete the breadboard, we have to delete any Action item
				// that points to this breadboard. For this, we have to brute-force walk
				// the collection and search.
				for ( var breadboard of draft ) {

					for ( var item of breadboard.items ) {

						if (
							( item.type === "action" ) &&
							( item.target === breadboardID )
							) {

							itemsToDelete.push( item.id );

						}

					}

				}

				// Delete any linked Items.
				for ( var itemID of itemsToDelete ) {

					var itemIndex = this.breadboardIndex.item[ itemID ];
					draft[ itemIndex[ 0 ] ].items.splice( itemIndex[ 1 ], 1 );

				}

				draft.splice( index, 1 );

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "breadboard.delete",
			payload: {
				breadboardID: breadboardID
			}
		});

		// If the breadboard deletion left us with no breadboards, let's add one - the
		// user interface isn't really designed to have NO breadboards.
		// --
		// NOTE: This is for the proof-of-concept. In reality, we probably would want
		// to handle this in a more graceful way.
		if ( ! this.breadboards.length ) {

			await this.breadboardAdd();

		}

	}


	public async breadboardGetAll() : Promise<Breadboard[]> {

		return( this.breadboards );

	}


	public async breadboardGetByID( breadboardID: string ) : Promise<Breadboard> {

		var index = this.breadboardIndex.breadboard[ breadboardID ];

		if ( index === undefined ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found.` ) );

		}

		return( this.breadboards[ index ] );

	}


	public async breadboardSortByID(
		breadboardID: string,
		itemIDs: string[]
		) : Promise<void> {

		var index = this.breadboardIndex.breadboard[ breadboardID ];

		if ( index === undefined ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found.` ) );

		}

		var breadboard = this.breadboards[ index ];

		if ( itemIDs.length !== breadboard.items.length ) {

			throw( new Error( "Invalid set of IDs for breadboard sort." ) );

		}

		for ( var itemID of itemIDs ) {

			var itemIndex = this.breadboardIndex.item[ itemID ];

			if (
				! itemIndex ||
				( this.breadboards[ itemIndex[ 0 ] ].id !== breadboardID )
				) {

				throw( new Error( "Corrupted ID data for sort." ) );

			}

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				draft[ index ].items = itemIDs.map(
					( itemID ) => {

						var itemIndex = this.breadboardIndex.item[ itemID ];

						return( this.breadboards[ itemIndex[ 0 ] ].items[ itemIndex[ 1 ] ] );

					}
				);

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "breadboard.update",
			payload: {
				breadboardID: breadboardID
			}
		});

	}


	public async breadboardUpdateByID(
		breadboardID: string,
		patch: {
			title?: string;
			description?: string;
		}
		) : Promise<void> {

		var index = this.breadboardIndex.breadboard[ breadboardID ];

		if ( index === undefined ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found.` ) );

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				var breadboard = draft[ index ];

				if ( patch.title !== undefined ) {

					breadboard.title = patch.title;

				}

				if ( patch.description !== undefined ) {

					breadboard.description = patch.description;

				}

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "breadboard.update",
			payload: {
				breadboardID: breadboardID
			}
		});

	}


	public async fieldItemAdd(
		breadboardID: string,
		patch: {
			label: string;
			value: string;
		}
		) : Promise<string> {

		var index = this.breadboardIndex.breadboard[ breadboardID ];

		if ( index === undefined ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found.` ) );

		}

		if ( ! patch.label ) {

			throw( new Error( `Field label cannot be empty.` ) );

		}

		var itemID = this.nextPkey();

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				draft[ index ].items.push({
					type: "field",
					id: itemID,
					label: patch.label,
					value: patch.value
				});

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.add",
			payload: {
				breadboardID: breadboardID,
				itemID: itemID
			}
		});

		return( itemID );

	}


	public async fieldItemDeleteByID( itemID: string ) : Promise<void> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "field" ) {

			throw( new Error( `Item with ID ${ itemID } is not a Field Item.` ) );

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				draft[ index[ 0 ] ].items.splice( index[ 1 ], 1 );

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.delete",
			payload: {
				breadboardID: breadboard.id,
				itemID: item.id
			}
		});

	}


	public async fieldItemGetByID( itemID: string ) : Promise<BreadboardField> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "field" ) {

			throw( new Error( `Item with ID ${ itemID } is not a Field Item.` ) );

		}

		return( item );

	}


	public async fieldItemUpdateByID(
		itemID: string,
		patch: {
			label: string;
			value: string;
		}
		) : Promise<void> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "field" ) {

			throw( new Error( `Item with ID ${ itemID } is not a Field Item.` ) );

		}

		if ( ! patch.label ) {

			throw( new Error( `Field label cannot be empty.` ) );

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				var draftItem = ( draft[ index[ 0 ] ].items[ index[ 1 ] ] as BreadboardField );
				draftItem.label = patch.label;
				draftItem.value = patch.value;

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.update",
			payload: {
				breadboardID: breadboard.id,
				itemID: item.id
			}
		});

	}


	public async placeholderItemAdd(
		breadboardID: string,
		patch: {
			label: string;
		}
		) : Promise<string> {

		var index = this.breadboardIndex.breadboard[ breadboardID ];

		if ( index === undefined ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found.` ) );

		}

		if ( ! patch.label ) {

			throw( new Error( `Placeholder label cannot be empty.` ) );

		}

		var itemID = this.nextPkey();

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				draft[ index ].items.push({
					type: "placeholder",
					id: itemID,
					label: patch.label
				});

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.add",
			payload: {
				breadboardID: breadboardID,
				itemID: itemID
			}
		});

		return( itemID );

	}


	public async placeholderItemDeleteByID( itemID: string ) : Promise<void> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "placeholder" ) {

			throw( new Error( `Item with ID ${ itemID } is not a Placeholder Item.` ) );

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				draft[ index[ 0 ] ].items.splice( index[ 1 ], 1 );

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.delete",
			payload: {
				breadboardID: breadboard.id,
				itemID: item.id
			}
		});

	}


	public async placeholderItemGetByID( itemID: string ) : Promise<BreadboardPlaceholder> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "placeholder" ) {

			throw( new Error( `Item with ID ${ itemID } is not a Placeholder Item.` ) );

		}

		return( item );

	}


	public async placeholderItemUpdateByID(
		itemID: string,
		patch: {
			label: string;
		}
		) : Promise<void> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "placeholder" ) {

			throw( new Error( `Item with ID ${ itemID } is not a Placeholder Item.` ) );

		}

		if ( ! patch.label ) {

			throw( new Error( `Placeholder label cannot be empty.` ) );

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				var draftItem = ( draft[ index[ 0 ] ].items[ index[ 1 ] ] as BreadboardPlaceholder );
				draftItem.label = patch.label;

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.update",
			payload: {
				breadboardID: breadboard.id,
				itemID: item.id
			}
		});

	}


	public async textItemAdd(
		breadboardID: string,
		patch: {
			value: string;
		}
		) : Promise<string> {

		var index = this.breadboardIndex.breadboard[ breadboardID ];

		if ( index === undefined ) {

			throw( new Error( `Breadboard with ID ${ breadboardID } not found.` ) );

		}

		if ( ! patch.value ) {

			throw( new Error( `Text value cannot be empty.` ) );

		}

		var itemID = this.nextPkey();

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				draft[ index ].items.push({
					type: "text",
					id: itemID,
					value: patch.value
				});

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.add",
			payload: {
				breadboardID: breadboardID,
				itemID: itemID
			}
		});

		return( itemID );

	}


	public async textItemDeleteByID( itemID: string ) : Promise<void> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "text" ) {

			throw( new Error( `Item with ID ${ itemID } is not a Text Item.` ) );

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				draft[ index[ 0 ] ].items.splice( index[ 1 ], 1 );

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.delete",
			payload: {
				breadboardID: breadboard.id,
				itemID: item.id
			}
		});

	}


	public async textItemGetByID( itemID: string ) : Promise<BreadboardText> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "text" ) {

			throw( new Error( `Item with ID ${ itemID } is not a Text Item.` ) );

		}

		return( item );

	}


	public async textItemUpdateByID(
		itemID: string,
		patch: {
			value: string;
		}
		) : Promise<void> {

		var index = this.breadboardIndex.item[ itemID ];

		if ( index === undefined ) {

			throw( new Error( `Item with ID ${ itemID } not found.` ) );

		}

		var breadboard = this.breadboards[ index[ 0 ] ];
		var item = breadboard.items[ index[ 1 ] ];

		if ( item.type !== "text" ) {

			throw( new Error( `Item with ID ${ itemID } is not a Text Item.` ) );

		}

		if ( ! patch.value ) {

			throw( new Error( `Text value cannot be empty.` ) );

		}

		this.breadboards = produce(
			this.breadboards,
			( draft ) => {

				var draftItem = ( draft[ index[ 0 ] ].items[ index[ 1 ] ] as BreadboardText );
				draftItem.value = patch.value;

			}
		);

		this.buildIndex();
		this.flushDB();
		this.events.trigger({
			type: "item.update",
			payload: {
				breadboardID: breadboard.id,
				itemID: item.id
			}
		});

	}

	// ---
	// PRIVATE METHODS.
	// ---

	private buildIndex() : void {

		this.breadboardIndex.breadboard = Object.create( null );
		this.breadboardIndex.item = Object.create( null );

		this.breadboards.forEach(
			( breadboard, b ) => {

				this.breadboardIndex.breadboard[ breadboard.id ] = b;

				breadboard.items.forEach(
					( item, i ) => {

						this.breadboardIndex.item[ item.id ] = [ b, i ];

					}
				);

			}
		);

	}


	private flushDB() : void {

		try {

			window.localStorage.setItem( LOCAL_STORAGE_KEY, JSON.stringify( this.breadboards ) );

		} catch ( error ) {

			console.warn( "Breadboarding POC data could not be flushed to LocalStorage." );

		}

	}


	private loadDB() : void {

		try {

			var rawData = window.localStorage.getItem( LOCAL_STORAGE_KEY );

			if ( ! rawData ) {

				return;

			}

			this.breadboards = ( JSON.parse( rawData ) as Breadboard[] );
			this.buildIndex();

		} catch ( error ) {

			console.warn( "Breadboarding POC data could not be loaded from LocalStorage." );

		}

	}


	// I return the next unique primary key for the db.
	private nextPkey() : string {

		return( `poc-${ this.pkeyBase }-${ ++this.pkeyCounter }` );

	}

}


// Import the core angular services.
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

export type DomainEvent = 
	| BreadboardAddEvent
	| BreadboardDeleteEvent
	| BreadboardUpdateEvent
	| ItemAddEvent
	| ItemDeleteEvent
	| ItemUpdateEvent
;

export interface BreadboardAddEvent {
	type: "breadboard.add";
	payload: {
		breadboardID: string;
	};
}

export interface BreadboardDeleteEvent {
	type: "breadboard.delete";
	payload: {
		breadboardID: string;
	};
}

export interface BreadboardUpdateEvent {
	type: "breadboard.update";
	payload: {
		breadboardID: string;
	};
}

export interface ItemAddEvent {
	type: "item.add",
	payload: {
		breadboardID: string;
		itemID: string;
	};
}

export interface ItemDeleteEvent {
	type: "item.delete",
	payload: {
		breadboardID: string;
		itemID: string;
	};
}

export interface ItemUpdateEvent {
	type: "item.update",
	payload: {
		breadboardID: string;
		itemID: string;
	};
}

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Injectable({
	providedIn: "root"
})
export class DomainEventsService {

	public events: Observable<DomainEvent>;

	private stream: Subject<DomainEvent>;

	// I initialize the service.
	constructor() {
		
		this.stream = new Subject();
		this.events = this.stream.asObservable();

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I emit the given event on the event stream.
	public trigger( event: DomainEvent ) : void {

		this.stream.next( event );

	}

}

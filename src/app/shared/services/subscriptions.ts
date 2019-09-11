
export interface Unsubscribable {
	unsubscribe(): any;
}

export class Subscriptions {

	private subscriptions: Unsubscribable[];

	// I initialize the service.
	constructor() {

		this.subscriptions = [];

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I keep track of the given subscriptions.
	public add( ...items: Unsubscribable[] ) : Subscriptions {

		this.subscriptions.push( ...items );

		return( this );

	}


	// I unsubscribe from all the tracked subscriptions and clear the tracking.
	public unsubscribe() : void {

		for ( var subscription of this.subscriptions ) {

			subscription.unsubscribe();

		}

		this.subscriptions = [];

	}

}

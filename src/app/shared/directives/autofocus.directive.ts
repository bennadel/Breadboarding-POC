
// Import the core angular services.
import { Directive } from "@angular/core";
import { ElementRef } from "@angular/core";

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

@Directive({
	selector: "input[autofocus],textarea[autofocus]"
})
export class InputAutofocusDirective {

	private elementRef: ElementRef;

	// I initialize the directive.
	constructor( elementRef: ElementRef ) {

		this.elementRef = elementRef;

	}

	// ---
	// PUBLIC METHODS.
	// ---

	public ngAfterContentInit() : void {

		this.elementRef.nativeElement.focus();

	}

}

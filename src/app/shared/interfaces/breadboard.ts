
export interface Breadboard {
	id: string;
	title: string;
	description: string;
	items: BreadboardItem[];
}

export type BreadboardItem = ( BreadboardText | BreadboardField | BreadboardPlaceholder | BreadboardAction );

export interface BreadboardText {
	type: "text";
	id: string;
	value: string;
}

export interface BreadboardField {
	type: "field";
	id: string;
	label: string;
	value: string;
}

export interface BreadboardPlaceholder {
	type: "placeholder";
	id: string;
	label: string;
}

export interface BreadboardAction {
	type: "action";
	id: string;
	label: string;
	target: string;
}

// ----------------------------------------------------------------------------------- //
// TEMPORARY DATA FIXTURES.
// ----------------------------------------------------------------------------------- //

var bCounter = 0;
var iCounter = 0;

export var sampleData: Breadboard[] = [
	{
		id: `uuid-b-${ ++bCounter }`,
		title: "Breadboard One",
		description: "This is my breadboard. Ain't it kind of cool? I think this is something to notice.",
		items: [
			{
				id: `uuid-i-${ ++iCounter }`,
				type: "text",
				value: "This is some text"
			},
			{
				id: `uuid-i-${ ++iCounter }`,
				type: "field",
				label: "First Name",
				value: "Sarah"
			},
			{
				id: `uuid-i-${ ++iCounter }`,
				type: "placeholder",
				label: "Something over here"
			},
			{
				id: `uuid-i-${ ++iCounter }`,
				type: "action",
				label: "Go To There",
				target: "uuid-b-2"
			}
		]
	},
	{
		id: `uuid-b-${ ++bCounter }`,
		title: "Breadboard Two",
		description: "",
		items: [
			{
				id: `uuid-i-${ ++iCounter }`,
				type: "text",
				value: "More text"
			},
			{
				id: `uuid-i-${ ++iCounter }`,
				type: "action",
				label: "Do It",
				target: "uuid-b-3"
			}
		]
	},
	{
		id: `uuid-b-${ ++bCounter }`,
		title: "Breadboard Three",
		description: "",
		items: [
			{
				id: `uuid-i-${ ++iCounter }`,
				type: "text",
				value: "This is nice over here with more text wouldn't you say?"
			},
			{
				id: `uuid-i-${ ++iCounter }`,
				type: "action",
				label: "Save",
				target: "uuid-b-1"
			},
			{
				id: `uuid-i-${ ++iCounter }`,
				type: "action",
				label: "Archive",
				target: "uuid-b-2"
			},
			{
				id: `uuid-i-${ ++iCounter }`,
				type: "action",
				label: "Delete",
				target: "uuid-b-3"
			}
		]
	}
];

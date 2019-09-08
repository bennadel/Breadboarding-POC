
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

export var sampleData: Breadboard[] = [
	{
		id: "uuid-1",
		title: "Breadboard One",
		description: "This is my breadboard. Ain't it kind of cool? I think this is something to notice.",
		items: [
			{
				id: "uuid",
				type: "text",
				value: "This is some text"
			},
			{
				id: "uuid",
				type: "field",
				label: "First Name",
				value: "Sarah"
			},
			{
				id: "uuid",
				type: "placeholder",
				label: "Something over here"
			},
			{
				id: "uuid",
				type: "action",
				label: "Go To There",
				target: "uuid-2"
			}
		]
	},
	{
		id: "uuid-2",
		title: "Breadboard Two",
		description: "",
		items: [
			{
				id: "uuid",
				type: "text",
				value: "More text"
			},
			{
				id: "uuid",
				type: "action",
				label: "Do It",
				target: "uuid-3"
			}
		]
	},
	{
		id: "uuid-3",
		title: "Breadboard Three",
		description: "",
		items: [
			{
				id: "uuid",
				type: "text",
				value: "This is nice over here with more text wouldn't you say?"
			},
			{
				id: "uuid",
				type: "action",
				label: "Save",
				target: "uuid-1"
			},
			{
				id: "uuid",
				type: "action",
				label: "Archive",
				target: "uuid-2"
			},
			{
				id: "uuid",
				type: "action",
				label: "Delete",
				target: "uuid-3"
			}
		]
	}
];

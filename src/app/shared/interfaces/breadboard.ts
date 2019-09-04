
export interface Breadboard {
	id: string;
	title: string;
	description: string;
	items: ( BreadboardText | BreadboardField | BreadboardPlaceholder | BreadboardAction )[];
}

export interface BreadboardItem {
	id: string;
	type: string;
}

export interface BreadboardText extends BreadboardItem {
	type: "text";
	value: string;
}

export interface BreadboardField extends BreadboardItem {
	type: "field";
	label: string;
	value: string;
}

export interface BreadboardPlaceholder extends BreadboardItem {
	type: "placeholder";
	label: string;
}

export interface BreadboardAction extends BreadboardItem {
	type: "action";
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
		description: "",
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
				target: "target-uuid"
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
				target: "target-uuid"
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
				target: "target-uuid"
			},
			{
				id: "uuid",
				type: "action",
				label: "Archive",
				target: "target-uuid"
			},
			{
				id: "uuid",
				type: "action",
				label: "Delete",
				target: "target-uuid"
			}
		]
	}
];

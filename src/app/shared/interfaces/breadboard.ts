
export interface Breadboard {
	readonly id: string;
	title: string;
	description: string;
	items: BreadboardItem[];
}

export type BreadboardItem = ( BreadboardText | BreadboardField | BreadboardPlaceholder | BreadboardAction );

interface BreadboardItemBase {
	readonly type: string;
	readonly id: string;
}

export interface BreadboardText extends BreadboardItemBase {
	type: "text";
	value: string;
}

export interface BreadboardField extends BreadboardItemBase {
	type: "field";
	label: string;
	value: string;
}

export interface BreadboardPlaceholder extends BreadboardItemBase {
	type: "placeholder";
	label: string;
}

export interface BreadboardAction extends BreadboardItemBase {
	type: "action";
	label: string;
	target: string;
}

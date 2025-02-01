export type AdminPost = {
	id: number;
	title: string;
	slug: string;
	date: string;
	hideDay: boolean;
	tags: AdminPostTag[];
};

export type AdminPostTag = {
	slug: string;
};


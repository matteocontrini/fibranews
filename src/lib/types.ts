export type Post = {
	title: string;
	date: string;
	year: string;
	content: string;
	tags: PostTag[];
};

export type PostTag = {
	slug: string;
};

export type PopularTag = {
	slug: string;
	name: string;
};

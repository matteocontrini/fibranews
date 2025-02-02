export type Post = {
	title: string;
	slug: string;
	date: string;
	year: string;
	content: string;
	isAiGenerated: boolean;
	tags: PostTag[];
	sources: PostSource[];
};

export type PostTag = {
	slug: string;
};

export type PostSource = {
	url: string;
	domain: string;
	title: string;
};

export type PopularTag = {
	slug: string;
	name: string;
};

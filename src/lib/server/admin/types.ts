import type { PostStatus } from '$lib/server/db/schema';

export type AdminPost = {
	id: number;
	title: string;
	slug: string;
	status: PostStatus;
	date: string;
	year: string;
	hideDay: boolean;
	tags: AdminPostTag[];
};

export type AdminPostTag = {
	slug: string;
};


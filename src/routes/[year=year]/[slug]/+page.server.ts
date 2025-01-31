import { PostEntity, PostStatus } from '$lib/server/db/schema';
import { Between, IsNull } from 'typeorm';
import { error } from '@sveltejs/kit';
import { mapPost } from '$lib/server/mapping';

export async function load({ params }) {
	const { year, slug } = params;

	const post = await PostEntity.findOne({
		where: {
			deletedAt: IsNull(),
			status: PostStatus.PUBLISHED,
			date: Between(year + '-01-01', year + '-12-31'),
			slug
		},
		relations: {
			tags: true
		}
	});

	if (!post) {
		error(404, 'Not found');
	}

	return {
		post: await mapPost(post)
	};
}

import { TagEntity } from '$lib/server/db/schema';
import type { PopularTag } from '$lib/types';

export async function load({ locals }) {
	const popularTags = await TagEntity.createQueryBuilder('tag')
		.leftJoinAndSelect('tag.posts', 'posts')
		.groupBy('tag.id, posts.id')
		.orderBy('COUNT(posts.id)', 'DESC')
		.limit(3)
		.getMany();

	return {
		user: locals.user ? {
			name: locals.user.name,
			photoUrl: locals.user.photoUrl
		} : null,
		popularTags: popularTags.map(mapPopularTag)
	};
}

function mapPopularTag(x: TagEntity): PopularTag {
	return {
		slug: x.slug,
		name: x.name
	};
}

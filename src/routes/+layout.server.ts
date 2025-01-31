import { TagEntity } from '$lib/server/db/schema';
import type { PopularTag } from '$lib/types';

export async function load() {
	const popularTags = await TagEntity.createQueryBuilder('tag')
		.leftJoinAndSelect('tag.posts', 'posts')
		.groupBy('tag.id, posts.id')
		.orderBy('COUNT(posts.id)', 'DESC')
		.limit(3)
		.getMany();

	return {
		popularTags: popularTags.map(mapPopularTag)
	};
}

function mapPopularTag(x: TagEntity): PopularTag {
	return {
		slug: x.slug,
		name: x.name
	};
}

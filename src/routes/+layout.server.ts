import { PostStatus, TagEntity } from '$lib/server/db/schema';
import type { PopularTag } from '$lib/types';

export async function load({ locals, url }) {
	const popularTags = await TagEntity.createQueryBuilder('tag')
		.leftJoin('tag.posts', 'post')
		.where('post.deletedAt IS NULL AND post.status = :status', { status: PostStatus.PUBLISHED })
		.groupBy('tag.id')
		.orderBy('COUNT(*)', 'DESC')
		.limit(3)
		.getMany();

	// Expose the user only in admin otherwise it gets cached in the hydration data
	const isAdminSection = url.pathname.startsWith('/admin');

	return {
		user:
			isAdminSection && locals.user
				? {
						name: locals.user.name,
						photoUrl: locals.user.photoUrl
					}
				: null,
		popularTags: popularTags.map(mapPopularTag)
	};
}

function mapPopularTag(x: TagEntity): PopularTag {
	return {
		slug: x.slug,
		name: x.name
	};
}

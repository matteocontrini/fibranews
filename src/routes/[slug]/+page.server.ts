import { PostEntity, PostStatus, TagEntity } from '$lib/server/db/schema';
import { IsNull } from 'typeorm';
import { error } from '@sveltejs/kit';
import { mapPost } from '$lib/server/mapping';

export async function load({ params }) {
	const { slug } = params;

	const tag = await TagEntity.findOne({
		where: { slug }
	});

	if (!tag) {
		error(404, 'Not found');
	}

	const posts = await PostEntity.find({
		where: {
			deletedAt: IsNull(),
			tags: { slug },
			status: PostStatus.PUBLISHED
		},
		order: {
			date: 'DESC'
		},
		relations: {
			tags: true,
			sources: true
		}
	});

	const mappedPosts = await Promise.all(posts.map(mapPost));

	// Group posts by year
	const postsByYear = [];
	for (const post of mappedPosts) {
		const lastGroup = postsByYear[postsByYear.length - 1];
		if (!lastGroup || lastGroup.year !== post.year) {
			postsByYear.push({
				year: post.year,
				posts: [post]
			});
		} else {
			lastGroup.posts.push(post);
		}
	}

	return {
		tag: {
			slug: slug,
			name: tag.name
		},
		postsByYear
	};
}

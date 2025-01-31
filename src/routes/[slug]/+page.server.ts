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

	const posts = await PostEntity.createQueryBuilder('post')
		.leftJoin('post.tags', 'tag')
		.leftJoinAndSelect('post.tags', 'tagSelect')
		.leftJoinAndSelect('post.sources', 'source')
		.where('tag.slug = :slug', { slug })
		.andWhere('post.status = :status', { status: PostStatus.PUBLISHED })
		.orderBy('post.date', 'DESC')
		.getMany();

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

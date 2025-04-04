import { PostEntity, PostStatus, TagEntity } from '$lib/server/db/schema';
import { IsNull } from 'typeorm';
import type { PopularTag } from '$lib/types';
import { mapPost } from '$lib/server/mapping';
import { env } from '$env/dynamic/private';

export async function load() {
	const posts = await PostEntity.find({
		where: {
			deletedAt: IsNull(),
			status: PostStatus.PUBLISHED
		},
		order: {
			date: 'DESC',
			createdAt: 'DESC',
			sources: {
				order: 'ASC'
			}
		},
		take: 20,
		relations: {
			tags: true,
			sources: true
		}
	});

	const popularTags = await TagEntity.createQueryBuilder('tag')
		.leftJoinAndSelect('tag.posts', 'posts')
		.groupBy('tag.id, posts.id')
		.orderBy('COUNT(posts.id)', 'DESC')
		.limit(3)
		.getMany();

	return {
		popularTags: popularTags.map(mapTag),
		posts: await Promise.all(posts.map(mapPost))
	};
}

function mapTag(x: TagEntity): PopularTag {
	return {
		slug: x.slug,
		name: x.name
	};
}

export const config = {
	isr: {
		expiration: 60,
		bypassToken: env.REVALIDATE_TOKEN
	}
};

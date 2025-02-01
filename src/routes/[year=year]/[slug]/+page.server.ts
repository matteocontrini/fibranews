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
			tags: true,
			sources: true
		}
	});

	if (!post) {
		error(404, 'Post non trovato');
	}

	return {
		post: await mapPost(post),
		seo: {
			title: post.title,
			description: post.content.slice(0, 160) + '...',
			ogType: 'article',
			jsonLd: {
				'@context': 'https://schema.org',
				'@type': 'NewsArticle',
				headline: post.title,
				dateModified: post.updatedAt.toISOString()
			}
		}
	};
}

export const config = {
	isr: {
		expiration: 60
	}
};

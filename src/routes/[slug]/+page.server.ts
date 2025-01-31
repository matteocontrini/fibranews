import { PostEntity, PostStatus, TagEntity } from '$lib/server/db/schema';
import type { Post } from '$lib/types';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { IsNull } from 'typeorm';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { slug } = params;

	const tag = await TagEntity.findOne({
		where: { slug }
	});

	if (!tag) {
		throw error(404, 'Not found');
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
			tags: true
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

async function mapPost(x: PostEntity): Promise<Post> {
	const content = await unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeStringify)
		.process(x.content);

	return {
		title: x.title,
		date: convertDate(x.date, x.hideDay),
		year: x.date.slice(0, 4),
		content: content.toString(),
		tags: x.tags.map((t) => ({ slug: t.slug }))
	};
}

function convertDate(input: string, hideDay = false) {
	const date = new Date(input);
	const options = {
		year: 'numeric',
		month: 'long',
		...(hideDay ? {} : { day: 'numeric' })
	} as Intl.DateTimeFormatOptions;
	return new Intl.DateTimeFormat('it-IT', options).format(date);
}

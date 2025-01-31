import { PostEntity, PostStatus } from '$lib/server/db/schema';
import type { Post, PostTag } from '$lib/types';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { IsNull } from 'typeorm';

export async function load() {
	const posts = await PostEntity.find({
		where: {
			deletedAt: IsNull(),
			status: PostStatus.PUBLISHED
		},
		order: {
			date: 'DESC'
		},
		take: 20,
		relations: {
			tags: true
		}
	});

	// TODO: DRY
	return {
		posts: await Promise.all(
			posts.map(async (x) => {
				const content = await unified()
					.use(remarkParse)
					.use(remarkRehype)
					.use(rehypeStringify)
					.process(x.content);

				return {
					title: x.title,
					date: convertDate(x.date, x.hideDay),
					content: content.toString(),
					tags: x.tags.map((t) => ({ slug: t.slug }) satisfies PostTag as PostTag)
				} satisfies Post as Post;
			})
		)
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

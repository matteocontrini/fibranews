import { PostEntity } from '$lib/server/db/schema';
import type { Post } from '$lib/types';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export async function load() {
	const posts = await PostEntity.find({
		where: {
			deletedAt: null
		},
		relations: {
			tags: true
		}
	});

	console.log(posts);

	// TODO: group by year

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
					content: content.toString()
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

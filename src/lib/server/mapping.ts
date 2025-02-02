import { PostEntity } from '$lib/server/db/schema';
import type { Post } from '$lib/types';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

export async function mapPost(x: PostEntity): Promise<Post> {
	const content = await unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeStringify)
		.process(x.content);

	return {
		title: x.title,
		slug: x.slug,
		date: convertDate(x.date, x.hideDay),
		year: x.date.slice(0, 4),
		content: content.toString(),
		isAiGenerated: x.isAiGenerated,
		tags: x.tags.map((t) => ({ slug: t.slug })),
		sources: x.sources.map((s) => ({
			url: s.url,
			domain: s.domain,
			title: s.title
		}))
	};
}

export function convertDate(input: string, hideDay = false) {
	const date = new Date(input);
	const options = {
		year: 'numeric',
		month: 'long',
		...(hideDay ? {} : { day: 'numeric' })
	} as Intl.DateTimeFormatOptions;
	return new Intl.DateTimeFormat('it-IT', options).format(date);
}

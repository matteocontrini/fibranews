import { TagEntity } from '$lib/server/db/schema';

export async function load() {
	const tags = await TagEntity.find({
		order: {
			name: 'ASC'
		}
	});

	return {
		tags: tags.map(mapTag),
		seo: {
			title: 'Tutti gli argomenti'
		}
	};
}

function mapTag(x: TagEntity) {
	return {
		slug: x.slug,
		name: x.name
	};
}

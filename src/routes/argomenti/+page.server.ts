import { TagEntity } from '$lib/server/db/schema';

export async function load() {
	const tags = await TagEntity.find({
		order: {
			name: 'ASC'
		}
	});

	return {
		tags: tags.map(mapTag)
	};
}

function mapTag(x: TagEntity) {
	return {
		slug: x.slug,
		name: x.name
	};
}

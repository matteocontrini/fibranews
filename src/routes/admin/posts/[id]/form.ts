import { z } from 'zod';

const SubmitPostSourceObject = z.object({
	id: z.number().nullable(),
	url: z.string().url(),
	title: z.string().min(3).max(255)
});

export type SubmitPostSource = z.infer<typeof SubmitPostSourceObject>;

export const schema = z.object({
	title: z.string().min(3).max(255),
	content: z.string().min(3).max(16384),
	published: z.boolean(),
	slug: z.string().min(3).max(255),
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.default(() => new Date().toISOString().slice(0, 10)),
	hideDay: z.boolean().default(false),
	tags: z.array(z.string()),
	sources: z.array(SubmitPostSourceObject)
});

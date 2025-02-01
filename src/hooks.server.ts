import 'reflect-metadata';
import { dataSource } from '$lib/server/db';
import { type Handle } from '@sveltejs/kit';
import { SessionEntity } from '$lib/server/db/schema';

export const handle: Handle = async ({ event, resolve }) => {
	if (!dataSource.isInitialized) {
		console.log('Initializing database...');
		await dataSource.initialize();
		console.log('Database initialized');
	}

	const token = event.cookies.get('fibranews_session');

	if (!token) {
		return resolve(event);
	}

	const user = await validateSession(token);

	event.locals.user = user;

	return resolve(event);
};

async function validateSession(token: string) {
	const session = await SessionEntity.findOne({
		where: {
			token
		},
		relations: {
			user: true
		}
	});

	if (!session) {
		return null;
	}

	// Update last activity time at most once a minute
	if (Date.now() - session.lastActivityAt.getTime() > 60 * 1000) {
		session.lastActivityAt = new Date();
		await session.save();
	}

	return session.user;
}

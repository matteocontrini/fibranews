import 'reflect-metadata';
import { dataSource } from '$lib/server/db';

dataSource
	.initialize()
	.then(() => {
		// TODO: use a logger
		console.log('Database initialized');
	})
	.catch((error) => {
		console.error('Database initialization failed', error);
	});

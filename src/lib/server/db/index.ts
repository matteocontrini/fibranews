import 'dotenv/config';
import { DataSource } from 'typeorm';
import { PostEntity, SourceEntity, TagEntity } from './schema';
import { dev } from '$app/environment';

export const dataSource = new DataSource({
	type: 'postgres',
	url: process.env.DATABASE_URL,
	entities: [PostEntity, TagEntity, SourceEntity],
	synchronize: dev,
	logging: dev
});

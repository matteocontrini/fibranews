import 'dotenv/config';
import { DataSource } from 'typeorm';
import { PostEntity, TagEntity } from './schema';

export const dataSource = new DataSource({
	type: 'postgres',
	url: process.env.DATABASE_URL,
	entities: [PostEntity, TagEntity],
	synchronize: true,
	logging: true
});

import { DataSource } from 'typeorm';
import { PostEntity, SessionEntity, SourceEntity, TagEntity, UserEntity } from './schema';
import { env } from '$env/dynamic/private';

export const dataSource = new DataSource({
	type: 'postgres',
	url: env.DATABASE_URL,
	entities: [PostEntity, TagEntity, SourceEntity, UserEntity, SessionEntity],
	synchronize: true,
	logging: true
});

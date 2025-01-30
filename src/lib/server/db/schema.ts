import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

export enum PostStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published'
}

@Entity('tags')
export class TagEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'timestamp with time zone' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp with time zone' })
	updatedAt: Date;

	@Column('text')
	name: string;

	@Column('text')
	slug: string;

	@ManyToMany(() => PostEntity, (post) => post.tags)
	posts: PostEntity[];
}

@Entity('posts')
export class PostEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'timestamp with time zone' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp with time zone' })
	updatedAt: Date;

	@DeleteDateColumn({ type: 'timestamp with time zone' })
	deletedAt: Date | null;

	// TODO: createdBy, updatedBy, deletedBy

	@Column('text')
	status: PostStatus;

	@Column('text')
	title: string;

	@Column('date')
	date: string;

	@Column('boolean')
	hideDay: boolean;

	@Column('text')
	content: string;

	@Column('boolean')
	isKeyEvent: boolean;

	// TODO: type (revision)
	// TODO: sources

	@ManyToMany(() => TagEntity, (tag) => tag.posts)
	@JoinTable({ name: 'posts_tags' })
	tags: TagEntity[];
}

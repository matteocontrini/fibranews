import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
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

@Entity('sources')
export class SourceEntity extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: 'timestamp with time zone' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp with time zone' })
	updatedAt: Date;

	@Column('text')
	url: string;

	@Column('text')
	domain: string;

	@Column('text')
	title: string;

	@ManyToOne(() => PostEntity, (post) => post.sources)
	post: PostEntity;
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

	@Column('text')
	slug: string;

	@Column('date')
	date: string;

	@Column('boolean')
	hideDay: boolean;

	@Column('text')
	content: string;

	@ManyToMany(() => TagEntity, (tag) => tag.posts)
	@JoinTable({ name: 'posts_tags' })
	tags: TagEntity[];

	@OneToMany(() => SourceEntity, (source) => source.post)
	sources: SourceEntity[];
}

// TODO: audit log of changes

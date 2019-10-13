import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany,
	BeforeInsert
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Post } from './Post';
import slugify = require('@sindresorhus/slugify');

@ObjectType()
@Entity()
export class Category extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ name: 'name', length: 150 })
	name: string;

	@OneToMany(() => Post, (post) => post.category)
	post: Post;

	@Field()
	@Column({ unique: true, readonly: true })
	slug: string;

	@BeforeInsert()
	slugifyName() {
		const slug = slugify(this.name);
		this.slug = slug;
	}
}

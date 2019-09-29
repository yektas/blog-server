import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Post } from './Post';

@ObjectType()
@Entity()
export class Category {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ length: 150 })
	name: string;

	@Field(() => [Post])
	@OneToMany(() => Post, (post) => post.category)
	posts: Post[];

	@Field()
	@Column({ unique: true, readonly: true })
	slug: string;
}

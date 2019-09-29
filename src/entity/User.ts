import { Post } from './Post';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	OneToMany
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ unique: true })
	email: string;

	@Field()
	@Column({ nullable: true })
	username: string;

	@Field()
	@Column({ name: 'first_name' })
	firstName: string;

	@Field()
	@Column({ name: 'last_name' })
	lastName: string;

	@Column()
	password: string;

	@Field(() => [Post])
	@OneToMany(() => Post, (post) => post.author)
	posts: Post[];

	@Column('int', { default: 0 })
	tokenVersion: number;
}

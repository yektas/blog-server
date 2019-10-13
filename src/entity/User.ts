import { Post } from './Post';
import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
	username?: string;

	@Field({ nullable: true })
	@Column({ name: 'first_name' })
	firstName?: string;

	@Field({ nullable: true })
	@Column({ name: 'last_name' })
	lastName?: string;

	@Column()
	password: string;

	@Field(() => [Post])
	@OneToMany(() => Post, (post) => post.author, { nullable: true })
	posts?: Post[];

	@Column('int', { default: 0 })
	tokenVersion: number;
}

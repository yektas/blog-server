import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
	ManyToMany,
	CreateDateColumn,
	UpdateDateColumn,
	JoinTable
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';
import { Category } from './Category';
import { Tag } from './Tag';

@ObjectType()
@Entity('post')
export class Post extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ length: 150 })
	title: string;

	@Field(() => User)
	@ManyToOne(() => User, (author) => author.posts)
	author: User;

	@Field(() => Category)
	@ManyToOne(() => Category, (category) => category.posts)
	category: Category;

	@Field(() => [Tag])
	@ManyToMany(() => Tag)
	@JoinTable()
	tags: Tag;

	@Field()
	@Column({ nullable: true })
	excerpt: string;

	@Field()
	@Column({ readonly: true })
	slug: string;

	@Field()
	@Column({ nullable: true })
	image: string;

	@Field()
	@Column({ type: 'text' })
	content: string;

	@Field()
	@Column({ name: 'is_draft', default: false })
	isDraft: boolean;

	@Field()
	@CreateDateColumn({ name: 'created_at' })
	publishedOn: Date;

	@Field()
	@UpdateDateColumn({ name: 'updated_at' })
	updatedOn: Date;

	@Field()
	@Column({ name: 'read_time', default: 0 })
	readTime: number;
}

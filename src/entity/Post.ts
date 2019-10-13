import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	JoinTable,
	ManyToMany,
	JoinColumn
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';
import { Category } from './Category';
import { Tag } from './Tag';
// import slugify from '@sindresorhus/slugify';

@ObjectType()
@Entity('post')
export class Post extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ length: 150 })
	title: string;

	@Column()
	authorId: number;
	@Field(() => User)
	@ManyToOne(() => User, (author: User) => author.posts)
	@JoinColumn({ name: 'authorId' })
	author: User;

	@Column()
	categoryId: number;
	@Field(() => Category)
	@ManyToOne(() => Category, (category: Category) => category.post)
	@JoinColumn({ name: 'categoryId' })
	category: Category;

	@Field(() => [Tag])
	@ManyToMany(() => Tag)
	@JoinTable()
	tags: Tag;

	@Field()
	@Column({ nullable: true })
	excerpt?: string;

	@Field()
	@Column({ readonly: true, nullable: true })
	slug?: string;

	@Field()
	@Column()
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

	// @AfterInsert()
	// slugifyTitle() {
	// 	const slug = slugify(this.title);
	// 	this.slug = slug.concat('-' + String(this.id));
	// }
}

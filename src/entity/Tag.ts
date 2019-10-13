import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import slugify = require('@sindresorhus/slugify');

@ObjectType()
@Entity()
export class Tag extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ length: 100 })
	name: string;

	@Field()
	@Column({ length: 100, unique: true, readonly: true })
	slug: string;

	@BeforeInsert()
	slugifyName() {
		const slug = slugify(this.name);
		this.slug = slug;
	}
}

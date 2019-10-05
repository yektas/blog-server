import { Length } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class CreatePostArguments {
	@Field()
	@Length(5, 150)
	title: string;

	@Field()
	content: string;

	@Field()
	coverImage: string;

	@Field()
	categoryId: number;

	@Field({ nullable: true })
	excerpt?: string;

	@Field({ nullable: true })
	tags?: string;
}

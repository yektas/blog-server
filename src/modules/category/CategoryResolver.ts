import slugify from '@sindresorhus/slugify';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { Category } from './../../entity/Category';

@Resolver()
export class CategoryResolver {
	@Query(() => [Category])
	categories() {
		return Category.find();
	}

	@Mutation(() => Category)
	//@UseMiddleware(isAuth)
	async createCategory(@Arg('name') name: string) {
		const slug = slugify(name);

		const category = await Category.create({
			name,
			slug
		}).save();

		if (!category) {
			throw new Error('Category creation failed');
		}
		return category;
	}
}

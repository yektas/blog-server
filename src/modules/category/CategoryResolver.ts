//import { isAuth } from './../../isAuth';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { Category } from './../../entity/Category';

@Resolver()
export class CategoryResolver {
	@Query(() => [Category])
	async categories() {
		return await Category.find();
	}

	@Mutation(() => Category)
	//@UseMiddleware(isAuth)
	async createCategory(@Arg('name') name: string) {
		const category = await Category.create({
			name
		}).save();

		if (!category) {
			throw new Error('Category creation failed');
		}
		return category;
	}
}

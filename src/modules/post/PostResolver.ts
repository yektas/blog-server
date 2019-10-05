import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';

import { Category } from './../../entity/Category';
import { Post } from './../../entity/Post';
import { User } from './../../entity/User';
import { isAuth } from './../../isAuth';
import { MyContext } from './../../types/MyContext';
import { CreatePostArguments } from './PostArguments';

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts() {
		return Post.find();
	}

	@Query(() => Post)
	async getPost(@Arg('id') id: number) {
		const post = await Post.findOne({ where: { id } });

		if (!post) {
			throw new Error(`Post with id ${id} not found`);
		}

		return post;
	}

	@Mutation(() => Post)
	@UseMiddleware(isAuth)
	async createPost(@Args() newPost: CreatePostArguments, @Ctx() { payload }: MyContext) {
		const category = await Category.findOne({
			where: { id: newPost.categoryId }
		});

		if (!category) {
			throw new Error('Category does not exists');
		}

		const author = await User.findOne({ where: { id: payload!.userId } });
		const post = await Post.create({
			title: newPost.title,
			category,
			excerpt: newPost.excerpt,
			image: newPost.coverImage,
			content: newPost.content,
			author: author
		}).save();

		if (!post) {
			throw new Error('Post creation failed');
		}
		return post;
	}
}

import { Arg, Args, Mutation, Query, Resolver, UseMiddleware, Ctx } from 'type-graphql';

import { Category } from './../../entity/Category';
import { Post } from './../../entity/Post';
import { User } from './../../entity/User';
import { isAuth } from './../../isAuth';
import { MyContext } from './../../types/MyContext';
import { CreatePostArguments } from './PostArguments';

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	async posts() {
		const posts = await Post.find({ relations: ['author', 'category', 'tags'] });
		return posts;
	}

	@Query(() => Post)
	async getPost(@Arg('id') id: number) {
		const post = await Post.findOne({ where: { id }, relations: ['author', 'category', 'tags'] });

		if (!post) {
			throw new Error(`Post with id ${id} not found`);
		}

		return post;
	}

	@Mutation(() => Post)
	@UseMiddleware(isAuth)
	async createPost(@Ctx() { payload }: MyContext, @Args() newPost: CreatePostArguments) {
		const category = await Category.findOne({
			where: { id: newPost.categoryId }
		});

		if (!category) {
			throw new Error('Category does not exists');
		}

		const author = await User.findOne({ where: { id: payload!.userId } });

		if (!author) {
			throw new Error('Author user does not exists');
		}

		const post = await Post.getRepository()
			.create({
				title: newPost.title,
				categoryId: category.id,
				authorId: author.id,
				excerpt: newPost.excerpt,
				image: newPost.coverImage,
				content: newPost.content
			})
			.save();

		const newlySavedPost = await Post.getRepository().findOne({ id: post.id });
		console.log('Post created');
		console.log(newlySavedPost);
		if (!newlySavedPost) {
			throw new Error('Post creation failed');
		}
		return newlySavedPost;
	}
}

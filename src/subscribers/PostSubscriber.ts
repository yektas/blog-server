import slugify from '@sindresorhus/slugify';
import { Post } from './../entity/Post';
import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from 'typeorm';

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface<Post> {
	/**
	 * Indicates that this subscriber only listen to Post events.
	 */
	listenTo() {
		return Post;
	}

	async afterInsert(event: InsertEvent<Post>) {
		const newPost = event.entity;
		newPost.slug = slugify(newPost.title.concat('-' + newPost.id));
		await event.manager.getRepository(Post).save(newPost);
	}
}

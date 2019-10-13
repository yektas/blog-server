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
		console.log('AfterInsert started');
		const newPost = event.entity;

		const post = await event.manager.getRepository(Post).findOne(newPost.id);
		if (post) {
			post.slug = 'Halo-slug';
			await event.manager.getRepository(Post).save(newPost);
			const myPost = await event.manager.getRepository(Post).findOne(post.id);
			console.log(myPost);
		}
		console.log('AfterInsert finished');
	}
}

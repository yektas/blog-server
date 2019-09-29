import { User } from '../entity/User';
import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class LoginResponse {
	@Field()
	accessToken: string;

	@Field(() => User)
	user: User;
}

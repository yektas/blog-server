import { isAuth } from './../../isAuth';
import { createAccessToken } from './../../utils/auth';
import { sendRefreshToken } from './../../utils/sendRefreshToken';
import { createRefreshToken } from './../../utils/auth';
import { LoginResponse } from './../../types/LoginResponse';
import {
	Resolver,
	Mutation,
	Arg,
	Query,
	Ctx,
	Int,
	UseMiddleware
} from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { User } from '../../entity/User';
import { verify } from 'jsonwebtoken';
import { MyContext } from '../../types/MyContext';
import { getConnection } from 'typeorm';

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'hi!';
	}

	@Query(() => String)
	@UseMiddleware(isAuth)
	bye(@Ctx() { payload }: MyContext) {
		console.log(payload);
		return `your user id is : ${payload!.userId}`;
	}

	@Mutation(() => Boolean)
	async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
		await getConnection()
			.getRepository(User)
			.increment({ id: userId }, 'tokenVersion', 1);

		return true;
	}

	@Query(() => [User])
	users() {
		return User.find();
	}

	@Query(() => User, { nullable: true })
	me(@Ctx() context: MyContext) {
		const authorization = context.req.headers['authorization'];

		if (!authorization) {
			return null;
		}

		try {
			const token = authorization.split(' ')[1];
			const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
			context.payload = payload as any;
			return User.findOne(payload.userId);
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	@Mutation(() => User)
	async register(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Arg('firstName') firstName: string,
		@Arg('lastName') lastName: string
	): Promise<User> {
		const hashedPassword = await hash(password, 12);
		const user = User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword
		}).save();

		if (!user) {
			throw new Error('Register failed.');
		}

		return user;
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { res }: MyContext
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			throw new Error('could not find user');
		}
		const valid = await compare(password, user.password);

		if (!valid) {
			throw new Error('bad password');
		}

		sendRefreshToken(res, createRefreshToken(user));

		return {
			accessToken: createAccessToken(user),
			user
		};
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { res }: MyContext) {
		sendRefreshToken(res, '');
		return true;
	}
}

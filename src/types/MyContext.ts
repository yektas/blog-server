import { JWTPayload } from './JWTPayload';
import { Request, Response } from 'express';

export interface MyContext {
	req: Request;
	res: Response;
	payload?: JWTPayload;
}

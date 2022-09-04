import type { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedError } from './error';
import { JWT_SECRET } from '../common';

export const getBlockedDepartments = (configs: Config[]): Array<string> => {
	return configs
		.filter((c: Config) => {
			const activateFrom = new Date(c.activateFrom);
			const activateTo = new Date(c.activateTo);
			return (
				(c.activateFrom && activateFrom.getTime() > Date.now()) ||
				(c.activateTo && activateTo.getTime() < Date.now())
			);
		})
		.map<string>((c: Config) => c.id);
};

export const verifyPayload = (token: string): JwtPayload => {
	try {
		return jwt.verify(token, JWT_SECRET) as JwtPayload;
	} catch {
		throw new UnauthorizedError();
	}
};

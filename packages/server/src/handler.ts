import { ssuLoginHandler } from './auth/handler/ssu_login';
import { logoutHandler } from './auth/handler/logout';
import { getConfigHandler } from './config/handler/get';
import { updateConfigHandler } from './config/handler/update';
import { claimLockerHandler } from './locker/handler/claim';
import { getClaimedLockerCountHandler } from './locker/handler/count';
import { queryClaimedLockersHandler } from './locker/handler/query';
import { deleteUserHandler } from './user/handler/delete';
import { getUserHandler } from './user/handler/get';
import { queryUserHandler } from './user/handler/query';
import { updateUserHandler } from './user/handler/update';
import { batchDeleteUserHandler } from './user/handler/batch/delete';
import { batchPutUserHandler } from './user/handler/batch/put';
import { unclaimLockerHandler } from './locker/handler/unclaim';

export const auth = {
	ssuLoginHandler,
	logoutHandler
};

export const config = {
	getConfigHandler,
	updateConfigHandler
};

export const locker = {
	claimLockerHandler,
	unclaimLockerHandler,
	getClaimedLockerCountHandler,
	queryClaimedLockersHandler
};

export const user = {
	deleteUserHandler,
	getUserHandler,
	queryUserHandler,
	updateUserHandler,
	batchDeleteUserHandler,
	batchPutUserHandler
};
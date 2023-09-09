import { ssuLoginHandler } from './auth/handler/ssu_login.js';
import { logoutHandler } from './auth/handler/logout.js';
import { getConfigHandler } from './config/handler/get.js';
import { updateConfigHandler } from './config/handler/update.js';
import { claimLockerHandler } from './locker/handler/claim.js';
import { getClaimedLockerCountHandler } from './locker/handler/count.js';
import { queryClaimedLockersHandler } from './locker/handler/query.js';
import { deleteUserHandler } from './user/handler/delete.js';
import { getUserHandler } from './user/handler/get.js';
import { queryUserHandler } from './user/handler/query.js';
import { updateUserHandler } from './user/handler/update.js';
import { batchDeleteUserHandler } from './user/handler/batch/delete.js';
import { batchPutUserHandler } from './user/handler/batch/put.js';
import { unclaimLockerHandler } from './locker/handler/unclaim.js';
import { deleteConfigHandler } from './config/handler/delete.js';

export const auth = {
  ssuLoginHandler,
  logoutHandler,
};

export const config = {
  getConfigHandler,
  updateConfigHandler,
  deleteConfigHandler,
};

export const locker = {
  claimLockerHandler,
  unclaimLockerHandler,
  getClaimedLockerCountHandler,
  queryClaimedLockersHandler,
};

export const user = {
  deleteUserHandler,
  getUserHandler,
  queryUserHandler,
  updateUserHandler,
  batchDeleteUserHandler,
  batchPutUserHandler,
};

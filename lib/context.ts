/**
 * @description holds context
 */

import { ErrorMessage } from './constant';
import { UserRole } from './enum/user-role.enum';
import { Context } from './interface/context.interface';
import { EnvArgs } from './interface/environment-args.interface';
import { MessageQueueProvider } from './provider/message-queue.provider';
import { MongoDbProvider } from './provider/mongo.provider';
import { PostgreSqlProvider } from './provider/postgre.provider';
import { AuthUtil } from './util/auth.util';
import { TokenUtil } from './util/token.util';

export const context = async (
  req: any,
  envArgs: EnvArgs,
  publicPaths?: string[],
  adminPaths?: string[],
  mongodb_provider?: MongoDbProvider,
  postgresql_provider?: PostgreSqlProvider,
  message_queue_provider?: MessageQueueProvider
) => {
  const tokenUtil = new TokenUtil(envArgs);
  const authUtil = new AuthUtil(tokenUtil);

  let currentUser: any;
  let publicPath = false;
  let adminPath = false;

  publicPaths?.forEach((p) => {
    if (req.route.path === p) {
      publicPath = true;
    }
  });

  adminPaths?.forEach((p) => {
    if (req.route.path === p) {
      adminPath = true;
    }
  });

  try {
    currentUser = await authUtil.getCurrentUser(req);
  } catch (e) {
    if (!publicPath) {
      throw e;
    }
  }

  const serviceKey = req.body.key;

  const role = currentUser ? (currentUser.role as UserRole) : ('' as UserRole);
  const token = currentUser ? currentUser.token : '';
  const isAdmin = authUtil.isAdmin(role);

  if (adminPath && !isAdmin) {
    throw new Error(ErrorMessage.FORBIDDEN);
  }

  return {
    mongodb_provider,
    postgresql_provider,
    username: currentUser ? currentUser.username : '',
    role,
    isAdmin,
    serviceKey,
    token,
    message_queue_provider,
  } as Context;
};

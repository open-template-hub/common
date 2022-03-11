/**
 * @description holds context
 */

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
  mongodb_provider?: MongoDbProvider,
  postgresql_provider?: PostgreSqlProvider,
  message_queue_provider?: MessageQueueProvider
) => {
  const tokenUtil = new TokenUtil(envArgs);
  const authUtil = new AuthUtil(tokenUtil);

  let currentUser: any;

  try {
    currentUser = await authUtil.getCurrentUser(req);
  } catch (e) {}

  const serviceKey = req.body.key;

  const role = currentUser ? (currentUser.role as UserRole) : ('' as UserRole);
  const token = currentUser ? currentUser.token : '';

  return {
    mongodb_provider,
    postgresql_provider,
    username: currentUser ? currentUser.username : '',
    role,
    serviceKey,
    token,
    message_queue_provider,
  } as Context;
};

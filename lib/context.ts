/**
 * @description holds context
 */

import { UserRole } from './enum/user-role.enum';
import { Context, ContextArgs } from './interface/context.interface';
import { AuthUtil } from './util/auth.util';
import { TokenUtil } from './util/token.util';

export const context = async (args: ContextArgs) => {
  const tokenUtil = new TokenUtil(args.envArgs);
  const authUtil = new AuthUtil(tokenUtil);

  let currentUser: any;

  currentUser = await authUtil.getCurrentUser(args.req);

  const serviceKey = args.req?.body.key;

  const role = currentUser ? (currentUser.role as UserRole) : ('' as UserRole);
  const token = currentUser ? currentUser.token : '';

  return {
    mongodb_provider: args.mongodb_provider,
    postgresql_provider: args.postgresql_provider,
    username: currentUser ? currentUser.username : '',
    role,
    serviceKey,
    token,
    message_queue_provider: args.message_queue_provider,
  } as Context;
};

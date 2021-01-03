/**
 * @description holds auth util
 */

import { TokenUtil } from './token.util';
import { UserRole } from '../enum/user-role.enum';
import { ErrorMessage } from '../constant';

export class AuthUtil {
  constructor(
    private readonly tokenUtil: TokenUtil,
    private adminRoles: Array<UserRole> = [UserRole.ADMIN]
  ) {}

  /**
   * gets current user from request
   * @param req request
   * @returns current user
   */
  getCurrentUser = async (req: { headers: { authorization: string } }) => {
    let authToken = '';
    let currentUser = null;

    const authTokenHeader = req.headers.authorization;
    const BEARER = 'Bearer ';

    if (authTokenHeader && authTokenHeader.startsWith(BEARER)) {
      authToken = authTokenHeader.slice(BEARER.length);
      currentUser = this.tokenUtil.verifyAccessToken(authToken);
    }

    if (!currentUser) {
      throw new Error(ErrorMessage.FORBIDDEN);
    }

    return currentUser;
  };

  /**
   * checks user role is admin or not
   * @param role user role
   * @returns true if admin, else false
   */
  isAdmin = (role: UserRole) => {
    if (this.adminRoles.indexOf(role) >= 0) {
      return true;
    } else {
      return false;
    }
  };
}

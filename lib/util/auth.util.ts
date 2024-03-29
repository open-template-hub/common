/**
 * @description holds auth util
 */

import { ErrorMessage } from '../constant';
import { UserRole } from '../enum/user-role.enum';
import { TokenUtil } from './token.util';

export class AuthUtil {

  private adminRoles: Array<UserRole>;

  constructor( private readonly tokenUtil: TokenUtil ) {
    this.adminRoles = [ UserRole.ADMIN ];
  }

  /**
   * gets current user from request
   * @param req request
   * @returns current user
   */
  getCurrentUser = async ( req: { headers: { authorization: string } } ) => {
    let authToken = '';
    let user = {};

    const authTokenHeader = req.headers.authorization;
    const BEARER = 'Bearer ';

    if ( authTokenHeader && authTokenHeader.startsWith( BEARER ) ) {
      authToken = authTokenHeader.slice( BEARER.length );
      user = this.tokenUtil.verifyAccessToken( authToken );
    }

    if ( !user ) {
      throw new Error( ErrorMessage.FORBIDDEN );
    }

    let currentUser: any = user;
    currentUser.token = authToken;

    return currentUser;
  };

  /**
   * checks user role is admin or not
   * @param role user role
   * @returns true if admin, else false
   */
  isAdmin = ( role: UserRole ) => {
    return this.adminRoles.indexOf( role ) >= 0;
  };
}

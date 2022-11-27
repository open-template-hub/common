/**
 * @description holds user interface
 */

import { UserRole } from '../enum/user-role.enum';
import { Team } from './team.interface';

export interface User {
  username: string;
  role: UserRole;
  password: string;
  email: string;
  teams: any[];
}

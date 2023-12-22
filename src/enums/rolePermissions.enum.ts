import { Role } from './role.enum';
import { Permissions } from './permissions.enum';

type RolePermissions = {
  [key: string]: Permissions[];
  user: Permissions[];
  admin: Permissions[];
};

export const RolePermissions: RolePermissions = {
  [Role.User]: [
    // Permissions.CREATE_PLAYLIST,
    // Permissions.DELETE_PLAYLIST,
    // Permissions.DELETE_USER,
    // Permissions.READ_PLAYLIST,
    // Permissions.READ_USER,
    // Permissions.UPDATE_PLAYLIST,
    // Permissions.UPDATE_USER,
    Permissions.VIEW_MOVIES,
  ],
  [Role.Admin]: [Permissions.MANAGE_REVIEWS],
};

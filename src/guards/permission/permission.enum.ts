import { Role } from '../role/role.enum';

export enum Permission {
  Read = 'read',
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.User]: [Permission.Read, Permission.Create, Permission.Update],
  [Role.Admin]: [Permission.Read, Permission.Create, Permission.Update, Permission.Delete],
};

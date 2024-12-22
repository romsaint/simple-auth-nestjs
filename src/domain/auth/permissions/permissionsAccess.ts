import { SetMetadata } from '@nestjs/common';
import { Permissions } from './permissions';

export const PermissionsAccess = (...permissions: string[]) => SetMetadata('permissions', permissions);
import { useAppSelector } from '../store/hooks';

export const usePermission = (permissionCode?: string): boolean => {
  const { user } = useAppSelector((state) => state.auth);

  if (!permissionCode) return true;
  if (!user) return false;

  // Super admin or full permission access override
  if (user.permissions?.includes('*')) return true;

  return user.permissions?.includes(permissionCode) ?? true;
};

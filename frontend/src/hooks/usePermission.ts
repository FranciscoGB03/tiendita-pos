import { useAuth } from "./useAuth";

export function usePermission(requiredPermission: string): boolean {
  const authState = useAuth();

  if (!authState || !authState.isValid) {
    return false;
  }

  return authState.permissions.includes(requiredPermission);
}

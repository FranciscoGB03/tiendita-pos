import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function ProtectedRoute({
  children,
  requiredPermission,
}: ProtectedRouteProps) {
  const authState = useAuth();

  // 1. Si el token no es válido (o no existe), redirigimos al login
  if (!authState.isValid) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si se requiere un permiso específico y no lo tiene, redirigimos a Unauthorized
  if (
    requiredPermission &&
    !authState.permissions.includes(requiredPermission)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Si es válido y tiene permisos, renderizamos la ruta protegida
  return <>{children}</>;
}

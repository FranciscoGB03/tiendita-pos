// frontend/src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isValid = useAuth();

  // 1. Mientras se valida el token (milisegundos), mostramos un estado de carga
  if (isValid === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-text text-2xl font-bold">
        Verificando sesión...
      </div>
    );
  }

  // 2. Si el token no es válido (o no existe), redirigimos al login
  // ✅ El JSX ahora está fuera de cualquier try/catch
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si es válido, renderizamos la ruta protegida
  return <>{children}</>;
}

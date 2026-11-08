import { useNavigate } from "react-router-dom";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background text-text p-8 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 mb-4 text-error"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
      <h1 className="text-4xl font-bold mb-2">Acceso Denegado</h1>
      <p className="text-xl mb-8 text-neutral">
        No tienes los permisos necesarios para acceder a esta sección.
      </p>
      <button
        onClick={() => navigate("/login")}
        className="px-8 py-3 bg-primary text-white font-bold text-xl rounded-xl hover:bg-primary/90 transition-colors"
      >
        Volver al Login
      </button>
    </div>
  );
};

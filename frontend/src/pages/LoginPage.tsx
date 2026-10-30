import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";
import { AlphanumericKeyboard } from "../components/AlphanumericKeyboard";
import logo from "../assets/logo-la-popular.png";

interface LoginResponse {
  token: string;
  user_id: string;
  username: string;
  full_name: string;
  role: string;
  expires_at: number;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

type ActiveField = "username" | "credential" | null;

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [credential, setCredential] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>("username");

  const navigate = useNavigate();
  const isTouchDevice = useIsTouchDevice();

  const usernameRef = useRef<HTMLInputElement>(null);
  const credentialRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (key: string) => {
    if (activeField === "username") {
      setUsername((prev) => prev + key);
    } else if (activeField === "credential") {
      setCredential((prev) => prev + key);
    }
  };

  const handleDelete = () => {
    if (activeField === "username") {
      setUsername((prev) => prev.slice(0, -1));
    } else if (activeField === "credential") {
      setCredential((prev) => prev.slice(0, -1));
    }
  };

  const handleSpace = () => {
    handleKeyPress(" ");
  };

  const handleLoginSubmit = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post<APIResponse<LoginResponse>>(
        "/api/login",
        {
          username: username.trim(),
          credential: credential.trim(),
        },
      );

      if (response.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error de login:", err);
      setError("Usuario o contraseña incorrectos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await handleLoginSubmit();
  };

  // Formulario reutilizable
  const LoginForm = (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-neutral/20">
      <div className="flex flex-col items-center mb-8">
        <img
          src={logo}
          alt="Miscelánea La Popular"
          className="w-32 h-32 object-contain mb-4"
        />
        <h1 className="text-3xl font-bold text-text text-center">
          Miscelánea La Popular
        </h1>
        <p className="text-neutral mt-2 text-center text-lg">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block text-lg font-semibold text-text mb-2"
          >
            Usuario
          </label>
          <input
            ref={usernameRef}
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setActiveField("username")}
            className={`w-full p-4 text-xl border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-text bg-background placeholder:text-neutral/50 transition-all ${
              activeField === "username"
                ? "border-primary ring-2 ring-primary/20"
                : "border-neutral/30"
            }`}
            placeholder="Ej. mama, papa, dev"
            autoComplete="username"
            required
            readOnly={isTouchDevice}
          />
        </div>

        <div>
          <label
            htmlFor="credential"
            className="block text-lg font-semibold text-text mb-2"
          >
            Contraseña o PIN
          </label>
          <input
            ref={credentialRef}
            id="credential"
            type="password"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            onFocus={() => setActiveField("credential")}
            className={`w-full p-4 text-xl border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-text bg-background placeholder:text-neutral/50 transition-all ${
              activeField === "credential"
                ? "border-primary ring-2 ring-primary/20"
                : "border-neutral/30"
            }`}
            placeholder="••••"
            autoComplete="current-password"
            required
            readOnly={isTouchDevice}
          />
          {isTouchDevice && (
            <p className="text-sm text-neutral mt-2">
              Campo activo:{" "}
              <span className="font-semibold text-primary">
                {activeField === "username" ? "Usuario" : "Contraseña/PIN"}
              </span>
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-error/10 border border-error/30 rounded-lg text-error text-center font-semibold text-lg animate-pulse">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 bg-primary hover:bg-primary/90 text-white text-xl font-bold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isLoading ? "Verificando..." : "ENTRAR"}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {isTouchDevice ? (
        // Layout de 2 columnas para tablet
        <div className="w-full max-w-6xl flex gap-8 items-stretch">
          <div className="flex-1">{LoginForm}</div>
          <div className="flex-1 flex items-center">
            <AlphanumericKeyboard
              onKeyPress={handleKeyPress}
              onDelete={handleDelete}
              onSpace={handleSpace}
              onEnter={() => {
                if (activeField === "username") {
                  setActiveField("credential");
                  credentialRef.current?.focus();
                } else if (activeField === "credential") {
                  handleLoginSubmit();
                }
              }}
            />
          </div>
        </div>
      ) : (
        // Layout centrado para laptop/desktop
        <div className="w-full max-w-md">{LoginForm}</div>
      )}
    </div>
  );
}

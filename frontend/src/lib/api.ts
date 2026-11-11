const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// 🚨 Bandera a nivel de módulo para evitar múltiples redirecciones si fallan varias peticiones a la vez
let isRedirecting = false;

interface ApiOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data?: unknown;

  constructor(status: number, statusText: string, data?: unknown) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { params, headers: customHeaders, ...restOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(customHeaders as Record<string, string>),
  };

  // 🔑 Inyectar token JWT automáticamente si existe
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }

    // 🚨 INTERCEPTOR 401: Sesión expirada o no autorizada
    if (response.status === 401) {
      const isLoginRequest = endpoint.includes("/api/login");

      // Solo redirigir si NO es el login y NO hay una redirección en curso
      if (!isLoginRequest && !isRedirecting) {
        console.warn(
          "⚠️ [api.ts] Token expirado o inválido (401). Redirigiendo al login...",
        );
        isRedirecting = true;

        // 1. Limpiar sesión
        localStorage.removeItem("token");

        // 2. Redirección forzada (limpia todo el estado de React y memoria)
        window.location.href = "/login";

        // 3. Resetear bandera por seguridad (aunque la recarga de página lo limpia de todos modos)
        setTimeout(() => {
          isRedirecting = false;
        }, 2000);
      }
    }

    // Lanzar el error para que el componente que hizo la petición también lo sepa (si alcanza a ejecutar algo antes del redirect)
    throw new ApiError(response.status, response.statusText, errorData);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response.text() as unknown as T;
}

export const api = {
  get: <T>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, data?: unknown, options?: ApiOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),
  put: <T>(endpoint: string, data?: unknown, options?: ApiOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),
  delete: <T>(endpoint: string, options?: ApiOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};

export { ApiError };
export type { ApiOptions };

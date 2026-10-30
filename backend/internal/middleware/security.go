package middleware

import "net/http"

// SecurityHeaders agrega cabeceras de seguridad HTTP a todas las respuestas.
func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Content Security Policy (CSP)
		// Nota: 'unsafe-inline' y 'unsafe-eval' son necesarios para Vite en modo desarrollo.
		// En producción (build), se pueden remover para un blindaje total.
		csp := "default-src 'self'; " +
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
			"style-src 'self' 'unsafe-inline'; " +
			"img-src 'self' data: blob: http://localhost:8080 http://192.168.10.101:8080; " +
			"connect-src 'self' http://localhost:8080 http://192.168.10.101:8080 ws://localhost:5173; " +
			"font-src 'self'; " +
			"object-src 'none'; " +
			"frame-ancestors 'none'; " +
			"base-uri 'self'; " +
			"form-action 'self';"

		w.Header().Set("Content-Security-Policy", csp)

		// 2. Prevenir que el navegador "adivine" el tipo de contenido (MIME sniffing)
		w.Header().Set("X-Content-Type-Options", "nosniff")

		// 3. Prevenir que la app sea embebida en un iframe (Clickjacking)
		w.Header().Set("X-Frame-Options", "DENY")

		// 4. Protección XSS heredada (para navegadores antiguos)
		w.Header().Set("X-XSS-Protection", "1; mode=block")

		// 5. Controlar información de la URL en enlaces externos
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		// Pasar al siguiente handler (el router mux)
		next.ServeHTTP(w, r)
	})
}
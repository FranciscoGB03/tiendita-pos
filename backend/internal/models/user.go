package models

import (
	"time"

	"github.com/google/uuid"
)

// User representa un usuario del sistema (tabla users)
type User struct {
	ID             uuid.UUID  `json:"id" db:"id"`
	Username       string     `json:"username" db:"username"`
	FullName       string     `json:"full_name" db:"full_name"`
	CredentialHash string     `json:"-" db:"credential_hash"` // NUNCA se serializa a JSON
	CredentialType string     `json:"credential_type" db:"credential_type"`
	RoleID         uuid.UUID  `json:"role_id" db:"role_id"`
	EmployeeID     *uuid.UUID `json:"employee_id,omitempty" db:"employee_id"`
	IsActive       bool       `json:"is_active" db:"is_active"`
	LastLoginAt    *time.Time `json:"last_login_at,omitempty" db:"last_login_at"`
	CreatedAt      time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at" db:"updated_at"`

	// Campos adicionales (no están en la tabla, vienen del JOIN)
	RoleName    string   `json:"role" db:"role_name"`
	Permissions []string `json:"permissions" db:"permissions"`
}

// LoginRequest representa la petición de login
type LoginRequest struct {
	Username   string `json:"username"`
	Credential string `json:"credential"` // PIN o password
}

// LoginResponse representa la respuesta exitosa de login
type LoginResponse struct {
	Token     string `json:"token"`
	UserID    string `json:"user_id"`
	Username  string `json:"username"`
	FullName  string `json:"full_name"`
	Role      string `json:"role"`
	ExpiresAt int64  `json:"expires_at"` // Unix timestamp
}
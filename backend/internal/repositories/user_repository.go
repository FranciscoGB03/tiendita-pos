package repositories

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/pgonbo/tiendita-pos/backend/internal/models"
)

type UserRepository struct {
	pool *pgxpool.Pool
}

// NewUserRepository crea una nueva instancia del repositorio de usuarios
func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

// GetUserByUsername busca un usuario activo por su username y carga sus permisos efectivos
func (r *UserRepository) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	query := `
		SELECT 
			u.id, u.username, u.full_name, u.credential_hash, u.credential_type,
			u.role_id, u.employee_id, u.is_active, u.last_login_at, u.created_at, u.updated_at,
			r.name AS role_name,
			COALESCE(ARRAY_AGG(DISTINCT p.name) FILTER (WHERE p.name IS NOT NULL), '{}') AS permissions
		FROM users u
		JOIN roles r ON u.role_id = r.id
		LEFT JOIN role_permissions rp ON r.id = rp.role_id
		LEFT JOIN permissions p ON rp.permission_id = p.id
		WHERE u.username = $1 AND u.is_active = TRUE
		GROUP BY u.id, r.name;
	`

	var user models.User
	err := r.pool.QueryRow(ctx, query, username).Scan(
		&user.ID, &user.Username, &user.FullName, &user.CredentialHash, &user.CredentialType,
		&user.RoleID, &user.EmployeeID, &user.IsActive, &user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt,
		&user.RoleName, &user.Permissions,
	)

	if err != nil {
		// Si no se encuentra, retornamos nil, nil para que el Service maneje el error de "no encontrado"
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

// UpdateLastLogin actualiza la fecha del último login del usuario
func (r *UserRepository) UpdateLastLogin(ctx context.Context, userID uuid.UUID) error {
	query := `UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1`
	_, err := r.pool.Exec(ctx, query, userID)
	return err
}

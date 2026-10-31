package services

import (
	"context"

	"github.com/pgonbo/tiendita-pos/backend/internal/models"
	"github.com/pgonbo/tiendita-pos/backend/internal/repositories"
)

type SaleService struct {
	saleRepo *repositories.SaleRepository
}

// NewSaleService crea una nueva instancia del servicio de ventas
func NewSaleService(saleRepo *repositories.SaleRepository) *SaleService {
	return &SaleService{saleRepo: saleRepo}
}

// CreateSale orquesta la creación de una venta (delega la transacción atómica al repositorio)
func (s *SaleService) CreateSale(ctx context.Context, req *models.SaleRequest) (*models.SaleResponse, error) {
	// Aquí podríamos agregar lógica de negocio adicional en el futuro 
	// (ej. validaciones cruzadas, notificaciones, etc.) antes de tocar la BD.
	return s.saleRepo.CreateSale(ctx, req)
}
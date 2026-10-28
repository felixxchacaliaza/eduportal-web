import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

/**
 * ============================================================================
 * StudentPaginatorIntl
 * ============================================================================
 * Proveedor de internacionalización en español para el paginador del padrón.
 * Regla: 1 sola clase por archivo.
 * ============================================================================
 */
@Injectable()
export class StudentPaginatorIntl extends MatPaginatorIntl {
  public override itemsPerPageLabel = 'Estudiantes por página:';
  public override nextPageLabel = 'Página siguiente';
  public override previousPageLabel = 'Página anterior';
  public override firstPageLabel = 'Primera página';
  public override lastPageLabel = 'Última página';

  public override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} de ${length}`;
  };
}

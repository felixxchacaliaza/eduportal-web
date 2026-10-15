import { PageHeaderConfig } from '../interfaces/page-header-config.interface';

/**
 * ============================================================================
 * PAGE_HEADERS_CONSTANT
 * ============================================================================
 * Catálogo inmutable de configuraciones de cabecera por ruta del sistema.
 *
 * @remarks
 * Mapea las URLs de navegación con sus respectivos títulos, breadcrumbs,
 * iconos de Material y descripciones pedagógicas.
 * ============================================================================
 */
export const PAGE_HEADERS_CONSTANT: readonly PageHeaderConfig[] = Object.freeze([
  Object.freeze({
    route: '/asignaturas',
    breadcrumbs: ['Académico', 'Asignaturas'],
    title: 'Asignaturas',
    icon: 'menu_book',
    description: 'Malla Curricular Secundaria del Perú (CNEB - MINEDU) • 12 asignaturas registradas • 39 horas pedagógicas semanales',
  }),
  Object.freeze({
    route: '/dashboard',
    breadcrumbs: ['Principal', 'Dashboard'],
    title: 'Panel de Control',
    icon: 'dashboard',
    description: 'Resumen general del estado escolar y métricas clave',
  }),
  Object.freeze({
    route: '/alumnos',
    breadcrumbs: ['Estudiantes', 'Padrón de Alumnos'],
    title: 'Padrón de Alumnos',
    icon: 'people',
    description: 'Gestión y registro de estudiantes matriculados',
  }),
  Object.freeze({
    route: '/grados-secciones',
    breadcrumbs: ['Académico', 'Grados y Secciones'],
    title: 'Grados y Secciones',
    icon: 'class',
    description: 'Distribución y administración de aulas, grados y secciones',
  }),
]);


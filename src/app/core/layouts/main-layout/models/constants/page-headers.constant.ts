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
    route: '/grados-asignaturas',
    breadcrumbs: ['Académico', 'Grados y Asignaturas'],
    title: 'Grados-Asignaturas',
    icon: 'auto_stories',
    description: 'Malla Curricular por Grado Escolar • Asignación oficial de materias según CNEB - MINEDU',
  }),
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
    route: '/personal',
    breadcrumbs: ['Personal', 'Personal Escolar'],
    title: 'Personal Escolar: Docentes y Colaboradores',
    icon: 'badge',
    description: 'Nómina de profesores titulares, personal administrativo y control de horas de cátedra contratadas',
  }),
  Object.freeze({
    route: '/calificaciones',
    breadcrumbs: ['Académico', 'Calificaciones'],
    title: 'Matriz Dinámica de Calificaciones MINEDU',
    icon: 'grade',
    description: 'Registro oficial de notas por periodo con candados de cierre RUL-004 y escala vigesimal',
  }),
  Object.freeze({
    route: '/notas',
    breadcrumbs: ['Académico', 'Calificaciones'],
    title: 'Matriz Dinámica de Calificaciones MINEDU',
    icon: 'grade',
    description: 'Registro oficial de notas por periodo con candados de cierre RUL-004 y escala vigesimal',
  }),
  Object.freeze({
    route: '/asistencia',
    breadcrumbs: ['Académico', 'Asistencia Diaria'],
    title: 'Control de Asistencia Diaria Escolar',
    icon: 'event_available',
    description: 'Registro de asistencia por aula y gestión de incidencias de convivencia escolar',
  }),
  Object.freeze({
    route: '/grados-secciones',
    breadcrumbs: ['Académico', 'Grados y Secciones'],
    title: 'Grados y Secciones',
    icon: 'class',
    description: 'Distribución y administración de aulas, grados y secciones',
  }),
  Object.freeze({
    route: '/niveles',
    breadcrumbs: ['Mantenimiento', 'Niveles Educativos'],
    title: 'Niveles Educativos',
    icon: 'stairs',
    description: 'Gestión y configuración de niveles de enseñanza escolar',
  }),
  Object.freeze({
    route: '/areas',
    breadcrumbs: ['Mantenimiento', 'Áreas Curriculares'],
    title: 'Áreas Curriculares',
    icon: 'category',
    description: 'Organización pedagógica de áreas de aprendizaje oficial según MINEDU',
  }),
]);

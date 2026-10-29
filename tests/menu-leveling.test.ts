// tests/menu-leveling.test.ts
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Interface replicas for pure test execution
interface TestMenu {
  id: string;
  code: string;
  key: string;
  label: string;
  icon: string;
  path: string | null;
  parent: string | null;
  order: number;
  enabled: boolean;
}

interface TestMenuNode extends TestMenu {
  children?: TestMenuNode[];
}

interface TestNavigationItem {
  label: string;
  icon: string;
  path?: string;
  children?: { label: string; icon?: string; path: string }[];
}

function buildMenuTree(menus: readonly TestMenu[]): TestMenuNode[] {
  const enabledMenus = menus.filter(m => m.enabled);
  const parentMenus = enabledMenus
    .filter(m => !m.parent)
    .sort((a, b) => a.order - b.order);

  return parentMenus.map(parent => {
    const children = enabledMenus
      .filter(child => child.parent === parent.id)
      .sort((a, b) => a.order - b.order);

    return {
      ...parent,
      children: children.length > 0 ? children : undefined
    };
  });
}

function transformToNavigationItems(tree: readonly TestMenuNode[]): TestNavigationItem[] {
  return tree.map(node => ({
    label: node.label,
    icon: node.icon,
    path: node.path || undefined,
    children: node.children?.map(c => ({
      label: c.label,
      icon: c.icon,
      path: c.path || ''
    }))
  }));
}

function computeIsYearLocked(status: 'PLANIFICACION' | 'ACTIVO' | 'CERRADO'): boolean {
  return status === 'CERRADO';
}

describe('Sesión 04.2: Nivelación Arquitectónica - Menú y Bloqueo de Año Escolar', () => {

  const mockMenus: TestMenu[] = [
    { id: '1', code: 'MEN-001', key: 'DASHBOARD', label: 'Panel de Control', icon: 'dashboard', path: '/dashboard', parent: null, order: 1, enabled: true },
    { id: '2', code: 'MEN-004', key: 'GROUP_ACADEMIC', label: 'Gestión Académica', icon: 'class', path: null, parent: null, order: 2, enabled: true },
    { id: '3', code: 'MEN-011', key: 'GRADE_SECTIONS', label: 'Salones y Secciones', icon: 'meeting_room', path: '/grados-secciones', parent: '2', order: 1, enabled: true },
    { id: '4', code: 'MEN-012', key: 'GRADE_SUBJECTS', label: 'Malla Curricular', icon: 'account_tree', path: '/grados-asignaturas', parent: '2', order: 2, enabled: true },
    { id: '5', code: 'MEN-013', key: 'SUBJECTS', label: 'Catálogo de Asignaturas', icon: 'menu_book', path: '/asignaturas', parent: '2', order: 3, enabled: true },
    { id: '6', code: 'MEN-009', key: 'GROUP_MAINTENANCE', label: 'Mantenimiento', icon: 'tune', path: null, parent: null, order: 3, enabled: true },
    { id: '7', code: 'MEN-014', key: 'LEVELS', label: 'Niveles Educativos', icon: 'stairs', path: '/niveles', parent: '6', order: 1, enabled: true },
    { id: '8', code: 'MEN-015', key: 'AREAS', label: 'Áreas Curriculares', icon: 'category', path: '/areas', parent: '6', order: 2, enabled: true },
    { id: '9', code: 'MEN-999', key: 'DISABLED_ITEM', label: 'Opción Deshabilitada', icon: 'block', path: '/test', parent: null, order: 99, enabled: false }
  ];

  it('TDD-01: buildMenuTree debe omitir items con enabled=false', () => {
    const tree = buildMenuTree(mockMenus);
    const disabled = tree.find(m => m.key === 'DISABLED_ITEM');
    assert.equal(disabled, undefined);
  });

  it('TDD-02: buildMenuTree debe ordenar los padres por el campo order ascendente', () => {
    const tree = buildMenuTree(mockMenus);
    assert.equal(tree.length, 3);
    assert.equal(tree[0].key, 'DASHBOARD');
    assert.equal(tree[1].key, 'GROUP_ACADEMIC');
    assert.equal(tree[2].key, 'GROUP_MAINTENANCE');
  });

  it('TDD-03: buildMenuTree debe anidar las opciones hijas dentro de su correspondiente Option Group', () => {
    const tree = buildMenuTree(mockMenus);
    const academicGroup = tree.find(m => m.key === 'GROUP_ACADEMIC');
    assert.ok(academicGroup);
    assert.equal(academicGroup?.children?.length, 3);
    assert.equal(academicGroup?.children?.[0].key, 'GRADE_SECTIONS');
    assert.equal(academicGroup?.children?.[1].key, 'GRADE_SUBJECTS');
    assert.equal(academicGroup?.children?.[2].key, 'SUBJECTS');
  });

  it('TDD-04: transformToNavigationItems debe generar contratos de Sidebar con Option Groups y subitems', () => {
    const tree = buildMenuTree(mockMenus);
    const navItems = transformToNavigationItems(tree);

    assert.equal(navItems.length, 3);
    // Dashboard es enlace directo
    assert.equal(navItems[0].path, '/dashboard');
    assert.equal(navItems[0].children, undefined);

    // Gestión Académica es un Option Group con 3 hijos
    assert.equal(navItems[1].label, 'Gestión Académica');
    assert.equal(navItems[1].path, undefined);
    assert.equal(navItems[1].children?.length, 3);
    assert.equal(navItems[1].children?.[0].path, '/grados-secciones');
    assert.equal(navItems[1].children?.[1].path, '/grados-asignaturas');
    assert.equal(navItems[1].children?.[2].path, '/asignaturas');
  });

  it('TDD-05: computeIsYearLocked debe bloquear solo cuando status es CERRADO', () => {
    assert.equal(computeIsYearLocked('CERRADO'), true, 'Año cerrado debe estar bloqueado');
    assert.equal(computeIsYearLocked('ACTIVO'), false, 'Año activo debe estar desbloqueado');
    assert.equal(computeIsYearLocked('PLANIFICACION'), false, 'Año en planificación debe estar desbloqueado');
  });
});

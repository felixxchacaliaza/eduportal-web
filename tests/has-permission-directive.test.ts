import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { AuthMenuItem } from '../src/app/features/auth/models/auth-menu-item.interface';
import { HasPermissionConfig } from '../src/app/shared/directives/has-permission/has-permission-config.interface';

describe('TDD Unit Tests - Sesión 07.1.1: Directiva Estructural RBAC *appHasPermission', () => {

  const mockAdminUser = {
    id: 'usr-admin',
    email: 'admin@eduportal.edu.pe',
    isSuperAdmin: true,
    menuTree: [] as AuthMenuItem[]
  };

  const mockTeacherUser = {
    id: 'usr-teacher',
    email: 'docente@eduportal.edu.pe',
    isSuperAdmin: false,
    menuTree: [
      {
        id: 'mnu-1',
        key: 'dashboard',
        label: 'Panel de Control',
        icon: 'dashboard',
        path: '/dashboard',
        accessLevel: 'READ_ONLY' as const
      },
      {
        id: 'mnu-2',
        key: 'students',
        label: 'Estudiantes',
        icon: 'people',
        path: '/alumnos',
        accessLevel: 'FULL' as const
      },
      {
        id: 'mnu-3',
        key: 'academic',
        label: 'Gestión Académica',
        icon: 'school',
        path: null,
        accessLevel: 'READ_ONLY' as const,
        children: [
          {
            id: 'mnu-3-1',
            key: 'grades',
            label: 'Calificaciones',
            icon: 'grade',
            path: '/notas',
            accessLevel: 'FULL' as const
          },
          {
            id: 'mnu-3-2',
            key: 'attendance',
            label: 'Asistencia Diaria',
            icon: 'fact_check',
            path: '/asistencia',
            accessLevel: 'READ_ONLY' as const
          }
        ]
      }
    ] as AuthMenuItem[]
  };

  function evaluatePermission(
    user: { isSuperAdmin: boolean; menuTree: readonly AuthMenuItem[] } | null,
    config: string | HasPermissionConfig
  ): boolean {
    if (!user) {
      return false;
    }

    if (user.isSuperAdmin) {
      return true;
    }

    const targetModule = (typeof config === 'string' ? config : config.module).toLowerCase();
    const requiredLevel = typeof config === 'string' ? 'READ_ONLY' : (config.level ?? 'READ_ONLY');

    return searchMenuPermission(user.menuTree, targetModule, requiredLevel);
  }

  function searchMenuPermission(
    items: readonly AuthMenuItem[],
    target: string,
    requiredLevel: 'FULL' | 'READ_ONLY'
  ): boolean {
    for (const item of items) {
      const keyMatch = item.key?.toLowerCase() === target;
      const cleanPath = item.path?.toLowerCase().replace(/^\//, '');
      const cleanTarget = target.replace(/^\//, '');
      const pathMatch = cleanPath === cleanTarget;

      if (keyMatch || pathMatch) {
        if (requiredLevel === 'FULL') {
          return item.accessLevel === 'FULL';
        }
        return item.accessLevel === 'FULL' || item.accessLevel === 'READ_ONLY';
      }

      if (item.children && item.children.length > 0) {
        if (searchMenuPermission(item.children, target, requiredLevel)) {
          return true;
        }
      }
    }

    return false;
  }

  describe('1. Regla Institucional: Super Administrador (Bypass Total)', () => {
    test('SuperAdmin debe tener acceso concedido a cualquier módulo (FULL y READ_ONLY)', () => {
      assert.equal(evaluatePermission(mockAdminUser, 'security'), true);
      assert.equal(evaluatePermission(mockAdminUser, { module: 'security', level: 'FULL' }), true);
      assert.equal(evaluatePermission(mockAdminUser, { module: 'non_existent_module', level: 'FULL' }), true);
      assert.equal(evaluatePermission(mockAdminUser, '/cualquier-ruta'), true);
    });
  });

  describe('2. Evaluación de Permisos para Usuario Regular (Docente)', () => {
    test('debe conceder acceso READ_ONLY a módulo configurado con nivel READ_ONLY', () => {
      assert.equal(evaluatePermission(mockTeacherUser, 'dashboard'), true);
      assert.equal(evaluatePermission(mockTeacherUser, { module: 'dashboard', level: 'READ_ONLY' }), true);
    });

    test('debe denegar acceso FULL a módulo configurado únicamente con nivel READ_ONLY', () => {
      assert.equal(evaluatePermission(mockTeacherUser, { module: 'dashboard', level: 'FULL' }), false);
    });

    test('debe conceder acceso tanto FULL como READ_ONLY a módulo con nivel FULL', () => {
      assert.equal(evaluatePermission(mockTeacherUser, 'students'), true);
      assert.equal(evaluatePermission(mockTeacherUser, { module: 'students', level: 'READ_ONLY' }), true);
      assert.equal(evaluatePermission(mockTeacherUser, { module: 'students', level: 'FULL' }), true);
    });

    test('debe denegar acceso a módulos que no existen en el perfil del usuario', () => {
      assert.equal(evaluatePermission(mockTeacherUser, 'security'), false);
      assert.equal(evaluatePermission(mockTeacherUser, { module: 'finances', level: 'FULL' }), false);
    });
  });

  describe('3. Búsqueda Jerárquica en Submódulos Anidados', () => {
    test('debe resolver permisos anidados en hijos de segundo nivel por key', () => {
      assert.equal(evaluatePermission(mockTeacherUser, { module: 'grades', level: 'FULL' }), true);
      assert.equal(evaluatePermission(mockTeacherUser, { module: 'attendance', level: 'READ_ONLY' }), true);
      assert.equal(evaluatePermission(mockTeacherUser, { module: 'attendance', level: 'FULL' }), false);
    });

    test('debe resolver permisos por coincidencia de ruta relativa o absoluta', () => {
      assert.equal(evaluatePermission(mockTeacherUser, '/alumnos'), true);
      assert.equal(evaluatePermission(mockTeacherUser, 'alumnos'), true);
      assert.equal(evaluatePermission(mockTeacherUser, { module: '/notas', level: 'FULL' }), true);
      assert.equal(evaluatePermission(mockTeacherUser, { module: '/notas', level: 'READ_ONLY' }), true);
    });
  });

  describe('4. Robustez ante Entradas Nulas o Sesiones Cerradas', () => {
    test('debe retornar false si el usuario en sesión es nulo', () => {
      assert.equal(evaluatePermission(null, 'students'), false);
      assert.equal(evaluatePermission(null, { module: 'students', level: 'FULL' }), false);
    });

    test('debe manejar configuraciones vacías de forma segura sin excepciones', () => {
      assert.equal(evaluatePermission(mockTeacherUser, ''), false);
      assert.equal(evaluatePermission(mockTeacherUser, { module: '' }), false);
    });
  });

  describe('5. Simulación de Comportamiento de TemplateRef y ViewContainerRef', () => {
    class MockViewContainer {
      public rendered = false;
      public renderedElse = false;

      clear() {
        this.rendered = false;
        this.renderedElse = false;
      }

      createEmbeddedView(isElse = false) {
        if (isElse) {
          this.renderedElse = true;
        } else {
          this.rendered = true;
        }
      }
    }

    test('debe renderizar la vista principal cuando se concede el permiso', () => {
      const container = new MockViewContainer();
      const hasAccess = evaluatePermission(mockTeacherUser, 'students');

      container.clear();
      if (hasAccess) {
        container.createEmbeddedView(false);
      } else {
        container.createEmbeddedView(true);
      }

      assert.equal(container.rendered, true);
      assert.equal(container.renderedElse, false);
    });

    test('debe renderizar la vista alternativa (else) cuando se deniega el permiso', () => {
      const container = new MockViewContainer();
      const hasAccess = evaluatePermission(mockTeacherUser, 'security');

      container.clear();
      if (hasAccess) {
        container.createEmbeddedView(false);
      } else {
        container.createEmbeddedView(true);
      }

      assert.equal(container.rendered, false);
      assert.equal(container.renderedElse, true);
    });
  });

});

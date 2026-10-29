import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { AuthMenuItem, AuthUser } from '../src/app/features/auth/models';

describe('TDD Unit Tests - Sesión 07.0.0: Seguridad Web, Login y RBAC', () => {

  describe('1. Form Triad Logic & Validation Rules', () => {
    function validateEmail(email: string): boolean {
      if (!email || typeof email !== 'string') return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    }

    function validatePassword(password: string): boolean {
      if (!password || typeof password !== 'string') return false;
      return password.trim().length >= 6;
    }

    test('debe validar correos electrónicos institucionales válidos', () => {
      assert.equal(validateEmail('root@eduportal.edu.pe'), true);
      assert.equal(validateEmail('docente@eduportal.edu.pe'), true);
      assert.equal(validateEmail('director.academico@colegio.edu'), true);
    });

    test('debe rechazar correos electrónicos con formato inválido', () => {
      assert.equal(validateEmail(''), false);
      assert.equal(validateEmail('sin-arroba.pe'), false);
      assert.equal(validateEmail('@eduportal.edu.pe'), false);
      assert.equal(validateEmail('usuario@'), false);
    });

    test('debe validar contraseñas de al menos 6 caracteres', () => {
      assert.equal(validatePassword('Admin123*'), true);
      assert.equal(validatePassword('123456'), true);
      assert.equal(validatePassword('abcdef'), true);
    });

    test('debe rechazar contraseñas con menos de 6 caracteres o vacías', () => {
      assert.equal(validatePassword(''), false);
      assert.equal(validatePassword('12345'), false);
      assert.equal(validatePassword('abc'), false);
    });
  });

  describe('2. Transformación de Menú RBAC a NavigationItem', () => {
    function transformMenuToNavigation(menus: readonly AuthMenuItem[]): any[] {
      if (!menus || menus.length === 0) return [];
      return menus.map(item => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;
        if (hasChildren) {
          return {
            label: item.label,
            icon: item.icon,
            children: item.children!.map(child => ({
              label: child.label,
              icon: child.icon,
              path: child.path || ''
            }))
          };
        }
        return {
          label: item.label,
          icon: item.icon,
          path: item.path || ''
        };
      });
    }

    const mockMenu: AuthMenuItem[] = [
      {
        id: '1',
        key: 'DASHBOARD',
        label: 'Panel de Control',
        icon: 'dashboard',
        path: '/dashboard',
        accessLevel: 'FULL'
      },
      {
        id: '2',
        key: 'GROUP_ACADEMIC',
        label: 'Gestión Académica',
        icon: 'class',
        path: null,
        accessLevel: 'FULL',
        children: [
          {
            id: '21',
            key: 'SUBJECTS',
            label: 'Asignaturas',
            icon: 'menu_book',
            path: '/asignaturas',
            accessLevel: 'FULL'
          },
          {
            id: '22',
            key: 'AREAS',
            label: 'Áreas',
            icon: 'category',
            path: '/areas',
            accessLevel: 'READ_ONLY'
          }
        ]
      }
    ];

    test('debe mapear items planos de primer nivel correctamente', () => {
      const result = transformMenuToNavigation(mockMenu);
      assert.equal(result.length, 2);
      assert.equal(result[0].label, 'Panel de Control');
      assert.equal(result[0].path, '/dashboard');
      assert.equal(result[0].icon, 'dashboard');
      assert.equal(result[0].children, undefined);
    });

    test('debe jerarquizar grupos desplegables y sus submódulos hijos', () => {
      const result = transformMenuToNavigation(mockMenu);
      const group = result[1];
      assert.equal(group.label, 'Gestión Académica');
      assert.equal(group.children?.length, 2);
      assert.equal(group.children[0].label, 'Asignaturas');
      assert.equal(group.children[0].path, '/asignaturas');
      assert.equal(group.children[1].label, 'Áreas');
      assert.equal(group.children[1].path, '/areas');
    });

    test('debe manejar colecciones vacías de menú sin emitir excepciones', () => {
      const result = transformMenuToNavigation([]);
      assert.deepEqual(result, []);
    });
  });

  describe('3. Computación de Estado del Usuario y Avatar', () => {
    function computeInitials(fullName: string | undefined, email: string): string {
      if (!fullName || fullName.trim().length === 0) {
        return (email || 'EP').substring(0, 2).toUpperCase();
      }
      const parts = fullName.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return fullName.slice(0, 2).toUpperCase();
    }

    test('debe extraer las dos iniciales de nombres compuestos', () => {
      assert.equal(computeInitials('Félix Chacaliaza Flores', 'root@eduportal.edu.pe'), 'FC');
      assert.equal(computeInitials('Roberto Mendoza', 'roberto@eduportal.edu.pe'), 'RM');
    });

    test('debe usar las dos primeras letras si el nombre es simple o ausente', () => {
      assert.equal(computeInitials('Docente', 'docente@eduportal.edu.pe'), 'DO');
      assert.equal(computeInitials('', 'admin@eduportal.edu.pe'), 'AD');
    });
  });

  describe('4. Construcción de Cabeceras Bearer JWT', () => {
    function createAuthHeaders(token: string | null): Record<string, string> {
      if (!token) return {};
      return { Authorization: `Bearer ${token}` };
    }

    test('debe generar la cabecera Authorization Bearer si existe token', () => {
      const headers = createAuthHeaders('jwt.test.token');
      assert.equal(headers['Authorization'], 'Bearer jwt.test.token');
    });

    test('debe retornar objeto vacío si el token es nulo o vacío', () => {
      assert.deepEqual(createAuthHeaders(null), {});
      assert.deepEqual(createAuthHeaders(''), {});
    });
  });

});

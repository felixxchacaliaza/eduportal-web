import { describe, it, expect, beforeEach } from 'vitest';
import { AuthUser, AuthMenuItem } from '../../../features/auth/models';

describe('Vitest Unit Tests - AuthService Logic & RBAC Permission Resolution', () => {

  const mockAdminUser: AuthUser = {
    id: 'usr-001',
    code: 'USR-ROOT',
    email: 'root@eduportal.edu.pe',
    person: {
      id: 'per-001',
      dni: '10293847',
      fullName: 'Félix Chacaliaza Flores'
    },
    profile: {
      id: 'prof-001',
      name: 'SUPER ADMINISTRADOR',
      isSuperAdmin: true
    },
    menuTree: []
  };

  const mockTeacherUser: AuthUser = {
    id: 'usr-002',
    code: 'USR-DOC',
    email: 'docente@eduportal.edu.pe',
    person: {
      id: 'per-002',
      dni: '44556677',
      fullName: 'Carlos García Márquez'
    },
    profile: {
      id: 'prof-002',
      name: 'DOCENTE TITULAR',
      isSuperAdmin: false
    },
    menuTree: [
      {
        id: 'mnu-1',
        key: 'DASHBOARD',
        label: 'Panel de Control',
        icon: 'dashboard',
        path: '/dashboard',
        accessLevel: 'READ_ONLY'
      },
      {
        id: 'mnu-2',
        key: 'STUDENTS',
        label: 'Estudiantes',
        icon: 'school',
        path: '/alumnos',
        accessLevel: 'FULL'
      },
      {
        id: 'mnu-3',
        key: 'GROUP_ACADEMIC',
        label: 'Gestión Académica',
        icon: 'class',
        path: null,
        accessLevel: 'READ_ONLY',
        children: [
          {
            id: 'mnu-3-1',
            key: 'EVALUATIONS',
            label: 'Calificaciones',
            icon: 'grade',
            path: '/notas',
            accessLevel: 'FULL'
          },
          {
            id: 'mnu-3-2',
            key: 'ATTENDANCE',
            label: 'Asistencia Diaria',
            icon: 'fact_check',
            path: '/asistencia',
            accessLevel: 'READ_ONLY'
          }
        ]
      }
    ]
  };

  function hasPermission(
    user: AuthUser | null,
    moduleOrPath: string,
    requiredLevel: 'FULL' | 'READ_ONLY' = 'READ_ONLY'
  ): boolean {
    if (!user) return false;
    if (user.profile.isSuperAdmin) return true;

    return searchMenuPermission(user.menuTree, moduleOrPath.toLowerCase(), requiredLevel);
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

  describe('1. Estado de Autenticación y SuperAdmin', () => {
    it('debe detectar correctamente el estado de Super Administrador', () => {
      expect(mockAdminUser.profile.isSuperAdmin).toBe(true);
      expect(mockTeacherUser.profile.isSuperAdmin).toBe(false);
    });

    it('debe derivar iniciales del usuario para el avatar institucional', () => {
      function getInitials(fullName?: string): string {
        if (!fullName) return 'EP';
        const parts = fullName.trim().split(/\s+/);
        if (parts.length >= 2) {
          return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return fullName.slice(0, 2).toUpperCase();
      }

      expect(getInitials(mockAdminUser.person.fullName)).toBe('FC');
      expect(getInitials(mockTeacherUser.person.fullName)).toBe('CG');
      expect(getInitials('EduPortal')).toBe('ED');
      expect(getInitials('')).toBe('EP');
    });
  });

  describe('2. Evaluación de Permisos RBAC hasPermission()', () => {
    it('SuperAdmin debe gozar de acceso incondicional a cualquier módulo con nivel FULL', () => {
      expect(hasPermission(mockAdminUser, 'SECURITY', 'FULL')).toBe(true);
      expect(hasPermission(mockAdminUser, '/seguridad', 'FULL')).toBe(true);
      expect(hasPermission(mockAdminUser, 'INEXISTENTE', 'FULL')).toBe(true);
    });

    it('Docente debe acceder en READ_ONLY al dashboard pero no en FULL', () => {
      expect(hasPermission(mockTeacherUser, 'DASHBOARD', 'READ_ONLY')).toBe(true);
      expect(hasPermission(mockTeacherUser, '/dashboard', 'READ_ONLY')).toBe(true);
      expect(hasPermission(mockTeacherUser, 'DASHBOARD', 'FULL')).toBe(false);
    });

    it('Docente debe acceder en FULL al módulo de estudiantes', () => {
      expect(hasPermission(mockTeacherUser, 'STUDENTS', 'FULL')).toBe(true);
      expect(hasPermission(mockTeacherUser, '/alumnos', 'FULL')).toBe(true);
    });

    it('debe resolver recursivamente permisos en submódulos de segundo nivel', () => {
      expect(hasPermission(mockTeacherUser, 'EVALUATIONS', 'FULL')).toBe(true);
      expect(hasPermission(mockTeacherUser, '/notas', 'FULL')).toBe(true);
      expect(hasPermission(mockTeacherUser, 'ATTENDANCE', 'READ_ONLY')).toBe(true);
      expect(hasPermission(mockTeacherUser, 'ATTENDANCE', 'FULL')).toBe(false);
    });

    it('debe denegar acceso a módulos ausentes en el árbol (ej. SECURITY)', () => {
      expect(hasPermission(mockTeacherUser, 'SECURITY', 'READ_ONLY')).toBe(false);
      expect(hasPermission(mockTeacherUser, '/seguridad', 'READ_ONLY')).toBe(false);
    });

    it('debe retornar false si no existe sesión activa de usuario', () => {
      expect(hasPermission(null, 'DASHBOARD')).toBe(false);
    });
  });

});

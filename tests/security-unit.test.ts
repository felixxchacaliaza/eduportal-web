import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { User, Profile, ProfilePermission, PermissionLevel } from '../src/app/features/security/models';
import { USER_FORM_DEFAULTS } from '../src/app/features/security/components/user-save-dialog/models/user-form.constant';
import { PROFILE_FORM_DEFAULTS } from '../src/app/features/security/components/profile-save-dialog/models/profile-form.constant';

describe('TDD Unit Tests - Sesión 07.1.0: Administración de Usuarios y Perfiles RBAC', () => {

  const mockProfiles: Profile[] = [
    {
      id: 'prof-001',
      code: 'SUPER_ADMIN',
      name: 'Super Administrador',
      description: 'Acceso total e irrestricto al sistema escolar',
      isSuperAdmin: true,
      enabled: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      permissions: [
        { menu: { id: 'm-1', name: 'Dashboard', code: 'MNU_DASH', icon: 'dashboard', order: 1 }, permissionLevel: 'FULL' },
        { menu: { id: 'm-2', name: 'Alumnos', code: 'MNU_STU', icon: 'people', order: 2 }, permissionLevel: 'FULL' },
        { menu: { id: 'm-3', name: 'Seguridad', code: 'MNU_SEC', icon: 'security', order: 3 }, permissionLevel: 'FULL' }
      ]
    },
    {
      id: 'prof-002',
      code: 'DOCENTE',
      name: 'Docente Titular',
      description: 'Registro de calificaciones y asistencia escolar',
      isSuperAdmin: false,
      enabled: true,
      createdAt: '2026-01-10T00:00:00.000Z',
      permissions: [
        { menu: { id: 'm-1', name: 'Dashboard', code: 'MNU_DASH', icon: 'dashboard', order: 1 }, permissionLevel: 'READ_ONLY' },
        { menu: { id: 'm-2', name: 'Alumnos', code: 'MNU_STU', icon: 'people', order: 2 }, permissionLevel: 'FULL' },
        { menu: { id: 'm-3', name: 'Seguridad', code: 'MNU_SEC', icon: 'security', order: 3 }, permissionLevel: 'NONE' }
      ]
    },
    {
      id: 'prof-003',
      code: 'SECRETARIA',
      name: 'Secretaría Académica',
      description: 'Gestión de matrículas y padrón institucional',
      isSuperAdmin: false,
      enabled: false,
      createdAt: '2026-01-15T00:00:00.000Z',
      permissions: []
    }
  ];

  const mockUsers: User[] = [
    {
      id: 'usr-001',
      code: 'USR-ROOT',
      email: 'root@eduportal.edu.pe',
      personId: 'per-001',
      person: { id: 'per-001', dni: '10293847', fullName: 'Félix Chacaliaza Flores' },
      profileId: 'prof-001',
      profile: mockProfiles[0],
      isProtected: true,
      enabled: true,
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'usr-002',
      code: 'USR-DOC-01',
      email: 'docente.garcia@eduportal.edu.pe',
      personId: 'per-002',
      person: { id: 'per-002', dni: '44556677', fullName: 'Carlos García Márquez' },
      profileId: 'prof-002',
      profile: mockProfiles[1],
      isProtected: false,
      enabled: true,
      createdAt: '2026-02-01T00:00:00.000Z'
    },
    {
      id: 'usr-003',
      code: 'USR-SEC-01',
      email: 'secretaria@eduportal.edu.pe',
      personId: 'per-003',
      person: { id: 'per-003', dni: '77889900', fullName: 'Ana María Rossi' },
      profileId: 'prof-003',
      profile: mockProfiles[2],
      isProtected: false,
      enabled: false,
      createdAt: '2026-02-15T00:00:00.000Z'
    }
  ];

  describe('1. Regla Arquitectónica: Inmutabilidad de Modelos y Defaults de Formulario', () => {
    test('USER_FORM_DEFAULTS debe ser un objeto consistente para inicialización', () => {
      assert.equal(USER_FORM_DEFAULTS.email, '');
      assert.equal(USER_FORM_DEFAULTS.password, '');
      assert.equal(USER_FORM_DEFAULTS.person, '');
      assert.equal(USER_FORM_DEFAULTS.profile, '');
      assert.equal(USER_FORM_DEFAULTS.enabled, true);
    });

    test('PROFILE_FORM_DEFAULTS debe ser un objeto consistente para inicialización', () => {
      assert.equal(PROFILE_FORM_DEFAULTS.name, '');
      assert.equal(PROFILE_FORM_DEFAULTS.description, '');
      assert.equal(PROFILE_FORM_DEFAULTS.isSuperAdmin, false);
      assert.equal(PROFILE_FORM_DEFAULTS.enabled, true);
    });
  });

  describe('2. Form Triad & Validaciones de Usuario', () => {
    function validateUserFormData(data: { email: string; password?: string; personId: string; profileId: string; isEdit: boolean }): { valid: boolean; errors: string[] } {
      const errors: string[] = [];
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!data.email || !emailRegex.test(data.email.trim())) {
        errors.push('El correo electrónico institucional es inválido');
      }
      if (!data.personId) {
        errors.push('Debe vincular a una persona titular');
      }
      if (!data.profileId) {
        errors.push('Debe asignar un perfil institucional');
      }
      if (!data.isEdit && (!data.password || data.password.trim().length < 6)) {
        errors.push('La contraseña debe contener al menos 6 caracteres');
      }

      return { valid: errors.length === 0, errors };
    }

    test('debe validar formulario completo para creación de nuevo usuario', () => {
      const result = validateUserFormData({
        email: 'nuevo.usuario@eduportal.edu.pe',
        password: 'Password123*',
        personId: 'per-004',
        profileId: 'prof-002',
        isEdit: false
      });
      assert.equal(result.valid, true);
      assert.equal(result.errors.length, 0);
    });

    test('debe rechazar creación sin contraseña o con contraseña menor a 6 caracteres', () => {
      const result = validateUserFormData({
        email: 'nuevo.usuario@eduportal.edu.pe',
        password: '123',
        personId: 'per-004',
        profileId: 'prof-002',
        isEdit: false
      });
      assert.equal(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('contraseña')));
    });

    test('debe permitir edición de usuario sin ingresar nueva contraseña (mantiene la anterior)', () => {
      const result = validateUserFormData({
        email: 'usuario.editado@eduportal.edu.pe',
        personId: 'per-004',
        profileId: 'prof-002',
        isEdit: true
      });
      assert.equal(result.valid, true);
    });

    test('debe exigir persona y perfil institucional obligatorios', () => {
      const result = validateUserFormData({
        email: 'test@eduportal.edu.pe',
        password: 'Password123*',
        personId: '',
        profileId: '',
        isEdit: false
      });
      assert.equal(result.valid, false);
      assert.equal(result.errors.length, 2);
    });
  });

  describe('3. Form Triad & Validaciones de Perfil RBAC', () => {
    function validateProfileFormData(data: { name: string; code?: string }): { valid: boolean; errors: string[] } {
      const errors: string[] = [];

      if (!data.name || data.name.trim().length < 3) {
        errors.push('El nombre del perfil debe tener al menos 3 caracteres');
      }
      if (data.code && !/^[A-Z0-9_-]{3,20}$/.test(data.code.trim().toUpperCase())) {
        errors.push('El código de perfil debe ser alfanumérico en mayúsculas (3-20 caracteres)');
      }

      return { valid: errors.length === 0, errors };
    }

    test('debe validar perfiles institucionales válidos', () => {
      const result = validateProfileFormData({
        name: 'Coordinador Académico',
        code: 'COORD_ACAD'
      });
      assert.equal(result.valid, true);
    });

    test('debe rechazar nombres demasiado cortos y códigos con formato inválido', () => {
      const result = validateProfileFormData({
        name: 'AB',
        code: 'coordinador con espacios'
      });
      assert.equal(result.valid, false);
      assert.equal(result.errors.length, 2);
    });
  });

  describe('4. Regla Institucional RN-SEG-02: Cuentas y Perfiles Protegidos', () => {
    function canToggleUser(user: User): { allowed: boolean; reason?: string } {
      if (user.isProtected) {
        return {
          allowed: false,
          reason: 'RN-SEG-02: La cuenta raíz Super Usuario se encuentra protegida contra desactivación'
        };
      }
      return { allowed: true };
    }

    function canToggleProfile(profile: Profile): { allowed: boolean; reason?: string } {
      if (profile.isSuperAdmin) {
        return {
          allowed: false,
          reason: 'RN-SEG-02: El perfil SUPER_ADMIN no puede ser inhabilitado del sistema'
        };
      }
      return { allowed: true };
    }

    test('debe bloquear la desactivación de cuenta de usuario con isProtected = true', () => {
      const rootUser = mockUsers[0];
      const check = canToggleUser(rootUser);
      assert.equal(check.allowed, false);
      assert.ok(check.reason?.includes('RN-SEG-02'));
    });

    test('debe permitir la alternancia de estado en cuentas regulares', () => {
      const normalUser = mockUsers[1];
      const check = canToggleUser(normalUser);
      assert.equal(check.allowed, true);
    });

    test('debe bloquear la desactivación del perfil SuperAdmin', () => {
      const superProfile = mockProfiles[0];
      const check = canToggleProfile(superProfile);
      assert.equal(check.allowed, false);
      assert.ok(check.reason?.includes('SUPER_ADMIN'));
    });

    test('debe permitir la desactivación de perfiles regulares', () => {
      const teacherProfile = mockProfiles[1];
      const check = canToggleProfile(teacherProfile);
      assert.equal(check.allowed, true);
    });
  });

  describe('5. Cálculo Matemático de KPIs de Seguridad', () => {
    function calculateSecurityKpis(users: User[], profiles: Profile[]) {
      const totalUsers = users.length;
      const activeUsers = users.filter(u => u.enabled).length;
      const protectedUsers = users.filter(u => u.isProtected).length;
      const totalProfiles = profiles.length;
      return {
        totalUsers,
        activeUsers,
        protectedUsers,
        totalProfiles
      };
    }

    test('debe calcular métricas institucionales con exactitud matemática', () => {
      const kpis = calculateSecurityKpis(mockUsers, mockProfiles);

      assert.equal(kpis.totalUsers, 3);
      assert.equal(kpis.activeUsers, 2);
      assert.equal(kpis.protectedUsers, 1);
      assert.equal(kpis.totalProfiles, 3);
    });
  });

  describe('6. Filtrado Reactivo de Cuentas de Usuario', () => {
    function filterUsers(users: User[], search: string): User[] {
      const term = search.trim().toLowerCase();
      if (!term) return users;
      return users.filter(user =>
        (user.email?.toLowerCase().includes(term) ?? false) ||
        (user.code?.toLowerCase().includes(term) ?? false) ||
        (user.person?.fullName?.toLowerCase().includes(term) ?? false) ||
        (user.person?.dni?.toLowerCase().includes(term) ?? false) ||
        (user.profile?.name?.toLowerCase().includes(term) ?? false)
      );
    }

    test('debe filtrar por coincidencia de correo electrónico', () => {
      const filtered = filterUsers(mockUsers, 'docente');
      assert.equal(filtered.length, 1);
      assert.equal(filtered[0].email, 'docente.garcia@eduportal.edu.pe');
    });

    test('debe filtrar por coincidencia de DNI de la persona asociada', () => {
      const filtered = filterUsers(mockUsers, '10293847');
      assert.equal(filtered.length, 1);
      assert.equal(filtered[0].person?.fullName, 'Félix Chacaliaza Flores');
    });

    test('debe filtrar por coincidencia en el nombre del perfil asignado', () => {
      const filtered = filterUsers(mockUsers, 'Secretaría');
      assert.equal(filtered.length, 1);
      assert.equal(filtered[0].profile?.name, 'Secretaría Académica');
    });

    test('debe retornar todos los usuarios si el término de búsqueda está vacío', () => {
      const filtered = filterUsers(mockUsers, '');
      assert.equal(filtered.length, 3);
    });
  });

  describe('7. Filtrado Reactivo de Perfiles RBAC', () => {
    function filterProfiles(profiles: Profile[], search: string): Profile[] {
      const term = search.trim().toLowerCase();
      if (!term) return profiles;
      return profiles.filter(profile =>
        (profile.name?.toLowerCase().includes(term) ?? false) ||
        (profile.code?.toLowerCase().includes(term) ?? false) ||
        (profile.description?.toLowerCase().includes(term) ?? false)
      );
    }

    test('debe filtrar perfiles por nombre o código', () => {
      const filtered = filterProfiles(mockProfiles, 'SUPER');
      assert.equal(filtered.length, 1);
      assert.equal(filtered[0].code, 'SUPER_ADMIN');
    });
  });

  describe('8. Matriz de Permisos RBAC: Niveles y Transiciones', () => {
    const validLevels: PermissionLevel[] = ['NONE', 'READ_ONLY', 'FULL'];

    test('debe asegurar que todos los niveles de permisos sean reconocidos', () => {
      assert.equal(validLevels.includes('NONE'), true);
      assert.equal(validLevels.includes('READ_ONLY'), true);
      assert.equal(validLevels.includes('FULL'), true);
    });

    test('debe mapear correctamente los permisos de un perfil asignado a cada módulo', () => {
      const teacherProfile = mockProfiles[1];
      const permissionsMap = new Map<string, PermissionLevel>();
      teacherProfile.permissions.forEach(p => {
        permissionsMap.set(p.menu.code, p.permissionLevel);
      });

      assert.equal(permissionsMap.get('MNU_DASH'), 'READ_ONLY');
      assert.equal(permissionsMap.get('MNU_STU'), 'FULL');
      assert.equal(permissionsMap.get('MNU_SEC'), 'NONE');
    });
  });

});

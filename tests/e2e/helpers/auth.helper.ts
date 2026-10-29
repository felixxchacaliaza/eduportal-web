import { Page } from '@playwright/test';

/**
 * Helper para pre-autenticar la sesión en pruebas E2E de Playwright.
 * Inyecta las credenciales de SuperAdmin en localStorage antes de que Angular inicialice.
 */
export async function authenticateTestSession(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const mockUser = {
      id: '6ae22a9398145a49c3a57489',
      code: 'USR-001',
      email: 'root@eduportal.edu.pe',
      person: {
        id: '6ae22a9398145a49c3a5748a',
        dni: '10293847',
        fullName: 'Félix Chacaliaza Flores'
      },
      profile: {
        id: '6ae22a9398145a49c3a5748b',
        name: 'SUPER ADMINISTRADOR',
        isSuperAdmin: true
      },
      menuTree: []
    };

    window.localStorage.setItem('eduportal_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mock');
    window.localStorage.setItem('eduportal_user', JSON.stringify(mockUser));
  });
}

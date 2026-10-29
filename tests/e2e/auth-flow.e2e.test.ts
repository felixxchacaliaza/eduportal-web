import { test, expect } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';

test.describe('E2E Real Browser Tests - Seguridad Web, Login JWT y Multi-Layout (sesion-07.0.0)', () => {
  // El flujo de autenticación debe comenzar sin sesión previa
  test.use({ storageState: { cookies: [], origins: [] } });

  const artifactsImgDir = 'C:\\Users\\felix\\.gemini\\antigravity\\brain\\d45d2570-ff9b-437a-bd34-dd8333006cc2\\img';
  const repoDocImgDir = 'C:\\Users\\felix\\Desktop\\sdd-course-engine\\courses\\eduportal-angular22\\img';

  test.beforeAll(() => {
    if (!fs.existsSync(artifactsImgDir)) {
      fs.mkdirSync(artifactsImgDir, { recursive: true });
    }
    if (!fs.existsSync(repoDocImgDir)) {
      fs.mkdirSync(repoDocImgDir, { recursive: true });
    }
  });

  test('E2E-01: Redirección automática de authGuard hacia /login y vista AuthLayout', async ({ page }) => {
    // 1. Intentar acceder directamente a una ruta protegida
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 2. Verificar que authGuard redirigió a /login con returnUrl
    await expect(page).toHaveURL(/\/login/);

    // 3. Verificar que AuthLayout se renderiza y NO existen Navbar ni Sidebar
    const authHero = page.locator('.login-page__hero');
    await expect(authHero).toBeVisible();

    const navbar = page.locator('app-navbar');
    await expect(navbar).not.toBeAttached();

    const sidebar = page.locator('app-sidebar');
    await expect(sidebar).not.toBeAttached();

    // 4. Verificar elementos del formulario
    const emailInput = page.locator('[data-testid="login-email-input"]');
    const passwordInput = page.locator('[data-testid="login-password-input"]');
    const submitBtn = page.locator('[data-testid="login-submit-btn"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    // 5. Capturar screenshot de pantalla completa del Login
    const screenshotPath1 = path.join(artifactsImgDir, 'sesion-07-login-pantalla.png');
    const screenshotPath2 = path.join(repoDocImgDir, 'sesion-07-login-pantalla.png');
    await page.screenshot({ path: screenshotPath1, fullPage: true });
    fs.copyFileSync(screenshotPath1, screenshotPath2);
  });

  test('E2E-02: Rechazo de credenciales incorrectas y mensaje reactivo de error', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // 1. Ingresar credenciales erróneas
    await page.locator('[data-testid="login-email-input"]').fill('inexistente@eduportal.edu.pe');
    await page.locator('[data-testid="login-password-input"]').fill('ClaveInvalida123');

    // 2. Enviar formulario
    await page.locator('[data-testid="login-submit-btn"]').click();

    // 3. Validar presencia del banner de error reactivo
    const errorAlert = page.locator('[data-testid="login-error-alert"]');
    await expect(errorAlert).toBeVisible({ timeout: 5000 });
    await expect(errorAlert).toContainText(/inválidas|incorrectas|error/i);

    // 4. Continuar en /login
    await expect(page).toHaveURL(/\/login/);
  });

  test('E2E-03: Login exitoso, acceso a Dashboard autenticado y Sidebar RBAC', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // 1. Usar selector rápido de SuperAdmin
    const superAdminBtn = page.locator('[data-testid="role-superadmin-btn"]');
    await expect(superAdminBtn).toBeVisible();
    await superAdminBtn.click();

    // 2. Verificar que los inputs se hayan autocompletado
    const emailInput = page.locator('[data-testid="login-email-input"]');
    await expect(emailInput).toHaveValue('root@eduportal.edu.pe');

    // 3. Enviar formulario de login
    await page.locator('[data-testid="login-submit-btn"]').click();

    // 4. Esperar redirección al Dashboard bajo MainLayout
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // 5. Validar que Navbar y Sidebar están ahora activos en el DOM
    const navbar = page.locator('app-navbar');
    await expect(navbar).toBeVisible();

    const sidebar = page.locator('app-sidebar');
    await expect(sidebar).toBeVisible();

    // 6. Validar datos del usuario autenticado en Navbar
    const userName = page.locator('[data-testid="navbar-user-name"]');
    await expect(userName).toBeVisible();
    await expect(userName).toContainText(/Félix Chacaliaza|root/i);

    // 7. Capturar screenshot de pantalla completa del Dashboard autenticado
    const screenshotPath1 = path.join(artifactsImgDir, 'sesion-07-dashboard-autenticado.png');
    const screenshotPath2 = path.join(repoDocImgDir, 'sesion-07-dashboard-autenticado.png');
    await page.screenshot({ path: screenshotPath1, fullPage: true });
    fs.copyFileSync(screenshotPath1, screenshotPath2);
  });

  test('E2E-04: Cierre de Sesión (Logout) y expulsión a /login', async ({ page }) => {
    // 1. Iniciar sesión primero
    await page.goto('/login');
    await page.locator('[data-testid="role-superadmin-btn"]').click();
    await page.locator('[data-testid="login-submit-btn"]').click();
    await page.waitForURL(/\/dashboard/);

    // 2. Presionar botón de logout en Navbar
    const logoutBtn = page.locator('[data-testid="logout-btn"]');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // 3. Validar expulsión inmediata a /login
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);

    // 4. Intentar volver a /dashboard mediante historial y verificar bloqueo
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

});

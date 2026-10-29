import { test, expect } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';

test.describe('E2E Real Browser Tests - Módulo Administración de Usuarios y Perfiles RBAC (sesion-07.1.0)', () => {

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

  test.beforeEach(async ({ page }) => {
    // Navegar directamente a la ruta de Administración de Seguridad
    await page.goto('/seguridad');
    await page.waitForLoadState('networkidle');
  });

  test('E2E-01: Carga de Módulo de Seguridad, Métricas KPI y Padrón de Cuentas de Usuario', async ({ page }) => {
    // 1. Validar cabecera institucional
    const title = page.locator('.security-page__title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Seguridad y Control de Acceso');

    // 2. Validar que las 4 tarjetas KPI estén renderizadas
    const kpiCards = page.locator('app-info-card');
    await expect(kpiCards).toHaveCount(4);
    await expect(kpiCards.nth(0)).toContainText('Total Cuentas');
    await expect(kpiCards.nth(1)).toContainText('Usuarios Activos');
    await expect(kpiCards.nth(2)).toContainText('Cuentas Protegidas');
    await expect(kpiCards.nth(3)).toContainText('Perfiles RBAC');

    // 3. Validar presencia de la tabla de usuarios
    const usersTable = page.locator('[data-testid="users-table"]');
    await expect(usersTable).toBeVisible();

    // 4. Validar filas de usuarios cargadas desde la API
    const rows = usersTable.locator('tbody tr');
    await expect(rows).not.toHaveCount(0);

    // 5. Validar que la cuenta protegida SuperAdmin tenga su chip distintivo
    const protectedChip = page.locator('.status-chip--protected').first();
    await expect(protectedChip).toBeVisible();
    await expect(protectedChip).toContainText('Protegido');

    // 6. Capturar screenshot de pantalla completa para documentación oficial
    const screenshotPath1 = path.join(artifactsImgDir, 'sesion-07.1-usuarios-gestion.png');
    const screenshotPath2 = path.join(repoDocImgDir, 'sesion-07.1-usuarios-gestion.png');
    await page.screenshot({ path: screenshotPath1, fullPage: true });
    fs.copyFileSync(screenshotPath1, screenshotPath2);
  });

  test('E2E-02: Filtro Reactivo de Búsqueda de Usuarios y Regla RN-SEG-02', async ({ page }) => {
    const searchInput = page.locator('[data-testid="security-search-input"]');
    await expect(searchInput).toBeVisible();

    // 1. Filtrar por correo del usuario raíz
    await searchInput.fill('root@eduportal.edu.pe');
    await page.waitForTimeout(300);

    // 2. Verificar que la tabla solo muestre la cuenta raíz coincidente
    const rows = page.locator('[data-testid="users-table"] tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('root@eduportal.edu.pe');

    // 3. Limpiar filtro
    await searchInput.fill('');
    await page.waitForTimeout(300);
    const resetRows = page.locator('[data-testid="users-table"] tbody tr');
    const count = await resetRows.count();
    expect(count).toBeGreaterThan(1);
  });

  test('E2E-03: Pestaña de Perfiles RBAC y Matriz de Permisos por Módulo', async ({ page }) => {
    // 1. Cambiar a la pestaña "Perfiles y Permisos RBAC"
    const profilesTab = page.locator('.mat-mdc-tab').filter({ hasText: 'Perfiles y Permisos RBAC' });
    await expect(profilesTab).toBeVisible();
    await profilesTab.click();
    await page.waitForTimeout(300);

    // 2. Validar que la tabla de perfiles esté visible
    const profilesTable = page.locator('[data-testid="profiles-table"]');
    await expect(profilesTable).toBeVisible();

    // 3. Abrir el modal de edición para un perfil existente
    const editBtn = profilesTable.locator('tbody tr button[title="Editar perfil y permisos"]').first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // 4. Validar apertura del diálogo de edición de perfil
    const dialog = page.locator('.profile-dialog');
    await expect(dialog).toBeVisible();

    // 5. Validar presencia de la matriz interactiva de permisos
    const matrixSection = page.locator('.profile-dialog__matrix-section');
    await expect(matrixSection).toBeVisible();

    // 6. Capturar screenshot del diálogo y la matriz de permisos
    const screenshotPath1 = path.join(artifactsImgDir, 'sesion-07.1-perfiles-matriz.png');
    const screenshotPath2 = path.join(repoDocImgDir, 'sesion-07.1-perfiles-matriz.png');
    await page.screenshot({ path: screenshotPath1, fullPage: true });
    fs.copyFileSync(screenshotPath1, screenshotPath2);

    // 7. Cerrar modal mediante botón de cancelar
    const cancelBtn = page.locator('.profile-dialog__actions button').filter({ hasText: 'Cancelar' });
    await cancelBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test('E2E-04: Navegación desde el Sidebar para Cuentas de Acceso (/usuarios) y Perfiles (/perfiles)', async ({ page }) => {
    // 1. Desplegar el grupo "Seguridad y Acceso" en el sidebar si no está abierto
    const securityGroupBtn = page.locator('button.app-sidebar__link--group').filter({ hasText: 'Seguridad y Acceso' });
    const isSubmenuVisible = await page.locator('.app-sidebar__submenu-link').filter({ hasText: 'Cuentas de Acceso' }).isVisible();
    if (!isSubmenuVisible) {
      await securityGroupBtn.click();
      await page.waitForTimeout(200);
    }

    // 2. Hacer clic en "Perfiles y Permisos RBAC" desde el sidebar
    const perfilesLink = page.locator('.app-sidebar__submenu-link').filter({ hasText: 'Perfiles y Permiso' });
    await expect(perfilesLink).toBeVisible();
    await perfilesLink.click();
    await page.waitForTimeout(300);

    // 3. Verificar que la URL sea /perfiles y la pestaña activa sea Perfiles RBAC
    await expect(page).toHaveURL(/\/perfiles/);
    const activeTab = page.locator('.mat-mdc-tab.mdc-tab--active');
    await expect(activeTab).toContainText('Perfiles y Permisos RBAC');
    await expect(page.locator('[data-testid="profiles-table"]')).toBeVisible();

    // 4. Hacer clic en "Cuentas de Acceso" desde el sidebar
    const usuariosLink = page.locator('.app-sidebar__submenu-link').filter({ hasText: 'Cuentas de Acceso' });
    await expect(usuariosLink).toBeVisible();
    await usuariosLink.click();
    await page.waitForTimeout(300);

    // 5. Verificar que la URL sea /usuarios y la pestaña activa sea Cuentas de Usuario
    await expect(page).toHaveURL(/\/usuarios/);
    const activeTab2 = page.locator('.mat-mdc-tab.mdc-tab--active');
    await expect(activeTab2).toContainText('Cuentas de Usuario');
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
  });

});

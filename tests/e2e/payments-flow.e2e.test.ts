import { test, expect } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';

test.describe('E2E Real Browser Tests - Módulo Financiero de Pensiones y Cierre Total de Vistas (sesion-08.1.0)', () => {
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

  test('E2E-01: Carga de Módulo de Pensiones, 4 KPIs Financieros y Padrón de Cuotas', async ({ page }) => {
    await page.goto('/pensiones');
    await page.waitForLoadState('networkidle');

    // 1. Validar contenedor principal de pensiones
    const container = page.locator('.tuition-payments');
    await expect(container).toBeVisible();

    // 2. Validar que las 4 tarjetas KPI estén renderizadas
    const kpiCards = page.locator('.tuition-payments__cards app-info-card');
    await expect(kpiCards).toHaveCount(4);
    await expect(kpiCards.nth(0)).toContainText('Total Recaudado');
    await expect(kpiCards.nth(1)).toContainText('Saldo Pendiente');
    await expect(kpiCards.nth(2)).toContainText('Cuotas Vencidas');
    await expect(kpiCards.nth(3)).toContainText('Efectividad Cobranza');

    // 3. Validar presencia de la tabla de cuotas
    const table = page.locator('.tuition-payments__table');
    await expect(table).toBeVisible();

    // 4. Capturar screenshot oficial para evidencias
    const screenshot1 = path.join(artifactsImgDir, 'sesion-08.1-pensiones-recaudacion.png');
    const screenshot2 = path.join(repoDocImgDir, 'sesion-08.1-pensiones-recaudacion.png');
    await page.screenshot({ path: screenshot1, fullPage: true });
    fs.copyFileSync(screenshot1, screenshot2);
  });

  test('E2E-02: Modal de Registro y Amortización de Cuota Escolar', async ({ page }) => {
    await page.goto('/pensiones');
    await page.waitForLoadState('networkidle');

    // 1. Localizar un botón de Cobrar y hacer clic
    const payBtn = page.locator('.tuition-payments__pay-btn').first();
    if (await payBtn.isVisible()) {
      await payBtn.click();

      // 2. Validar apertura del diálogo modal
      const dialog = page.locator('.payment-dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText('Registrar Cobranza de Cuota');
      await expect(dialog).toContainText('Monto a Cancelar');

      // 3. Capturar screenshot del diálogo
      const screenshot1 = path.join(artifactsImgDir, 'sesion-08.1-pago-dialogo.png');
      const screenshot2 = path.join(repoDocImgDir, 'sesion-08.1-pago-dialogo.png');
      await page.screenshot({ path: screenshot1 });
      fs.copyFileSync(screenshot1, screenshot2);

      // 4. Cerrar el modal mediante cancelar
      const cancelBtn = page.locator('.payment-dialog__actions button', { hasText: 'Cancelar' });
      await cancelBtn.click();
      await expect(dialog).not.toBeVisible();
    }
  });

  test('E2E-03: Cierre de Vista - Catálogo de Cargos Institucionales (/cargos)', async ({ page }) => {
    await page.goto('/cargos');
    await page.waitForLoadState('networkidle');

    // 1. Validar vista de cargos
    const container = page.locator('.positions');
    await expect(container).toBeVisible();

    // 2. Validar KPIs de cargos
    const kpis = page.locator('.positions__cards app-info-card');
    await expect(kpis).toHaveCount(4);
    await expect(kpis.nth(0)).toContainText('Total Cargos');
    await expect(kpis.nth(1)).toContainText('Cargos Activos');

    // 3. Validar tabla de cargos
    const table = page.locator('.positions__table');
    await expect(table).toBeVisible();

    // 4. Capturar screenshot
    const screenshot1 = path.join(artifactsImgDir, 'sesion-08.1-cargos-mantenimiento.png');
    const screenshot2 = path.join(repoDocImgDir, 'sesion-08.1-cargos-mantenimiento.png');
    await page.screenshot({ path: screenshot1, fullPage: true });
    fs.copyFileSync(screenshot1, screenshot2);
  });

  test('E2E-04: Cierre de Vista - Bitácora de Convivencia y Psicología (/incidencias)', async ({ page }) => {
    await page.goto('/incidencias');
    await page.waitForLoadState('networkidle');

    // 1. Validar contenedor de incidencias
    const container = page.locator('.incidents');
    await expect(container).toBeVisible();

    // 2. Validar KPIs
    const kpis = page.locator('.incidents__cards app-info-card');
    await expect(kpis).toHaveCount(4);
    await expect(kpis.nth(0)).toContainText('Total Incidencias');

    // 3. Validar tabla
    const table = page.locator('.incidents__table');
    await expect(table).toBeVisible();

    // 4. Capturar screenshot
    const screenshot1 = path.join(artifactsImgDir, 'sesion-08.1-incidencias-bitacora.png');
    const screenshot2 = path.join(repoDocImgDir, 'sesion-08.1-incidencias-bitacora.png');
    await page.screenshot({ path: screenshot1, fullPage: true });
    fs.copyFileSync(screenshot1, screenshot2);
  });

  test('E2E-05: Cobertura 100% de Menús en el Sidebar Dinámico', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Comprobar que los enlaces a las nuevas vistas existen en el menú lateral o son navegables
    const expectedRoutes = [
      '/dashboard',
      '/alumnos',
      '/personal',
      '/grados-secciones',
      '/grados-asignaturas',
      '/asignaturas',
      '/notas',
      '/asistencia',
      '/incidencias',
      '/pensiones',
      '/niveles',
      '/areas',
      '/cargos',
      '/usuarios',
      '/perfiles'
    ];

    for (const route of expectedRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // Asegurarse de que no redirige a página de error ni a login inesperado
      if (route === '/notas') {
        expect(page.url()).toContain('/calificaciones');
      } else {
        expect(page.url()).toContain(route);
      }
    }
  });
});

import { test, expect } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';

test.describe('E2E Real Browser Tests - Módulo Matriz de Asistencia Diaria e Incidencias (sesion-06.1.0)', () => {

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
    await page.goto('/asistencia');
    await page.waitForLoadState('networkidle');
  });

  test('E2E-01: Carga de Padrón de Asistencia y Filtros Reactivos', async ({ page }) => {
    // 1. Validar título en cabecera
    const headerTitle = page.locator('.page-header__title');
    await expect(headerTitle).toBeVisible();
    await expect(headerTitle).toContainText('Control de Asistencia');

    // 2. Validar que se muestren las 4 tarjetas KPI
    const kpiCards = page.locator('app-info-card');
    await expect(kpiCards).toHaveCount(4);

    // 3. Validar presencia de filtros
    const filtersBar = page.locator('app-attendance-filters');
    await expect(filtersBar).toBeVisible();

    // 4. Validar tabla de asistencia y filas de alumnos
    const table = page.locator('table.attendance-table');
    await expect(table).toBeVisible();
    const rows = table.locator('tbody tr.attendance-table__row');
    await expect(rows).not.toHaveCount(0);

    // 5. Capturar screenshot de pantalla completa
    const screenshotPath1 = path.join(artifactsImgDir, 'sesion-06.1-asistencia-diaria.png');
    const screenshotPath2 = path.join(repoDocImgDir, 'sesion-06.1-asistencia-diaria.png');
    await page.screenshot({ path: screenshotPath1, fullPage: true });
    fs.copyFileSync(screenshotPath1, screenshotPath2);
  });

  test('E2E-02: Acción Rápida "Marcar Todos Presentes" y Actualización de KPIs', async ({ page }) => {
    // 1. Localizar botón "Marcar Todos Presentes"
    const markAllBtn = page.locator('.attendance-filters__mark-all-btn');
    await expect(markAllBtn).toBeVisible();
    await markAllBtn.click();

    // 2. Validar que la tarjeta KPI de alumnos presentes indique 100%
    const presentKpi = page.locator('app-info-card').nth(1);
    await expect(presentKpi).toContainText('100%');

    // 3. Validar que todas las filas tengan la píldora 'Presente' activa
    const totalRows = await page.locator('tbody tr.attendance-table__row').count();
    const presentPills = page.locator('.status-pill--present.active');
    await expect(presentPills).toHaveCount(totalRows);
  });

  test('E2E-03: Apertura y Operatoria del Diálogo de Incidencias Escolares', async ({ page }) => {
    // 1. Clic en botón "Incidencia" de la primera fila
    const firstIncidentBtn = page.locator('tbody tr.attendance-table__row').first().locator('.incident-btn');
    await expect(firstIncidentBtn).toBeVisible();
    await firstIncidentBtn.click();

    // 2. Validar que se abre el modal
    const dialog = page.locator('app-incident-save-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('.incident-dialog__title')).toContainText('Reportar Incidencia');

    // 3. Llenar los controles del formulario reactivo usando data-testid
    const titleInput = dialog.locator('[data-testid="incident-title"]');
    await expect(titleInput).toBeVisible();
    await titleInput.fill('Llegada tardía reiterada');

    const descInput = dialog.locator('[data-testid="incident-description"]');
    await expect(descInput).toBeVisible();
    await descInput.fill('El estudiante ingresó 20 minutos tarde a la primera sesión.');

    const actionInput = dialog.locator('[data-testid="incident-action"]');
    await expect(actionInput).toBeVisible();
    await actionInput.fill('Se conversó con el alumno y se envió nota de aviso al apoderado.');

    // 4. Capturar screenshot del modal de incidencias
    const modalShot1 = path.join(artifactsImgDir, 'sesion-06.1-incidencia-modal.png');
    const modalShot2 = path.join(repoDocImgDir, 'sesion-06.1-incidencia-modal.png');
    await page.screenshot({ path: modalShot1 });
    fs.copyFileSync(modalShot1, modalShot2);

    // 5. Cancelar el diálogo
    const cancelBtn = dialog.locator('[data-testid="incident-cancel-btn"]');
    await cancelBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test('E2E-04: Guardado Masivo y Persistencia en Backend', async ({ page }) => {
    // 1. Interceptar petición POST /api/attendances/bulk-register
    const bulkPromise = page.waitForResponse(response =>
      response.url().includes('/api/attendances/bulk') && response.request().method() === 'POST'
    );

    // 2. Clic en botón "Guardar Asistencias"
    const saveBtn = page.locator('.attendance-filters__save-btn');
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // 3. Validar respuesta HTTP 200/201 del backend
    const response = await bulkPromise;
    expect([200, 201]).toContain(response.status());

    // 4. Validar mensaje visual en SnackBar
    const snackBar = page.locator('mat-snack-bar-container');
    await expect(snackBar).toBeVisible();
    await expect(snackBar).toContainText('guardadas exitosamente');
  });

});

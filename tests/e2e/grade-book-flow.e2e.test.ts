import { test, expect } from '@playwright/test';

test.describe('E2E Real Browser Tests - Módulo Matriz de Calificaciones MINEDU (sesion-06.0.0)', () => {

  test.beforeEach(async ({ page }) => {
    // Navegar a la ruta de Calificaciones
    await page.goto('/calificaciones');
    await page.waitForLoadState('networkidle');
  });

  test('E2E-01: Carga de Matriz y Filtros Reactivos', async ({ page }) => {
    // 1. Validar título en cabecera
    const headerTitle = page.locator('.page-header__title');
    await expect(headerTitle).toBeVisible();
    await expect(headerTitle).toContainText('Matriz Dinámica de Calificaciones');

    // 2. Validar que se muestren las 4 tarjetas KPI de rendimiento
    const kpiCards = page.locator('app-info-card');
    await expect(kpiCards).toHaveCount(4);

    // 3. Validar presencia de selectores en la barra de filtros
    const filtersBar = page.locator('app-grade-book-filters');
    await expect(filtersBar).toBeVisible();

    // 4. Validar que la tabla densa de calificaciones esté renderizada
    const matrixTable = page.locator('.dense-matrix');
    await expect(matrixTable).toBeVisible();

    // 5. Validar que los 4 bimestres normados por RUL-004 estén en thead
    const periodHeaders = matrixTable.locator('th.col-period');
    await expect(periodHeaders).toHaveCount(4);
    await expect(periodHeaders.nth(0)).toContainText('Bimestre 1');
    await expect(periodHeaders.nth(1)).toContainText('Bimestre 2');
    await expect(periodHeaders.nth(2)).toContainText('Bimestre 3');
    await expect(periodHeaders.nth(3)).toContainText('Bimestre 4');
  });

  test('E2E-02: Edición en Caliente y Semáforo Vigesimal', async ({ page }) => {
    // 1. Ubicar la primera fila de la tabla
    const firstRow = page.locator('.dense-matrix tbody tr.matrix-row').first();
    await expect(firstRow).toBeVisible();

    // 2. Localizar celda de Bimestre 1 (abierto)
    const b1Wrapper = firstRow.locator('.col-period').nth(0).locator('.score-input-wrapper');
    const b1Input = b1Wrapper.locator('input');
    await expect(b1Input).toBeEnabled();

    // 3. Digitar nota aprobatoria (16) y verificar clase score--passing
    await b1Input.fill('16');
    await b1Input.blur();
    await expect(b1Wrapper).toHaveClass(/score--passing/);

    // 4. Localizar celda de Bimestre 2 (abierto)
    const b2Wrapper = firstRow.locator('.col-period').nth(1).locator('.score-input-wrapper');
    const b2Input = b2Wrapper.locator('input');
    await expect(b2Input).toBeEnabled();

    // 5. Digitar nota desaprobatoria (08) y verificar clase score--failing
    await b2Input.fill('08');
    await b2Input.blur();
    await expect(b2Wrapper).toHaveClass(/score--failing/);

    // 6. Verificar que el chip de promedio final se haya recalculado dinámicamente
    const avgChip = firstRow.locator('.average-chip');
    await expect(avgChip).toBeVisible();
    const avgText = await avgChip.textContent();
    expect(avgText?.trim()).not.toBe('--');
  });

  test('E2E-03: Candado de Periodo Cerrado (RUL-004 isOpen: false)', async ({ page }) => {
    // 1. Ubicar cabeceras de bimestres cerrados (Bimestre 3 y 4)
    const b3Header = page.locator('th.col-period').nth(2);
    await expect(b3Header.locator('.lock-icon')).toBeVisible();

    // 2. Verificar que en las filas, los inputs de Bimestre 3 estén bloqueados
    const firstRow = page.locator('.dense-matrix tbody tr.matrix-row').first();
    const b3Wrapper = firstRow.locator('.col-period').nth(2).locator('.score-input-wrapper');
    const b3Input = b3Wrapper.locator('input');

    await expect(b3Input).toBeDisabled();
    await expect(b3Wrapper).toHaveClass(/score--disabled/);
  });

  test('E2E-04: Guardado Masivo y Persistencia Backend', async ({ page }) => {
    // 1. Clic en botón "Guardar Calificaciones"
    const saveBtn = page.locator('.save-btn');
    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toBeEnabled();

    // 2. Interceptar la llamada PUT /api/evaluations/bulk-update
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/evaluations/bulk-update') && resp.request().method() === 'PUT'),
      saveBtn.click()
    ]);

    expect(response.status()).toBe(200);

    // 3. Validar despliegue de notificación MatSnackBar
    const snackBar = page.locator('.mat-mdc-snack-bar-container');
    await expect(snackBar).toBeVisible();
    await expect(snackBar).toContainText('¡Calificaciones guardadas exitosamente!');
  });

});

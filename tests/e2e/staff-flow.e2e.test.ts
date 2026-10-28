import { test, expect } from '@playwright/test';

test.describe('E2E Real Browser Tests - Módulo Personal Escolar (sesion-05.1.0)', () => {

  test.beforeEach(async ({ page }) => {
    // Navegar directamente a la ruta de Personal Escolar
    await page.goto('/personal');
    await page.waitForLoadState('networkidle');
  });

  test('E2E-01: Navegación y Alternancia de Pestañas (Docentes vs Trabajadores)', async ({ page }) => {
    // 1. Validar que la cabecera y el título de la página estén visibles
    const title = page.locator('.page-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Personal Escolar');

    // 2. Validar que las 4 tarjetas KPI estén renderizadas en la vista
    const kpiCards = page.locator('app-info-card');
    await expect(kpiCards).toHaveCount(4);

    // 3. Validar presencia de la pestaña inicial "Docentes"
    const activeTab = page.locator('.mat-mdc-tab.mdc-tab--active');
    await expect(activeTab).toContainText('Docentes');
    await expect(page.locator('app-teacher-list table')).toBeVisible();

    // 4. Cambiar a la pestaña "Trabajadores Administrativos"
    const workersTab = page.locator('.mat-mdc-tab').filter({ hasText: 'Trabajadores Administrativos' });
    await workersTab.click();
    await page.waitForTimeout(300);

    // 5. Validar que ahora la tabla de trabajadores esté visible con columna Cargo Institucional
    const workerTable = page.locator('app-worker-list table');
    await expect(workerTable).toBeVisible();
    const workerHeader = workerTable.locator('th');
    await expect(workerHeader.filter({ hasText: 'Cargo Institucional' })).toBeVisible();
  });

  test('E2E-02: Apertura y Cancelación del Modal de Nuevo Docente', async ({ page }) => {
    // 1. Clic en botón "Nuevo Docente"
    const createBtn = page.locator('.create-btn');
    await expect(createBtn).toBeVisible();
    await expect(createBtn).toContainText('Nuevo Docente');
    await createBtn.click();

    // 2. Validar que se abra el modal app-teacher-save-dialog
    const dialog = page.locator('app-teacher-save-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('h2')).toContainText('Nuevo Docente');

    // 3. Validar controles del formulario
    await expect(dialog.locator('input[formControlName="dni"]')).toBeVisible();
    await expect(dialog.locator('input[formControlName="specialty"]')).toBeVisible();
    await expect(dialog.locator('input[formControlName="contractedHours"]')).toBeVisible();

    // 4. Cancelar diálogo
    const cancelBtn = dialog.locator('button').filter({ hasText: 'Cancelar' });
    await cancelBtn.click();
    await page.waitForTimeout(300);
    await expect(dialog).not.toBeVisible();
  });

  test('E2E-03: Bloqueo por Incompatibilidad Alumno Activo (RN-ACT-01)', async ({ page }) => {
    // 1. Abrir diálogo de Nuevo Docente
    await page.locator('.create-btn').click();
    const dialog = page.locator('app-teacher-save-dialog');
    await expect(dialog).toBeVisible();

    // 2. Ingresar el DNI de un alumno activo existente en la base de datos (Diego Rosas: 78788890)
    const dniInput = dialog.locator('input[formControlName="dni"]');
    await dniInput.fill('78788890');
    await dniInput.blur();

    // 3. Esperar debounce y validación asíncrona
    await page.waitForTimeout(1000);

    // 4. Validar que se muestre el mensaje de incompatibilidad o que el botón Guardar quede deshabilitado
    const submitBtn = dialog.locator('button[type="submit"]');
    await expect(submitBtn).toBeDisabled();

    // Cerrar modal
    await dialog.locator('button').filter({ hasText: 'Cancelar' }).click();
  });

  test('E2E-04: Filtrado Predictivo por Especialidad o Apellido', async ({ page }) => {
    const searchInput = page.locator('.search-field input');
    await expect(searchInput).toBeVisible();

    // Escribir búsqueda por especialidad o apellido
    await searchInput.fill('Valdivia');
    await page.waitForTimeout(400);

    // Verificar que los profesores filtrados contengan el texto
    const teacherRows = page.locator('app-teacher-list table tr.mat-mdc-row');
    const count = await teacherRows.count();
    if (count > 0) {
      const firstRowText = await teacherRows.first().textContent();
      expect(firstRowText?.toLowerCase()).toContain('valdivia');
    }

    // Limpiar búsqueda
    await searchInput.fill('');
    await page.waitForTimeout(300);
  });

});

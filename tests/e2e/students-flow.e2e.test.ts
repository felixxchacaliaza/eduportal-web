import { test, expect } from '@playwright/test';

test.describe('E2E Real Browser Tests - Módulo Padrón de Estudiantes y Matrícula (sesion-05.0.0)', () => {

  test.beforeEach(async ({ page }) => {
    // Navegar directamente a la vista de Alumnos
    await page.goto('/alumnos');
    await page.waitForLoadState('networkidle');
  });

  test('Flujo E2E 1: Carga de Padrón, KPIs y Paginación Reactiva en Español', async ({ page }) => {
    // 1. Validar que la tabla esté visible
    const table = page.locator('.student-list__table');
    await expect(table).toBeVisible();

    // 2. Validar que el paginador esté renderizado con texto oficial en español
    const paginator = page.locator('.student-list__paginator');
    await expect(paginator).toBeVisible();
    await expect(paginator).toContainText('Estudiantes por página');

    // 3. Validar presencia de las columnas oficiales
    const headerRow = page.locator('.student-list__header-cell');
    await expect(headerRow.filter({ hasText: 'DNI' })).toBeVisible();
    await expect(headerRow.filter({ hasText: 'Estudiante' })).toBeVisible();
    await expect(headerRow.filter({ hasText: 'Matrícula 2026' })).toBeVisible();
    await expect(headerRow.filter({ hasText: 'Estado' })).toBeVisible();
    await expect(headerRow.filter({ hasText: 'Acciones' })).toBeVisible();
  });

  test('Flujo E2E 2: Filtrado Predictivo por DNI y Nombre', async ({ page }) => {
    const searchInput = page.locator('.students-filters__field--search input');
    await expect(searchInput).toBeVisible();

    // Escribir búsqueda
    await searchInput.fill('Rosas');
    await page.waitForTimeout(400); // debounce

    // Todas las filas visibles deben coincidir con 'Rosas'
    const studentNames = page.locator('.student-list__student-name');
    const count = await studentNames.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await studentNames.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('rosas');
    }

    // Limpiar búsqueda
    const clearBtn = page.locator('.students-filters__field--search button');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.waitForTimeout(300);
    }
  });

  test('Flujo E2E 3: Regla de Negocio de Alternancia Matricular vs Cambiar Sección', async ({ page }) => {
    const rows = page.locator('.student-list__row');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Iterar sobre las filas visibles y verificar la regla estricta:
    // Si tiene badge 'Matriculado' -> botón 'published_with_changes' (Cambiar Sección) presente, y 'how_to_reg' NO presente
    // Si tiene badge 'Sin Matrícula' -> botón 'how_to_reg' (Matricular) presente
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const isEnrolled = await row.locator('.student-list__enrollment-tag--active').count() > 0;
      const enrollBtn = row.locator('button:has(mat-icon:text("how_to_reg"))');
      const changeSectionBtn = row.locator('button:has(mat-icon:text("published_with_changes"))');

      if (isEnrolled) {
        // Alumno matriculado: DEBE tener cambio de sección y NO matricular
        await expect(changeSectionBtn).toBeVisible();
        await expect(enrollBtn).toHaveCount(0);
      } else {
        // Alumno no matriculado: DEBE tener matricular
        await expect(enrollBtn).toBeVisible();
        await expect(changeSectionBtn).toHaveCount(0);
      }
    }
  });

  test('Flujo E2E 4: Apertura y Validación del Diálogo de Traslado de Sección', async ({ page }) => {
    // Buscar un estudiante matriculado
    const changeSectionBtn = page.locator('.student-list__row button:has(mat-icon:text("published_with_changes"))').first();
    
    if (await changeSectionBtn.isVisible()) {
      await changeSectionBtn.click();

      // Validar que se abrió el modal de traslado
      const dialog = page.locator('app-section-change-dialog');
      await expect(dialog).toBeVisible();

      // Validar título y elementos
      await expect(dialog.locator('.section-change-dialog__title')).toContainText('Cambio / Traslado de Sección');
      await expect(dialog.locator('.section-change-form__current-card')).toBeVisible();

      // Cerrar el modal
      const cancelBtn = dialog.locator('.section-change-form__cancel-btn');
      await cancelBtn.click();
      await expect(dialog).toHaveCount(0);
    }
  });

});

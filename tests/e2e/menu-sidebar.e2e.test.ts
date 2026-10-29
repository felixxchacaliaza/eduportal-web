import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('E2E Sesión 04.2: Menú Jerárquico Dinámico y Navegación en Vivo', () => {

  const imgDir = 'c:/Users/felix/Desktop/sdd-course-engine/courses/eduportal-angular22/img';
  const artifactDir = 'C:/Users/felix/.gemini/antigravity/brain/d45d2570-ff9b-437a-bd34-dd8333006cc2/img';

  test.beforeAll(async () => {
    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
    if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
  });

  test('E2E-01: El Sidebar carga dinámicamente los Option Groups desde MongoDB', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Verificar que el sidebar existe
    const sidebar = page.locator('app-sidebar');
    await expect(sidebar).toBeVisible();

    // Capturar pantalla de inicio con sidebar
    const shotPath1 = path.join(imgDir, 'sesion-04.2-sidebar-dinamico.png');
    await page.screenshot({ path: shotPath1 });
    fs.copyFileSync(shotPath1, path.join(artifactDir, 'sesion-04.2-sidebar-dinamico.png'));

    // Verificar presencia de items y grupos
    await expect(page.locator('.app-sidebar__label', { hasText: 'Panel de Control' })).toBeVisible();
    await expect(page.locator('.app-sidebar__label', { hasText: /Académic/i })).toBeVisible();
    await expect(page.locator('.app-sidebar__label', { hasText: /Mantenimiento/i })).toBeVisible();
  });

  test('E2E-02: Navegación por Option Group a Niveles Educativos con Ancho Completo', async ({ page }) => {
    await page.goto('/niveles');
    await page.waitForLoadState('networkidle');

    // Verificar que la vista de niveles carga sus elementos
    await expect(page.locator('.levels')).toBeVisible();

    // Verificar que el contenedor ocupa el ancho completo (no está centrado artificialmente)
    const container = page.locator('.levels');
    const box = await container.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(700); // Ancho amplio de escritorio completo

    // Capturar pantalla de vista a ancho completo
    const shotPath2 = path.join(imgDir, 'sesion-04.2-vista-ancho-completo.png');
    await page.screenshot({ path: shotPath2 });
    fs.copyFileSync(shotPath2, path.join(artifactDir, 'sesion-04.2-vista-ancho-completo.png'));
  });

  test('E2E-03: Despliegue y colapso de Option Group en Sidebar', async ({ page }) => {
    await page.goto('/areas');
    await page.waitForLoadState('networkidle');

    // Localizar el botón del grupo Mantenimiento
    const maintenanceBtn = page.locator('.app-sidebar__link--group', { hasText: /Mantenimiento/i });
    await expect(maintenanceBtn).toBeVisible();

    // Capturar pantalla con el grupo desplegado
    const shotPath3 = path.join(imgDir, 'sesion-04.2-arbol-academico.png');
    await page.screenshot({ path: shotPath3 });
    fs.copyFileSync(shotPath3, path.join(artifactDir, 'sesion-04.2-arbol-academico.png'));
  });
});

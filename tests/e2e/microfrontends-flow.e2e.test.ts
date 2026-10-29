import { test, expect } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';

test.describe('E2E Real Browser Tests - Arquitectura Microfrontends con Native Federation (sesion-09.0.0)', () => {
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

  test('MFE-01: Verificación de Manifiesto de Federación en Shell Host', async ({ page }) => {
    // 1. Consultar directamente el manifiesto de federación servido por el host
    const response = await page.goto('/federation.manifest.json');
    expect(response?.status()).toBe(200);

    const manifestText = await response?.text();
    expect(manifestText).toBeDefined();

    const manifest = JSON.parse(manifestText!);
    expect(manifest.mfeStudents).toBe('http://localhost:4201/remoteEntry.json');
    expect(manifest.mfeStaff).toBe('http://localhost:4202/remoteEntry.json');
    expect(manifest.mfeAcademic).toBe('http://localhost:4203/remoteEntry.json');
    expect(manifest.mfeEvaluations).toBe('http://localhost:4204/remoteEntry.json');
    expect(manifest.mfeAttendances).toBe('http://localhost:4205/remoteEntry.json');
    expect(manifest.mfeIncidents).toBe('http://localhost:4206/remoteEntry.json');
    expect(manifest.mfeFinance).toBe('http://localhost:4207/remoteEntry.json');
    expect(manifest.mfeMaintenance).toBe('http://localhost:4208/remoteEntry.json');
  });

  test('MFE-02: Navegación del Shell Host Orquestador y App Shell Dinámico', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 1. Validar App Shell principal
    const sidebar = page.locator('app-sidebar');
    await expect(sidebar).toBeVisible();

    // 2. Capturar screenshot del Shell Host
    const shot1 = path.join(artifactsImgDir, 'sesion-09.0-mfe-shell-orquestacion.png');
    const shot2 = path.join(repoDocImgDir, 'sesion-09.0-mfe-shell-orquestacion.png');
    await page.screenshot({ path: shot1, fullPage: true });
    fs.copyFileSync(shot1, shot2);
  });

  test('MFE-03: Orquestación y Resiliencia en Rutas Federadas (/alumnos y /pensiones)', async ({ page }) => {
    // 1. Navegar a alumnos
    await page.goto('/alumnos');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.students')).toBeVisible();

    // Capturar screenshot del módulo de alumnos federado
    const shotAlu1 = path.join(artifactsImgDir, 'sesion-09.0-mfe-alumnos-federado.png');
    const shotAlu2 = path.join(repoDocImgDir, 'sesion-09.0-mfe-alumnos-federado.png');
    await page.screenshot({ path: shotAlu1, fullPage: true });
    fs.copyFileSync(shotAlu1, shotAlu2);

    // 2. Navegar a pensiones
    await page.goto('/pensiones');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.tuition-payments')).toBeVisible();

    // 3. Navegar a calificaciones
    await page.goto('/calificaciones');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.grade-book-container')).toBeVisible();
  });
});

import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  inject,
  input,
  effect
} from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { HasPermissionConfig } from './has-permission-config.interface';

/**
 * ============================================================================
 * HasPermissionDirective (*appHasPermission)
 * ============================================================================
 * Directiva estructural que condiciona la existencia de elementos en el DOM
 * según la matriz de permisos RBAC del usuario autenticado en sesión.
 *
 * Ejemplos de uso:
 * - *appHasPermission="'security'"
 * - *appHasPermission="{ module: 'students', level: 'FULL' }"
 * - *appHasPermission="'security'; else accessDeniedTemplate"
 * ============================================================================
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);

  /** Configuración o identificador de módulo a evaluar */
  public readonly appHasPermission = input.required<string | HasPermissionConfig>();

  /** Plantilla alternativa opcional a renderizar en caso de acceso denegado */
  public readonly appHasPermissionElse = input<TemplateRef<unknown> | null>(null);

  private hasView = false;

  constructor() {
    effect(() => {
      const permissionInput = this.appHasPermission();
      const elseTemplate = this.appHasPermissionElse();

      const hasAccess = this.evaluateAccess(permissionInput);

      if (hasAccess) {
        if (!this.hasView) {
          this.viewContainer.clear();
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.hasView = true;
        }
      } else {
        this.viewContainer.clear();
        this.hasView = false;
        if (elseTemplate) {
          this.viewContainer.createEmbeddedView(elseTemplate);
        }
      }
    });
  }

  private evaluateAccess(config: string | HasPermissionConfig): boolean {
    if (!config) {
      return false;
    }

    if (typeof config === 'string') {
      return this.authService.hasPermission(config, 'READ_ONLY');
    }

    const targetModule = config.module;
    const targetLevel = config.level ?? 'READ_ONLY';
    return this.authService.hasPermission(targetModule, targetLevel);
  }
}

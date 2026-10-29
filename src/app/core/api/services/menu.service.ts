// src/app/core/api/services/menu.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../models/interfaces/api-response.interface';
import { Menu } from '../models/interfaces/menu.interface';
import { MenuNode } from '../models/interfaces/menu-node.interface';
import { NavigationItem } from '../../../shared/layout/sidebar/models/navigation-item.interface';

/**
 * ============================================================================
 * MenuService
 * ============================================================================
 * Servicio reactivo para la consulta y jerarquización de los menús del sistema.
 * Consume `GET /api/menus` y produce estructuras de árbol para navegación.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = API_ENDPOINTS.menus;

  /** Estado reactivo de los menús jerárquicos cargados */
  public readonly menuTree = signal<readonly MenuNode[]>([]);
  public readonly navigationItems = signal<readonly NavigationItem[]>([]);
  public readonly isLoading = signal<boolean>(false);

  /**
   * Obtiene la lista plana de menús desde el backend.
   */
  public async getRawMenus(): Promise<Menu[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<Menu[]>>(this.endpoint)
    );
    return response.data;
  }

  /**
   * Obtiene y ensambla el árbol jerárquico de menús activos ordenados.
   */
  public async getMenuTree(): Promise<MenuNode[]> {
    this.isLoading.set(true);
    try {
      const rawMenus = await this.getRawMenus();
      const tree = this.buildMenuTree(rawMenus);
      this.menuTree.set(tree);
      this.navigationItems.set(this.transformToNavigationItems(tree));
      return tree;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Transforma una lista plana de registros de menú en un árbol jerárquico.
   */
  public buildMenuTree(menus: readonly Menu[]): MenuNode[] {
    const enabledMenus = menus.filter(m => m.enabled);
    const parentMenus = enabledMenus
      .filter(m => !m.parent)
      .sort((a, b) => a.order - b.order);

    return parentMenus.map(parent => {
      const children = enabledMenus
        .filter(child => child.parent === parent.id)
        .sort((a, b) => a.order - b.order);

      return {
        ...parent,
        children: children.length > 0 ? children : undefined
      };
    });
  }

  /**
   * Convierte nodos de menú en contratos de presentación del Sidebar.
   */
  public transformToNavigationItems(tree: readonly MenuNode[]): NavigationItem[] {
    return tree.map(node => ({
      label: node.label,
      icon: node.icon,
      path: node.path || undefined,
      children: node.children?.map(c => ({
        label: c.label,
        icon: c.icon,
        path: c.path || ''
      }))
    }));
  }
}

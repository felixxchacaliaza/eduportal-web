// src/app/core/resolvers/menu.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MenuService } from '../api/services/menu.service';
import { MenuNode } from '../api/models/interfaces/menu-node.interface';

/**
 * ============================================================================
 * menuResolver
 * ============================================================================
 * Precarga el árbol jerárquico de navegación escolar antes de instanciar el layout.
 * ============================================================================
 */
export const menuResolver: ResolveFn<MenuNode[]> = () => {
  const menuService = inject(MenuService);
  return menuService.getMenuTree();
};

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../api/endpoints';
import {
  AuthUser,
  LoginRequestDto,
  LoginResponse,
  LoginResponseData,
  AuthMenuItem
} from '../../../features/auth/models';
import { NavigationItem } from '../../../shared/layout/sidebar/models/navigation-item.interface';

const TOKEN_KEY = 'eduportal_token';
const USER_KEY = 'eduportal_user';
const MENU_KEY = 'eduportal_menu';

/**
 * ============================================================================
 * AuthService
 * ============================================================================
 * Servicio centralizado reactivo para la gestión de identidad, tokens JWT,
 * permisos RBAC y estado de sesión mediante Angular Signals puras.
 * ============================================================================
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  /** Token JWT reactivo sincronizado con almacenamiento local */
  public readonly token = signal<string | null>(this.readInitialToken());

  /** Usuario autenticado actual en sesión */
  public readonly currentUser = signal<AuthUser | null>(this.readInitialUser());

  /** Árbol de opciones de menú autorizadas para el perfil activo */
  public readonly menuTree = signal<readonly AuthMenuItem[]>(this.readInitialMenu());

  /** Indicador reactivo de operaciones asíncronas de autenticación en progreso */
  public readonly isLoading = signal<boolean>(false);

  /** Determina si existe una sesión activa y válida */
  public readonly isAuthenticated = computed<boolean>(() => {
    return !!this.token() && !!this.currentUser();
  });

  /** Determina si el usuario en sesión posee privilegios de Super Administrador */
  public readonly isSuperAdmin = computed<boolean>(() => {
    return this.currentUser()?.profile?.isSuperAdmin === true;
  });

  /** Nombre del perfil o rol del usuario actual */
  public readonly userRoleName = computed<string>(() => {
    return this.currentUser()?.profile?.name ?? '';
  });

  /** Nombre completo de la persona asociada a la cuenta */
  public readonly userFullName = computed<string>(() => {
    const personName = this.currentUser()?.person?.fullName;
    return personName && personName.trim().length > 0 ? personName : (this.currentUser()?.email ?? '');
  });

  /** Transforma el árbol de menús RBAC a la estructura requerida por el Sidebar */
  public readonly navigationItems = computed<readonly NavigationItem[]>(() => {
    return this.transformMenuToNavigation(this.menuTree());
  });

  /**
   * Ejecuta la autenticación de credenciales ante el backend.
   */
  public async login(credentials: LoginRequestDto): Promise<LoginResponseData> {
    this.isLoading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(API_ENDPOINTS.authLogin, credentials)
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error en la respuesta de autenticación');
      }

      const { token, user } = response.data;
      this.saveSession(token, user, user.menuTree || []);

      return response.data;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Restaura y valida la sesión activa ante el backend mediante GET /api/auth/me.
   */
  public async restoreSession(): Promise<boolean> {
    const currentToken = this.token();
    if (!currentToken) {
      return false;
    }

    try {
      const response = await firstValueFrom(
        this.http.get<{ success: boolean; data: AuthUser }>(API_ENDPOINTS.authMe)
      );

      if (response.success && response.data) {
        const user = response.data;
        this.currentUser.set(user);
        this.menuTree.set(user.menuTree || []);
        this.persistInStorage(USER_KEY, user);
        this.persistInStorage(MENU_KEY, user.menuTree || []);
        return true;
      }
      return false;
    } catch {
      this.clearSession();
      return false;
    }
  }

  /**
   * Finaliza la sesión del usuario, elimina credenciales y redirige a /login.
   */
  public logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Guarda de forma atómica el estado de sesión en memoria y en localStorage.
   */
  public saveSession(token: string, user: AuthUser, menuTree: readonly AuthMenuItem[]): void {
    this.token.set(token);
    this.currentUser.set(user);
    this.menuTree.set(menuTree);

    this.persistInStorage(TOKEN_KEY, token);
    this.persistInStorage(USER_KEY, user);
    this.persistInStorage(MENU_KEY, menuTree);
  }

  /**
   * Limpia el estado de sesión sin redirigir inmediatamente.
   */
  public clearSession(): void {
    this.token.set(null);
    this.currentUser.set(null);
    this.menuTree.set([]);

    this.removeFromStorage(TOKEN_KEY);
    this.removeFromStorage(USER_KEY);
    this.removeFromStorage(MENU_KEY);
  }

  /**
   * Transforma la lista RBAC en elementos compatibles con el componente Sidebar.
   */
  private transformMenuToNavigation(menus: readonly AuthMenuItem[]): readonly NavigationItem[] {
    if (!menus || menus.length === 0) {
      return [];
    }

    return menus.map(item => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      if (hasChildren) {
        return {
          label: item.label,
          icon: item.icon,
          children: item.children!.map(child => ({
            label: child.label,
            icon: child.icon,
            path: child.path || ''
          }))
        };
      }

      return {
        label: item.label,
        icon: item.icon,
        path: item.path || ''
      };
    });
  }

  private readInitialToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private readInitialUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private readInitialMenu(): readonly AuthMenuItem[] {
    try {
      const raw = localStorage.getItem(MENU_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private persistInStorage(key: string, value: unknown): void {
    try {
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Entornos donde localStorage esté bloqueado o no disponible
    }
  }

  private removeFromStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignorar excepciones de storage
    }
  }
}

import { Injectable, inject, signal, computed } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ProfileService } from '../../services/profile.service';
import { User, Profile } from '../../models';
import { InfoCardData } from '../../../../shared/components/info-card/models/interfaces/infor-card-data.interface';

/**
 * ============================================================================
 * SecurityManagementPresenter
 * ============================================================================
 * Cerebro Headless para la gestión del módulo de Seguridad y Control de Acceso.
 * Gestiona Signals para búsqueda, filtros predictivos y cálculo en caliente de KPIs.
 * ============================================================================
 */
@Injectable()
export class SecurityManagementPresenter {
  private readonly userService = inject(UserService);
  private readonly profileService = inject(ProfileService);

  /** Término de búsqueda predictiva */
  public readonly searchTerm = signal<string>('');

  /** Pestaña activa (0 = Usuarios, 1 = Perfiles) */
  public readonly activeTabIndex = signal<number>(0);

  /** Métricas KPI en caliente */
  public readonly totalUsersCount = computed<number>(() => {
    return this.userService.users().length;
  });

  public readonly activeUsersCount = computed<number>(() => {
    return this.userService.users().filter(u => u.enabled).length;
  });

  public readonly protectedUsersCount = computed<number>(() => {
    return this.userService.users().filter(u => u.isProtected).length;
  });

  public readonly totalProfilesCount = computed<number>(() => {
    return this.profileService.profiles().length;
  });

  /** Tarjetas KPI formateadas para <app-info-card> */
  public readonly kpiCards = computed<readonly InfoCardData[]>(() => [
    {
      label: 'Total Cuentas',
      value: this.totalUsersCount(),
      subtitle: 'Cuentas registradas',
      color: 'blue'
    },
    {
      label: 'Usuarios Activos',
      value: this.activeUsersCount(),
      subtitle: 'Con acceso permitido',
      color: 'green'
    },
    {
      label: 'Cuentas Protegidas',
      value: this.protectedUsersCount(),
      subtitle: 'SuperAdmin (RN-SEG-02)',
      color: 'amber'
    },
    {
      label: 'Perfiles RBAC',
      value: this.totalProfilesCount(),
      subtitle: 'Roles configurados',
      color: 'blue'
    }
  ]);

  /** Lista reactiva de usuarios filtrados */
  public readonly filteredUsers = computed<readonly User[]>(() => {
    const list = this.userService.users();
    const query = this.searchTerm().toLowerCase().trim();

    if (!query) {
      return list;
    }

    return list.filter(u => {
      const email = u.email.toLowerCase();
      const code = u.code.toLowerCase();
      const personName = (u.person?.fullName || `${u.person?.firstName || ''} ${u.person?.lastName || ''}`).toLowerCase();
      const dni = (u.person?.dni || '').toLowerCase();
      const profileName = (u.profile?.name || '').toLowerCase();

      return (
        email.includes(query) ||
        code.includes(query) ||
        personName.includes(query) ||
        dni.includes(query) ||
        profileName.includes(query)
      );
    });
  });

  /** Lista reactiva de perfiles filtrados */
  public readonly filteredProfiles = computed<readonly Profile[]>(() => {
    const list = this.profileService.profiles();
    const query = this.searchTerm().toLowerCase().trim();

    if (!query) {
      return list;
    }

    return list.filter(p => {
      const name = p.name.toLowerCase();
      const code = p.code.toLowerCase();
      const desc = (p.description || '').toLowerCase();

      return name.includes(query) || code.includes(query) || desc.includes(query);
    });
  });

  public setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  public setActiveTab(index: number): void {
    this.activeTabIndex.set(index);
    this.searchTerm.set('');
  }
}

import { Injectable, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileFormControls, PROFILE_FORM_DEFAULTS } from './models';
import { Profile, SaveProfileDto, AccessLevel } from '../../models';

/**
 * ============================================================================
 * ProfileSaveDialogPresenter
 * ============================================================================
 * Cerebro desacoplado para la edición de perfiles y matriz RBAC sobre menús.
 * ============================================================================
 */
@Injectable()
export class ProfileSaveDialogPresenter {
  private readonly fb = inject(FormBuilder);

  public readonly form: FormGroup<ProfileFormControls> = this.buildForm();
  public readonly isEditing = signal<boolean>(false);
  public readonly isSuperAdmin = signal<boolean>(false);
  public readonly permissionsMap = signal<Map<string, AccessLevel>>(new Map());

  public initialize(profile?: Profile): void {
    const map = new Map<string, AccessLevel>();

    if (profile) {
      this.isEditing.set(true);
      this.isSuperAdmin.set(profile.isSuperAdmin === true);

      this.form.patchValue({
        name: profile.name,
        description: profile.description || '',
        isSuperAdmin: profile.isSuperAdmin,
        enabled: profile.enabled
      });

      if (Array.isArray(profile.permissions)) {
        for (const p of profile.permissions) {
          const menuId = typeof p.menu === 'object' ? (p.menu?.id || (p.menu as any)?._id) : p.menu;
          if (menuId) {
            map.set(menuId, p.accessLevel);
          }
        }
      }

      if (profile.isSuperAdmin) {
        this.form.controls.isSuperAdmin.disable();
        this.form.controls.enabled.disable();
      }
    } else {
      this.isEditing.set(false);
      this.isSuperAdmin.set(false);
      this.form.reset(PROFILE_FORM_DEFAULTS);
      this.form.controls.isSuperAdmin.enable();
      this.form.controls.enabled.enable();
    }

    this.permissionsMap.set(map);
  }

  public setPermission(menuId: string, level: AccessLevel): void {
    const current = new Map(this.permissionsMap());
    if (level === 'NONE') {
      current.delete(menuId);
    } else {
      current.set(menuId, level);
    }
    this.permissionsMap.set(current);
  }

  public getPermission(menuId: string): AccessLevel {
    if (this.isSuperAdmin()) {
      return 'FULL';
    }
    return this.permissionsMap().get(menuId) || 'NONE';
  }

  public validateAndGetPayload(): SaveProfileDto | null {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }

    const raw = this.form.getRawValue();
    const permissions: { menu: string; accessLevel: 'FULL' | 'READ_ONLY' }[] = [];

    this.permissionsMap().forEach((level, menuId) => {
      if (level === 'FULL' || level === 'READ_ONLY') {
        permissions.push({ menu: menuId, accessLevel: level });
      }
    });

    return {
      name: raw.name.trim(),
      description: raw.description.trim(),
      isSuperAdmin: raw.isSuperAdmin,
      enabled: raw.enabled,
      permissions
    };
  }

  private buildForm(): FormGroup<ProfileFormControls> {
    return this.fb.group({
      name: this.fb.control<string>(PROFILE_FORM_DEFAULTS.name, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: this.fb.control<string>(PROFILE_FORM_DEFAULTS.description, {
        nonNullable: true
      }),
      isSuperAdmin: this.fb.control<boolean>(PROFILE_FORM_DEFAULTS.isSuperAdmin, {
        nonNullable: true
      }),
      enabled: this.fb.control<boolean>(PROFILE_FORM_DEFAULTS.enabled, {
        nonNullable: true
      })
    });
  }
}

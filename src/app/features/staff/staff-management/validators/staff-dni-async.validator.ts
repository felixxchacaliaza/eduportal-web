import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { PersonService } from '../../../students/student-management/services/person.service';

/**
 * ============================================================================
 * staffDniAsyncValidator
 * ============================================================================
 * Validador asíncrono para verificar la regla de incompatibilidad RN-ACT-01:
 * Una persona registrada como alumno activo no puede registrarse como personal laboral.
 * ============================================================================
 */
export function staffDniAsyncValidator(personService: PersonService, currentDni?: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const dni = control.value ? String(control.value).trim() : '';

    // Si está vacío o no tiene 8 dígitos numéricos, no dispara la consulta
    if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
      return of(null);
    }

    // Si estamos editando y el DNI no cambió, es válido
    if (currentDni && dni === currentDni.trim()) {
      return of(null);
    }

    // Debounce de 300ms antes de consultar al backend
    return timer(300).pipe(
      switchMap(() => personService.checkDni(dni)),
      map(res => {
        if (res && res.isStudent) {
          return { personIsStudent: true };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  };
}

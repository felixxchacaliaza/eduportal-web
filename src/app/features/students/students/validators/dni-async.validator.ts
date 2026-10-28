import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { PersonService } from '../services/person.service';

/**
 * ============================================================================
 * dniAsyncValidator
 * ============================================================================
 * Validador asíncrono para verificar en el Padrón Civil si el DNI ingresado
 * pertenece a un estudiante activo (impidiendo duplicidades de matrícula).
 * ============================================================================
 */
export function dniAsyncValidator(personService: PersonService, currentStudentDni?: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const dni = control.value ? String(control.value).trim() : '';

    // Si está vacío o no cumple los 8 dígitos, no dispara la consulta al servidor
    if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
      return of(null);
    }

    // Si estamos editando y el DNI no ha cambiado, es válido
    if (currentStudentDni && dni === currentStudentDni.trim()) {
      return of(null);
    }

    // Debounce de 300ms antes de consultar a la API REST
    return timer(300).pipe(
      switchMap(() => personService.checkDni(dni)),
      map(res => {
        if (res.isStudent) {
          return { studentAlreadyExists: true };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  };
}

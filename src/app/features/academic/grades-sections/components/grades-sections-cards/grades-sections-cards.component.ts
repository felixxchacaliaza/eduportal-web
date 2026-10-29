import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InfoCardComponent, InfoCardData } from '../../../../../shared/components/info-card/info-card.component';

/**
 * ============================================================================
 * GradesSectionsCardsComponent (Dumb Component / Presentacional)
 * ============================================================================
 * Renderiza la grilla responsiva de tarjetas métricas (KPIs) del catálogo
 * de Grados y Secciones escolares.
 *
 * @remarks
 * CONCEPTOS PEDAGÓGICOS CLAVE:
 * 1. Patrón Dumb / Presentacional:
 *    - No inyecta servicios HTTP ni conoce la procedencia de los datos.
 *    - Se limita a recibir la información a través de su Signal Input `cards()`.
 * 2. ChangeDetectionStrategy.OnPush:
 *    - Optimización de rendimiento a nivel empresarial.
 *    - Angular desactiva el chequeo sucio en cada micro-evento global; solo
 *      re-evalúa este componente si la referencia de la Signal `cards()` cambia.
 * 3. Signal Input (`input.required`):
 *    - API nativa de Angular 17.1+ que garantiza tipado estricto e inmutabilidad
 *      sin necesidad de decoradores `@Input()` tradicionales.
 * ============================================================================
 */
@Component({
  selector: 'app-grades-sections-cards',
  imports: [InfoCardComponent],
  templateUrl: './grades-sections-cards.component.html',
  styleUrl: './grades-sections-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradesSectionsCardsComponent {
  /**
   * Colección inmutable de tarjetas estadísticas calculadas por el Presenter
   * (Total registradas, activas, inactivas y aforo total de estudiantes).
   */
  public readonly cards = input.required<readonly InfoCardData[]>();
}
/**
 * ============================================================================
 * FormHtml Interface
 * ============================================================================
 * Contrato de definición para la metadata visual y configuración HTML
 * de los controles de formularios reactivos.
 *
 * @remarks
 * Permite desacoplar las etiquetas, placeholders, restricciones visuales
 * e iconos del template HTML, centralizándolos en constantes inmutables
 * reutilizables para facilitar la mantenibilidad y consistencia de UI.
 * ============================================================================
 */
export interface FormHtml {
  /** Nombre del control reactivo asociado en el FormGroup */
  formControlName?: string;

  /** Texto legible descriptivo mostrado en la etiqueta (<label> o <mat-label>) */
  label?: string;

  /** Texto de ayuda o sugerencia visible dentro del campo cuando está vacío */
  placeHolder?: string;

  /** Tipo de entrada HTML ('text', 'number', 'email', 'password', etc.) */
  type?: string;

  /** Restricciones y límites numéricos para validación en la vista */
  validators?: {
    /** Cantidad máxima de caracteres permitidos */
    maxLength?: number;
    /** Cantidad mínima de caracteres requeridos */
    minLength?: number;
    /** Valor numérico mínimo permitido */
    min?: number;
    /** Valor numérico máximo permitido */
    max?: number;
  };

  /** Nombre o identificador del icono posicionado a la derecha del campo */
  iconRight?: string;

  /** Nombre o identificador del icono posicionado a la izquierda del campo (prefix) */
  iconLeft?: string;

  /** Valor de texto o valor estático asociado al lado derecho */
  valueRight?: string;

  /** Valor de texto o valor estático asociado al lado izquierdo */
  valueLeft?: string;

  /** Identificador de slot o ranura de proyección de contenido para componentes personalizados */
  slot?: string;
}

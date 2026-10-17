/**
 * ============================================================================
 * Form Error Messages Constant
 * ============================================================================
 * Catálogo estandarizado de mensajes de error para validaciones en formularios reactivos.
 *
 * @remarks
 * Mapea las claves de error generadas por los validadores de Angular (`Validators`)
 * a mensajes legibles y amigables para el usuario final en español.
 * Consumido transversalmente por {@link FormModel.getErrorMessage}.
 * ============================================================================
 */
export const ErrorMessage: Record<string, string> = {
  /** Error cuando un campo obligatorio no contiene valor */
  required: 'Este campo es obligatorio.',

  /** Error cuando el texto no alcanza la cantidad mínima de caracteres */
  minlength: 'No cumple con la longitud mínima requerida.',

  /** Error cuando el texto excede la cantidad máxima de caracteres */
  maxlength: 'Supera la longitud máxima permitida.',

  /** Error cuando el valor no cumple con la expresión regular (regex) esperada */
  pattern: 'El formato ingresado no es válido.',

  /** Error cuando un número es menor al valor numérico mínimo configurado */
  min: 'El valor es inferior al mínimo permitido.',

  /** Error cuando un número supera el valor numérico máximo configurado */
  max: 'El valor supera el máximo permitido.',

  /** Error cuando un correo electrónico tiene formato inválido */
  email: 'El formato de correo electrónico no es válido.',
};

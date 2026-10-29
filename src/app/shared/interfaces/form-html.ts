export interface FormHtml {
  formControlName?: string;
  label?: string;
  placeHolder?: string;
  type?: string;
  validators?: {
    maxLength?: number;
    minLength?: number;
    min?: number;
    max?: number;
  };
  iconRight?: string;
  iconLeft?: string;
  valueRight?: string;
  valueLeft?: string;
  slot?: string;
}
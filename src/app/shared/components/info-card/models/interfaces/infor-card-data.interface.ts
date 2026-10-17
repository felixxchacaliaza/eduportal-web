import { CardColor } from "../types/card-color.type";

export interface InfoCardData {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: CardColor;
}

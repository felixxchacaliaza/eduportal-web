import { Area } from './area.interface';

export interface Subject {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly description?: string;
  readonly weeklyHours: number;
  readonly enabled: boolean;
  readonly area: Area;
}


import { Level } from './level.interface';

export interface Grade {
  readonly id: string;
  readonly code: string;
  readonly name: number;
  readonly description: string;
  readonly level: Level | string;
  readonly enabled: boolean;
}


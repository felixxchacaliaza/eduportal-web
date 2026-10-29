export type RuleDataType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ARRAY' | 'ARRAY_OBJECT' | 'OBJECT';

export interface Rule {
  readonly id: string;
  readonly code: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly isAnnual: boolean;
  readonly dataType: RuleDataType;
  readonly value: any;
  readonly activeYear?: string;
  readonly currentValue?: any;
  readonly enabled: boolean;
}
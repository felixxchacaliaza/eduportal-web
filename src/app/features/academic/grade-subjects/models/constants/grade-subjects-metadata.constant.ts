export interface SubjectMeta {
  readonly color: string;
}

export const SUBJECT_METADATA_MAP: Record<string, SubjectMeta> = {
  ART: { color: '#db2777' },
  COM: { color: '#059669' },
  CYT: { color: '#0891b2' },
  CIE: { color: '#0891b2' },
  DPCC: { color: '#7c3aed' },
  EDF: { color: '#16a34a' },
  EPT: { color: '#2563eb' },
  HIS: { color: '#d97706' },
  ING: { color: '#6366f1' },
  MAT: { color: '#2563eb' },
  REL: { color: '#0284c7' },
  TUT: { color: '#059669' },
};

export function getSubjectMetadata(code: string): SubjectMeta {
  const prefix = code?.split('-')[0]?.toUpperCase() || '';
  return SUBJECT_METADATA_MAP[prefix] || { color: '#475569' };
}
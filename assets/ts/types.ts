/**
 * EarthBuild Type Definitions
 */

export type SupportedLanguage =
  'python' | 'js' | 'typescript' | 'java' | 'cpp' | 'go' | 'rust' | 'zig';

export type WindowKey = 'cold' | 'edit' | 'repeat';

export interface TerminalLine {
  text: string;
  class?: string;
  delay: number;
}

export interface SampleMetrics {
  cachedTime: string;
  editTime: string;
  coldTime: string;
  editSpeedup: string;
  speedup: string;
  saved: string;
  ciSaved: string;
  co2Saved: string;
}

export interface CodeSample {
  filename: string;
  repoUrl: string;
  metrics: SampleMetrics;
  code: string;
  cached: TerminalLine[];
  edit: TerminalLine[];
  cold: TerminalLine[];
}

export type CodeSamplesMap = Record<SupportedLanguage, CodeSample>;

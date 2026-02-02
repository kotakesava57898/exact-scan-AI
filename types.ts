
export interface ErrorDetail {
  lineNumber: number;
  errorInNotepad: string;
  correctVersion: string;
  category: 'spelling' | 'punctuation' | 'missing' | 'extra' | 'formatting' | 'other';
}

export interface ComparisonResult {
  errors: ErrorDetail[];
  correctedText: string;
}

export interface AppState {
  imageFile: File | null;
  imagePreview: string | null;
  notepadContent: string;
  notepadFileName: string;
  isLoading: boolean;
  result: ComparisonResult | null;
  error: string | null;
}

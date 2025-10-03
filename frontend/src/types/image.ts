export type ProcessingPhase = 'arterial' | 'venous';

export interface ImageFile {
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

export interface ProcessedImageResponse {
  originalImage: string;
  processedImage: string;
  phase: ProcessingPhase;
  message?: string;
}

export interface ProcessingError {
  error: string;
  details?: string;
  timestamp: string;
}

export interface PythonServerStatus {
  status: 'connected' | 'disconnected';
  pythonServerUrl: string;
  timestamp: string;
  message?: string;
}

export interface ImageComparison {
  original: string | null;
  processed: string | null;
  phase: ProcessingPhase | null;
  isLoading: boolean;
}
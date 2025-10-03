export interface ImageProcessingRequest {
  phase: 'arterial' | 'venous';
  imagePath: string;
}

export interface ImageProcessingResponse {
  originalImage: string;
  processedImage: string;
  phase: 'arterial' | 'venous';
  message?: string;
}

export interface ProcessedImageData {
  processed_image_url: string;
  phase: string;
  status: string;
  processing_time_seconds?: number;
  original_size?: number;
  processed_size?: number;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
  timestamp: string;
}
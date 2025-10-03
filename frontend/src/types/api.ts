export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
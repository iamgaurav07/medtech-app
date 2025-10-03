import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import {
  ProcessedImageResponse,
  ProcessingError,
  PythonServerStatus,
} from "../types/image";
import { ApiResponse, ApiError } from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:2020/api";

const PYTHON_SERVER_URL =
  import.meta.env.VITE_PYTHON_SERVER_URL || "http://localhost:8000";

class ApiService {
  private client;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Bind methods to the instance
    this.setupInterceptors = this.setupInterceptors.bind(this);
    this.handleError = this.handleError.bind(this);

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log(
          `Making ${config.method?.toUpperCase()} request to: ${config.url}`
        );
        return config;
      },
      (error: AxiosError) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        console.error("Response error:", error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data as ProcessingError;
      return {
        message: errorData.error || "Server error occurred",
        code: error.response.status.toString(),
        details: errorData.details,
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        message: "Unable to connect to server. Please check your connection.",
        code: "NETWORK_ERROR",
      };
    } else {
      // Something else happened
      return {
        message: error.message || "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
      };
    }
  }

  // In frontend/src/services/api.ts
  async processImage(
    imageFile: File,
    phase: "arterial" | "venous",
    onUploadProgress?: (progress: number) => void
  ): Promise<any> {
    console.log("Processing image with Python server directly...", {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      phase: phase,
    });

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("phase", phase);

    try {
      const response = await fetch(`${PYTHON_SERVER_URL}/process-base64`, {
        method: "POST",
        body: formData,
      });

      console.log("Python server response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Python server error:", errorText);
        throw new Error(`Failed to process image: ${response.status}`);
      }

      const result = await response.json();
      console.log("Python server success:", result);

      return result;
    } catch (error) {
      console.error("Python API call failed:", error);
      throw error;
    }
  }

  async getPythonServerStatus(): Promise<any> {
    try {
      const response = await fetch(`${PYTHON_SERVER_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error("Python server health check failed:", error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response: AxiosResponse<{ status: string; timestamp: string }> =
        await this.client.get("/health");
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}

// Create and export a single instance
export const apiService = new ApiService();

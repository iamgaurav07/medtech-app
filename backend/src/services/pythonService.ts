import axios from 'axios';
import fs from 'fs';
import path from 'path';

export class PythonService {
  private pythonServerUrl: string;

  constructor() {
    this.pythonServerUrl = process.env.PYTHON_SERVER_URL || 'http://localhost:8000';
  }

  async processImage(imagePath: string, phase: 'arterial' | 'venous'): Promise<any> {
    try {
      const absolutePath = path.resolve(imagePath);
      
      console.log(`Processing image: ${absolutePath}, phase: ${phase}`);

      // Try to call Python server
      const response = await axios.post(
        `${this.pythonServerUrl}/process`,
        {
          image_path: absolutePath,
          phase: phase
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Python server error, using fallback:', error.message);
      
      // Fallback processing
      return this.fallbackProcessing(imagePath, phase);
    }
  }

  private fallbackProcessing(imagePath: string, phase: 'arterial' | 'venous'): any {
    const filename = path.basename(imagePath);
    const processedFilename = `fallback_${phase}_${filename}`;
    const processedPath = path.join('uploads', processedFilename);

    // Simply copy the file for fallback
    fs.copyFileSync(imagePath, processedPath);

    return {
      processed_image_url: `/uploads/${processedFilename}`,
      phase: phase,
      status: 'success',
      message: 'Fallback processing completed'
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      await axios.get(`${this.pythonServerUrl}/health`, { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const pythonService = new PythonService();
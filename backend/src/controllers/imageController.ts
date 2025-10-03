import { Request, Response } from 'express';
import { pythonService } from '../services/pythonService';
import { ImageProcessingResponse, ErrorResponse } from '../types/image';
import { handleMulterError } from '../utils/fileUpload';
import path from 'path';
import fs from 'fs';

export class ImageController {
  async processImage(req: Request, res: Response): Promise<void> {
    try {
      // Check if file was uploaded
      if (!req.file) {
        const errorResponse: ErrorResponse = {
          error: 'No image file provided',
          details: 'Please select an image file to upload',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(errorResponse);
        return;
      }

      const { phase } = req.body;

      // Validate phase
      if (!phase || !['arterial', 'venous'].includes(phase)) {
        const errorResponse: ErrorResponse = {
          error: 'Invalid phase selection',
          details: 'Phase must be either "arterial" or "venous"',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(errorResponse);
        return;
      }

      console.log(`Processing image: ${req.file.filename} with phase: ${phase}`);

      // Process image using Python service
      const processedData = await pythonService.processImage(req.file.path, phase as 'arterial' | 'venous');

      // Construct response
      const response: ImageProcessingResponse = {
        originalImage: `/uploads/${req.file.filename}`,
        processedImage: processedData.processed_image_url,
        phase: phase as 'arterial' | 'venous',
        message: `Image successfully processed with ${phase} phase`
      };

      res.status(200).json(response);

    } catch (error: any) {
      console.error('Image processing error:', error);

      const errorResponse: ErrorResponse = {
        error: 'Failed to process image',
        details: error.message,
        timestamp: new Date().toISOString()
      };

      res.status(500).json(errorResponse);
    }
  }

  handleUploadError(error: any, req: Request, res: Response): void {
    const errorMessage = handleMulterError(error);
    
    const errorResponse: ErrorResponse = {
      error: 'File upload failed',
      details: errorMessage,
      timestamp: new Date().toISOString()
    };

    res.status(400).json(errorResponse);
  }

  async getPythonServerStatus(req: Request, res: Response): Promise<void> {
    try {
      const isHealthy = await pythonService.healthCheck();
      
      res.status(200).json({
        status: isHealthy ? 'connected' : 'disconnected',
        pythonServerUrl: process.env.PYTHON_SERVER_URL,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(200).json({
        status: 'disconnected',
        pythonServerUrl: process.env.PYTHON_SERVER_URL,
        message: 'Python server is not available',
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const imageController = new ImageController();
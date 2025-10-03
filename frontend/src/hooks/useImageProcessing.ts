// frontend/src/hooks/useImageProcessing.ts
import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { ProcessingPhase, ImageComparison } from '../types';

export const useImageProcessing = () => {
  const [comparison, setComparison] = useState<ImageComparison>({
    original: null,
    processed: null,
    phase: null,
    isLoading: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const processImage = useCallback(async (file: File, phase: ProcessingPhase): Promise<void> => {
    setComparison(prev => ({ ...prev, isLoading: true }));
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call Python server directly with base64
      const result = await apiService.processImage(file, phase);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Use base64 images directly - no URL conversion needed
      setComparison({
        original: result.originalImage, // This is base64 string
        processed: result.processedImage, // This is base64 string
        phase: result.phase,
        isLoading: false,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setComparison(prev => ({ ...prev, isLoading: false }));
      setUploadProgress(0);
    }
  }, []);

  const reset = useCallback((): void => {
    setComparison({
      original: null,
      processed: null,
      phase: null,
      isLoading: false,
    });
    setError(null);
    setUploadProgress(0);
  }, []);

  return {
    comparison,
    error,
    uploadProgress,
    processImage,
    reset,
    isLoading: comparison.isLoading,
  };
};
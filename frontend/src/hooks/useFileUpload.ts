import { useState, useCallback } from 'react';
import { ImageFile } from '../types';

export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState<ImageFile | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const handleFileSelect = useCallback((file: File): void => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file (JPG, PNG, GIF)');
    }

    const maxSize = parseInt(import.meta.env.VITE_UPLOAD_MAX_SIZE || '10485760')
    if (file.size > maxSize) {
      throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
    }

    const previewUrl = URL.createObjectURL(file);
    
    setSelectedFile({
      file,
      previewUrl,
      name: file.name,
      size: file.size,
    });
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent): void => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent): void => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent): void => {
    event.preventDefault();
    setDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const clearFile = useCallback((): void => {
    if (selectedFile?.previewUrl) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
  }, [selectedFile]);

  return {
    selectedFile,
    dragOver,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearFile,
  };
};
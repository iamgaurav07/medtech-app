import React from 'react';
import { Upload, FileImage, X } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
  selectedFile: { name: string; size: number } | null;
  onClear: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onError,
  selectedFile,
  onClear,
}) => {
  const {
    dragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileUpload();

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        onFileSelect(file);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Invalid file');
      }
    }
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-lg font-semibold text-gray-700">
              Drop your CT scan image here
            </p>
            <p className="text-sm text-gray-500">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports JPG, PNG, GIF • Max 10MB
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileImage className="h-8 w-8 text-green-600" />
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {selectedFile.name}
                </span>
                <span className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
            <button
              onClick={onClear}
              className="p-1 hover:bg-red-100 rounded-full transition-colors"
              aria-label="Remove file"
            >
              <X className="h-5 w-5 text-red-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
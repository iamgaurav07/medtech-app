import React from 'react';
import { Download, ZoomIn, AlertCircle } from 'lucide-react';
import { ImageComparison as ImageComparisonType } from '../types';

interface ImageComparisonProps {
  comparison: ImageComparisonType;
  onDownload?: (imageUrl: string, filename: string) => void;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  comparison,
  onDownload,
}) => {
  const handleDownload = (imageUrl: string, type: 'original' | 'processed'): void => {
    if (onDownload) {
      const filename = type === 'original' ? 'original-image.jpg' : `processed-${comparison.phase}-image.jpg`;
      onDownload(imageUrl, filename);
    } else {
      // Fallback download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = type === 'original' ? 'original-image.jpg' : `processed-${comparison.phase}-image.jpg`;
      link.click();
    }
  };

  if (!comparison.original && !comparison.processed) {
    return (
      <div className="bg-gray-50 rounded-lg p-12 text-center">
        <ZoomIn className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Images to Display
        </h3>
        <p className="text-gray-500">
          Upload a CT scan image and select a processing phase to see the comparison.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Original Image */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Original Image</h3>
            {comparison.original && (
              <button
                onClick={() => handleDownload(comparison.original!, 'original')}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            )}
          </div>
        </div>
        <div className="p-4 min-h-64 flex items-center justify-center">
          {comparison.original ? (
            <img
              src={comparison.original}
              alt="Original CT Scan"
              className="max-w-full max-h-96 object-contain rounded"
            />
          ) : (
            <div className="text-gray-400 text-center">
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              <p>Original image not available</p>
            </div>
          )}
        </div>
      </div>

      {/* Processed Image */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Processed Image</h3>
              {comparison.phase && (
                <p className="text-sm text-gray-600 capitalize">
                  {comparison.phase} Phase
                </p>
              )}
            </div>
            {comparison.processed && (
              <button
                onClick={() => handleDownload(comparison.processed!, 'processed')}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            )}
          </div>
        </div>
        <div className="p-4 min-h-64 flex items-center justify-center">
          {comparison.processed ? (
            <img
              src={comparison.processed}
              alt={`Processed CT Scan - ${comparison.phase} Phase`}
              className="max-w-full max-h-96 object-contain rounded"
            />
          ) : comparison.isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing image...</p>
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              <p>Processed image will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
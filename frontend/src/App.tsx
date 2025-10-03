import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { PhaseSelector } from './components/PhaseSelector';
import { ImageComparison } from './components/ImageComparison';
import { ProgressBar } from './components/ProgressBar';
import { StatusIndicator } from './components/StatusIndicator';
import { useImageProcessing } from './hooks/useImageProcessing';
import { useFileUpload } from './hooks/useFileUpload';
import { ProcessingPhase } from './types';
import { Brain, AlertCircle, RotateCcw } from 'lucide-react';
import './styles/App.css';

const App: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<ProcessingPhase>('arterial');
  const [error, setError] = useState<string | null>(null);

  const {
    selectedFile,
    handleFileSelect,
    clearFile,
  } = useFileUpload();

  const {
    comparison,
    error: processingError,
    uploadProgress,
    processImage,
    reset,
    isLoading,
  } = useImageProcessing();

  const handleProcessImage = async (): Promise<void> => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setError(null);
    await processImage(selectedFile.file, selectedPhase);
  };

  const handleFileSelection = (file: File): void => {
    try {
      handleFileSelect(file);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid file');
    }
  };

  const handleReset = (): void => {
    clearFile();
    reset();
    setError(null);
    setSelectedPhase('arterial');
  };

  const hasResults = comparison.original || comparison.processed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {import.meta.env.VITE_APP_NAME || 'MedTech Surgical Planning'}
                </h1>
                <p className="text-gray-600">CT Scan Image Processing Simulator</p>
              </div>
            </div>
            <StatusIndicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Image Processing Controls
              </h2>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload CT Scan Image
                </label>
                <FileUpload
                  onFileSelect={handleFileSelection}
                  onError={setError}
                  selectedFile={selectedFile}
                  onClear={handleReset}
                />
              </div>

              {/* Phase Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Processing Phase
                </label>
                <PhaseSelector
                  selectedPhase={selectedPhase}
                  onPhaseChange={setSelectedPhase}
                  disabled={!selectedFile || isLoading}
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleProcessImage}
                  disabled={!selectedFile || isLoading}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    'Process Image'
                  )}
                </button>

                {(selectedFile || hasResults) && (
                  <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset All
                  </button>
                )}
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <ProgressBar
                    progress={uploadProgress}
                    label="Uploading image..."
                  />
                </div>
              )}

              {/* Error Display */}
              {(error || processingError) && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium">Error:</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    {error || processingError}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Image Comparison
              </h2>
              <ImageComparison comparison={comparison} />
            </div>

            {/* Information Section */}
            {!hasResults && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  How to Use This Tool
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <h4 className="font-medium mb-2">1. Upload Image</h4>
                    <p>Select a CT scan image in JPG, PNG, or GIF format (max 10MB).</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">2. Choose Phase</h4>
                    <p>Select either Arterial (increased contrast) or Venous (smoothing) phase.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">3. Process</h4>
                    <p>Click "Process Image" to see the simulated results.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">4. Compare</h4>
                    <p>View original and processed images side by side.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 MedTech Surgical Planning Simulator. For educational purposes only.
            </p>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <span className="text-xs text-gray-500">
                Backend: {import.meta.env.VITE_API_BASE_URL}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
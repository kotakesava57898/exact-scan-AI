
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import ResultsSection from './components/ResultsSection';
import { AppState, ComparisonResult } from './types';
import { analyzeComparison } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    imageFile: null,
    imagePreview: null,
    notepadContent: '',
    notepadFileName: '',
    isLoading: false,
    result: null,
    error: null,
  });

  const handleImageChange = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setState(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: e.target?.result as string,
        result: null, // Clear previous results
        error: null
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleNotepadChange = useCallback((content: string, fileName: string) => {
    setState(prev => ({
      ...prev,
      notepadContent: content,
      notepadFileName: fileName,
      result: null, // Clear previous results
      error: null
    }));
  }, []);

  const handleDeepScan = async () => {
    if (!state.imagePreview || !state.notepadContent) {
      setState(prev => ({ ...prev, error: "Please upload both a reference image and a notepad file." }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null, result: null }));

    try {
      const analysisResult = await analyzeComparison(state.imagePreview, state.notepadContent);
      setState(prev => ({ 
        ...prev, 
        result: analysisResult, 
        isLoading: false 
      }));
    } catch (err: any) {
      console.error("Analysis error:", err);
      setState(prev => ({ 
        ...prev, 
        error: "Failed to complete deep scan. Please ensure the image is clear and the notepad file is readable. " + (err.message || ""), 
        isLoading: false 
      }));
    }
  };

  const isReady = !!state.imagePreview && !!state.notepadContent;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Intro Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Precision Document Audit
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
            Compare handwritten or printed text from images with digital transcripts to find every minor discrepancy instantly.
          </p>
        </div>

        {/* Uploaders */}
        <FileUploader 
          onImageChange={handleImageChange}
          onNotepadChange={handleNotepadChange}
          imagePreview={state.imagePreview}
          notepadFileName={state.notepadFileName}
        />

        {/* Action Button */}
        <div className="flex flex-col items-center justify-center gap-4 mb-12">
          {state.error && (
            <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{state.error}</span>
            </div>
          )}

          <button
            onClick={handleDeepScan}
            disabled={!isReady || state.isLoading}
            className={`
              relative px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95
              ${isReady && !state.isLoading 
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
          >
            {state.isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Auditing Document...
              </span>
            ) : (
              'Start Deep Scan Comparison'
            )}
          </button>
          
          {!isReady && !state.isLoading && (
            <p className="text-xs text-gray-400 font-medium">Please upload image and text file to begin</p>
          )}
        </div>

        {/* Results */}
        {state.result && <ResultsSection result={state.result} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          Powered by Gemini 3 Pro • Built for 100% Text Verification Accuracy
        </div>
      </footer>
    </div>
  );
};

export default App;

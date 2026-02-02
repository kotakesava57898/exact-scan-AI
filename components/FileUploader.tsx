
import React from 'react';

interface FileUploaderProps {
  onImageChange: (file: File) => void;
  onNotepadChange: (content: string, fileName: string) => void;
  imagePreview: string | null;
  notepadFileName: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onImageChange, 
  onNotepadChange, 
  imagePreview, 
  notepadFileName 
}) => {
  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageChange(file);
  };

  const handleNotepadInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onNotepadChange(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Reference Image Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
          Step 1: Reference Image
        </label>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] bg-gray-50 relative group transition-colors hover:border-blue-400">
          {imagePreview ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={imagePreview} alt="Reference" className="max-h-[300px] object-contain rounded shadow-md" />
              <button 
                onClick={() => {
                  const input = document.getElementById('image-upload') as HTMLInputElement;
                  if (input) input.value = '';
                  // In a real app we'd trigger a state clear here, but we'll let parent handle via re-upload
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload reference image</p>
            </div>
          )}
          <input 
            id="image-upload"
            type="file" 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleImageInput}
          />
        </div>
      </div>

      {/* Candidate Notepad Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
          Step 2: Candidate Notepad File
        </label>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] bg-gray-50 relative group transition-colors hover:border-blue-400">
          {notepadFileName ? (
            <div className="text-center">
               <svg className="mx-auto h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-900">{notepadFileName}</p>
              <p className="text-xs text-gray-500">File loaded successfully</p>
            </div>
          ) : (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload .txt or notepad file</p>
            </div>
          )}
          <input 
            id="notepad-upload"
            type="file" 
            accept=".txt,.md,.rtf" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleNotepadInput}
          />
        </div>
      </div>
    </div>
  );
};

export default FileUploader;

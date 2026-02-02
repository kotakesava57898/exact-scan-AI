
import React from 'react';
import { ComparisonResult } from '../types';

interface ResultsSectionProps {
  result: ComparisonResult;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Error List Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Found Discrepancies</h2>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
            {result.errors.length} Errors Found
          </span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Line</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Error Word</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Correct Word</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.errors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">
                    No discrepancies detected. The text matches 100%.
                  </td>
                </tr>
              ) : (
                result.errors.map((error, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      {error.lineNumber}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">
                      <span className="bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 inline-block">
                        {error.errorInNotepad === '' ? <span className="text-gray-400 font-normal italic">Missing</span> : error.errorInNotepad}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded border border-green-100 inline-block">
                        {error.correctVersion === '' ? <span className="text-gray-400 font-normal italic">Remove</span> : error.correctVersion}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full 
                        ${error.category === 'spelling' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 
                          error.category === 'punctuation' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                          error.category === 'formatting' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                        {error.category.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Corrected Text Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Corrected Version</h2>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(result.correctedText);
              alert('Corrected text copied to clipboard!');
            }}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            Copy All
          </button>
        </div>
        <div className="bg-gray-900 rounded-xl shadow-inner border border-gray-800 p-6">
          <pre className="text-white font-mono text-sm whitespace-pre-wrap break-words leading-relaxed">
            {result.correctedText}
          </pre>
          <div className="mt-4 pt-4 border-t border-gray-800 text-gray-500 text-xs italic">
            * Line breaks preserved from image. Inter-paragraph spacing removed.
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResultsSection;

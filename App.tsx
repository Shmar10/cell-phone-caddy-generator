import React, { useState } from 'react';
import { GridConfig, ClassRoster } from './types';
import { INITIAL_CONFIG } from './constants';
import ConfigPanel from './components/ConfigPanel';
import CsvUploader from './components/CsvUploader';
import TablePreview from './components/TablePreview';
import ScriptModal from './components/ScriptModal';
import { generateGoogleAppsScript } from './services/geminiService';
import { Layout, Wand2, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<GridConfig>(INITIAL_CONFIG);
  const [rosters, setRosters] = useState<ClassRoster[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    // Validation: Check for Doc ID
    if (!config.docId) {
        setError("Please enter a Google Doc ID.");
        return;
    }

    // Validation: Ensure at least one roster is uploaded
    if (rosters.length === 0) {
        setError("Please upload at least one CSV roster.");
        return;
    }
    
    // Clear previous errors and start loading
    setError(null);
    setIsGenerating(true);

    try {
      const code = await generateGoogleAppsScript(config, rosters);
      setGeneratedCode(code);
      setShowModal(true);
    } catch (err: any) {
      setError("Failed to generate script. Ensure API Key is set. " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Layout className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Seating Chart <span className="text-indigo-600">Generator</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <a href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition">Help</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar: Controls */}
          <div className="w-full lg:w-1/3 lg:min-w-[350px]">
            <ConfigPanel config={config} setConfig={setConfig} />
            
            {/* Action Area */}
            <div className="mt-6 space-y-4">
               {error && (
                   <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                       <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                       {error}
                   </div>
               )}
               
               <button
                  onClick={handleGenerate}
                  disabled={isGenerating || rosters.length === 0}
                  className={`
                    w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all
                    ${isGenerating || rosters.length === 0
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:-translate-y-0.5'
                    }
                  `}
               >
                  {isGenerating ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Thinking...
                      </>
                  ) : (
                      <>
                        <Wand2 className="w-6 h-6" />
                        Generate Script
                      </>
                  )}
               </button>
               <p className="text-xs text-center text-slate-400">
                   Powered by Google Gemini 2.5 Flash
               </p>
            </div>
          </div>

          {/* Right Main: Content & Preview */}
          <div className="flex-1 space-y-8">
            
            {/* Upload Section */}
            <section>
                <h2 className="text-lg font-semibold mb-4 text-slate-800">1. Upload Rosters</h2>
                <CsvUploader rosters={rosters} setRosters={setRosters} />
            </section>

            {/* Preview Section */}
            {rosters.length > 0 && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-4">
                         <h2 className="text-lg font-semibold text-slate-800">2. Layout Preview</h2>
                         <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                            {config.rows} x {config.columns} Grid
                         </span>
                    </div>
                    
                    <div className="space-y-6">
                        {rosters.map(roster => (
                            <TablePreview 
                                key={roster.id} 
                                roster={roster} 
                                config={config} 
                            />
                        ))}
                    </div>
                </section>
            )}

            {rosters.length === 0 && (
                <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                    <Layout className="w-12 h-12 mb-2 opacity-50" />
                    <p>Upload CSV files to see layout previews</p>
                </div>
            )}
          </div>
        </div>
      </main>

      <ScriptModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        code={generatedCode} 
      />
    </div>
  );
};

export default App;

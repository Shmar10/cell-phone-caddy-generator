import React from 'react';
import { X, Copy, CheckCircle, Terminal } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

const ScriptModal: React.FC<Props> = ({ isOpen, onClose, code }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
                <Terminal className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800">Google Apps Script Generated</h3>
                <p className="text-xs text-slate-500">Copy this code into your Google Doc's Script Editor.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="bg-slate-800 text-slate-50 p-4 overflow-auto font-mono text-sm flex-1">
                <pre className="whitespace-pre-wrap break-all">{code}</pre>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3 items-center">
             <span className="text-xs text-slate-500 mr-auto">
                To use: Extensions &gt; Apps Script &gt; Paste &gt; Run 'createSeatingCharts'
             </span>
             <button 
                onClick={handleCopy}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition text-white
                    ${copied ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'}
                `}
             >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
             </button>
        </div>
      </div>
    </div>
  );
};

export default ScriptModal;
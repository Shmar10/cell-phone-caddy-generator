import React, { useRef } from 'react';
import { UploadCloud, FileSpreadsheet, X } from 'lucide-react';
import { ClassRoster, Student } from '../types';
import { parseCSV } from '../utils/csvParser';
import { PASTEL_COLORS } from '../constants';

interface Props {
  rosters: ClassRoster[];
  setRosters: React.Dispatch<React.SetStateAction<ClassRoster[]>>;
}

const CsvUploader: React.FC<Props> = ({ rosters, setRosters }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newRosters: ClassRoster[] = [];
    // Explicitly type as File[] because Array.from on FileList can infer unknown[] in some configs
    const files: File[] = Array.from(event.target.files);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = await file.text();
      const students = parseCSV(text);
      
      // Assign a generic pastel color based on total count so far
      const colorIndex = (rosters.length + i) % PASTEL_COLORS.length;
      
      newRosters.push({
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name.replace(/\.csv$/i, ''),
        students,
        color: PASTEL_COLORS[colorIndex],
      });
    }

    setRosters(prev => [...prev, ...newRosters]);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeRoster = (id: string) => {
    setRosters(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer bg-white group"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="bg-indigo-100 p-3 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">Upload CSV Rosters</h3>
        <p className="text-sm text-slate-500 max-w-xs mt-2">
          Select multiple CSV files. We'll auto-detect student names.
        </p>
        <input
          type="file"
          multiple
          accept=".csv"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {rosters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rosters.map(roster => (
            <div key={roster.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600" style={{ backgroundColor: roster.color }}>
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm truncate max-w-[150px]">{roster.filename}</p>
                  <p className="text-xs text-slate-500">{roster.students.length} students</p>
                </div>
              </div>
              <button 
                onClick={() => removeRoster(roster.id)}
                className="text-slate-400 hover:text-red-500 transition p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CsvUploader;
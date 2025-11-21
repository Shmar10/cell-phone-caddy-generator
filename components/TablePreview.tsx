import React, { useMemo } from 'react';
import { ClassRoster, GridConfig, FillDirection, ProcessedCell } from '../types';
import { User } from 'lucide-react';

interface Props {
  roster: ClassRoster;
  config: GridConfig;
}

const TablePreview: React.FC<Props> = ({ roster, config }) => {
  const processedCells = useMemo(() => {
    const cells: ProcessedCell[] = [];
    const totalCells = config.rows * config.columns;
    const students = roster.students;

    // Create base grid
    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.columns; c++) {
        cells.push({
          index: 0, // Placeholder
          student: null,
          row: r,
          col: c,
          isUsed: false
        });
      }
    }

    // Apply fill logic
    if (config.fillDirection === FillDirection.TOP_LEFT_FORWARD) {
        // Simple forward fill
        for(let i = 0; i < totalCells; i++) {
            cells[i].index = i + 1;
            if (i < students.length) {
                cells[i].student = students[i];
                cells[i].isUsed = true;
            }
        }
    } else {
        // Bottom right backward logic
        // We start filling students from the LAST cell backwards to the FIRST cell.
        // Cell N = last cell (Row-1, Col-1)
        
        let studentIdx = 0;
        for (let i = totalCells - 1; i >= 0; i--) {
            cells[i].index = i + 1; // Always number 1..N from top-left to bottom-right

            if (studentIdx < students.length) {
               cells[i].student = students[studentIdx];
               cells[i].isUsed = true;
               studentIdx++;
            }
        }
    }

    return cells;
  }, [roster, config]);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm bg-white mb-8">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <span className="font-semibold text-slate-700">{roster.filename}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider">Preview</span>
      </div>
      <div className="p-4 overflow-x-auto">
        <div 
            className="grid gap-2 mx-auto"
            style={{
                gridTemplateColumns: `repeat(${config.columns}, minmax(100px, 1fr))`,
                width: 'fit-content'
            }}
        >
            {processedCells.map((cell) => (
                <div 
                    key={`${cell.row}-${cell.col}`}
                    className={`
                        relative h-24 rounded-md border p-2 flex flex-col justify-between transition-colors
                        ${cell.isUsed ? 'border-slate-300 shadow-sm' : 'border-slate-100 bg-slate-50'}
                    `}
                    style={{
                        backgroundColor: cell.isUsed ? roster.color : undefined
                    }}
                >
                    <span className="text-xs font-mono text-slate-400 font-bold">{cell.index}</span>
                    
                    {cell.student ? (
                        <div className="text-center">
                             <p className="text-xs font-bold text-slate-800 break-words leading-tight">
                                {cell.student.formatted}
                             </p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full opacity-20">
                            {cell.isUsed && <User className="w-6 h-6" />}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TablePreview;
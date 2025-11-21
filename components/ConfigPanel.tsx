import React from 'react';
import { GridConfig, FillDirection } from '../types';
import { Settings, Link, LayoutGrid, ArrowRight } from 'lucide-react';

interface ConfigPanelProps {
  config: GridConfig;
  setConfig: (config: GridConfig) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig }) => {
  
  // Helper to safely update config
  const handleChange = (field: keyof GridConfig, value: string | number) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
        <Settings className="w-5 h-5 text-slate-500" />
        <h2 className="font-semibold text-slate-800">Configuration</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Google Doc ID Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
            <Link className="w-4 h-4" />
            Google Doc ID (or URL)
          </label>
          <input
            type="text"
            value={config.docId}
            onChange={(e) => handleChange('docId', e.target.value)}
            placeholder="Paste full Google Doc URL here..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
          />
          <p className="text-xs text-slate-500">
            Create a blank Google Doc and paste its link here.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* Grid Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Rows
            </label>
            <input
              type="number"
              min={1}
              max={8}
              value={config.rows}
              onChange={(e) => {
                // Enforce limits: Max 8 rows to fit on page
                let val = parseInt(e.target.value) || 0;
                if (val > 8) val = 8;
                if (val < 1) val = 1;
                handleChange('rows', val);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <p className="text-[10px] text-slate-400">Max 8</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 rotate-90" />
              Columns
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={config.columns}
              onChange={(e) => {
                // Enforce limits: Max 6 cols to keep names readable
                let val = parseInt(e.target.value) || 0;
                if (val > 6) val = 6;
                if (val < 1) val = 1;
                handleChange('columns', val);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <p className="text-[10px] text-slate-400">Max 6</p>
          </div>
        </div>

        {/* Fill Direction */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Fill Direction
          </label>
          <div className="relative">
            <select
              value={config.fillDirection}
              onChange={(e) => handleChange('fillDirection', e.target.value as FillDirection)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
            >
              <option value="Top Left → Forward">Top Left → Forward</option>
              <option value="Bottom Right ← Backward">Bottom Right ← Backward</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Choose "Bottom Right" for caddies where seat #1 is bottom-right.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;

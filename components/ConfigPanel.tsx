import React from 'react';
import { GridConfig, FillDirection, Theme, OverflowBehavior } from '../types';
import { Settings, Link, LayoutGrid, ArrowRight, Palette, Users, Scissors, FilePlus } from 'lucide-react';

interface ConfigPanelProps {
  config: GridConfig;
  setConfig: (config: GridConfig) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig }) => {
  
  const handleChange = (field: keyof GridConfig, value: any) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
        <Settings className="w-5 h-5 text-slate-500" />
        <h2 className="font-semibold text-slate-800">Configuration</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Google Doc ID */}
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
              onChange={(e) => handleChange('rows', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
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
              onChange={(e) => handleChange('columns', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Fill Direction
          </label>
          <select
            value={config.fillDirection}
            onChange={(e) => handleChange('fillDirection', e.target.value as FillDirection)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Top Left → Forward">Top Left → Forward</option>
            <option value="Bottom Right ← Backward">Bottom Right ← Backward</option>
          </select>
        </div>

        <hr className="border-slate-100" />

        {/* Appearance */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appearance</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Theme
                    </label>
                    <select
                        value={config.theme}
                        onChange={(e) => handleChange('theme', e.target.value as Theme)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="Standard">Standard</option>
                        <option value="Pastel">Pastel</option>
                        <option value="High Contrast">High Contrast</option>
                        <option value="Black & White">Black & White</option>
                    </select>
                </div>
                <div className="flex items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={config.landscape}
                            onChange={(e) => handleChange('landscape', e.target.checked)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-slate-700">Landscape Mode</span>
                    </label>
                </div>
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* Student Placement */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Placement</h3>
            <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={config.randomize}
                        onChange={(e) => handleChange('randomize', e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Randomize Order
                    </span>
                </label>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Scissors className="w-4 h-4" />
                    Skip Broken Pockets
                </label>
                <input
                    type="text"
                    value={config.skipSeats}
                    onChange={(e) => handleChange('skipSeats', e.target.value)}
                    placeholder="e.g., 13, 24, 30"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400">Comma-separated seat numbers to leave empty.</p>
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                    <FilePlus className="w-4 h-4" />
                    Overflow Behavior
                </label>
                <select
                    value={config.overflow}
                    onChange={(e) => handleChange('overflow', e.target.value as OverflowBehavior)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="New Page">Create New Page</option>
                    <option value="Waiting List">List at Bottom</option>
                </select>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;

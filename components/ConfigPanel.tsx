import React from 'react';
import { GridConfig, FillDirection } from '../types';
import { Settings, Grid3X3, FileText, ArrowRightLeft } from 'lucide-react';

interface Props {
  config: GridConfig;
  setConfig: React.Dispatch<React.SetStateAction<GridConfig>>;
}

const ConfigPanel: React.FC<Props> = ({ config, setConfig }) => {
  const handleChange = (key: keyof GridConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Settings className="w-5 h-5 text-indigo-600" />
        Configuration
      </h2>

      <div className="space-y-6">
        {/* Doc ID */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Google Doc ID
          </label>
          <input
            type="text"
            value={config.docId}
            onChange={(e) => handleChange('docId', e.target.value)}
            placeholder="1yX... (from URL)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
          />
          <p className="text-xs text-slate-500">
            Found in the URL of your Google Doc between /d/ and /edit.
          </p>
        </div>

        {/* Grid Dims */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" /> Rows
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={config.rows}
              onChange={(e) => handleChange('rows', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Columns</label>
            <input
              type="number"
              min={1}
              max={10}
              value={config.columns}
              onChange={(e) => handleChange('columns', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* Fill Direction */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" /> Fill Direction
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
              <input
                type="radio"
                name="fillDirection"
                checked={config.fillDirection === FillDirection.TOP_LEFT_FORWARD}
                onChange={() => handleChange('fillDirection', FillDirection.TOP_LEFT_FORWARD)}
                className="text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="text-sm text-slate-700">Top Left <span className="text-indigo-500 font-bold">→</span> Forward</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
              <input
                type="radio"
                name="fillDirection"
                checked={config.fillDirection === FillDirection.BOTTOM_RIGHT_BACKWARD}
                onChange={() => handleChange('fillDirection', FillDirection.BOTTOM_RIGHT_BACKWARD)}
                className="text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="text-sm text-slate-700">Bottom Right <span className="text-indigo-500 font-bold">←</span> Backward</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
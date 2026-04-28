import type { ExerciseFormState } from '../types';
import { quickExercisePresets } from '../data/presets';

type QuickPresetsProps = {
  onApplyPreset: (form: ExerciseFormState) => void;
  title?: string;
  description?: string;
  maxItems?: number;
};

export default function QuickPresets({
  onApplyPreset,
  title = '快速新增預設運動',
  description = '用預設值起步，再依照今天的狀況微調。',
  maxItems
}: QuickPresetsProps) {
  const presets = maxItems ? quickExercisePresets.slice(0, maxItems) : quickExercisePresets;

  return (
    <section className="preset-panel">
      <div className="panel-heading compact-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="preset-grid">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="preset-card"
            onClick={() => onApplyPreset(preset.form)}
          >
            <span className="preset-title">{preset.label}</span>
            <span className="preset-description">{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

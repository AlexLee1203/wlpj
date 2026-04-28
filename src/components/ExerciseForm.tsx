import { useEffect, useMemo, useRef, useState } from 'react';
import { quickExercisePresets } from '../data/presets';
import type { ExerciseFormState } from '../types';

type ExerciseFormProps = {
  form: ExerciseFormState;
  error: string | null;
  selectedDate: string;
  isEditing: boolean;
  focusTrigger: number;
  onClose: () => void;
  onChange: (field: keyof ExerciseFormState, value: string) => void;
  onApplyPreset: (form: ExerciseFormState) => void;
  onCancelEdit: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function ExerciseForm({
  form,
  error,
  selectedDate,
  isEditing,
  focusTrigger,
  onClose,
  onChange,
  onApplyPreset,
  onCancelEdit,
  onSubmit
}: ExerciseFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const popularPresets = quickExercisePresets.slice(0, 6);
  const filteredPresets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return quickExercisePresets
      .filter((preset) => {
        const label = preset.label.toLowerCase();
        const description = preset.description.toLowerCase();
        return label.includes(normalizedQuery) || description.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [searchQuery]);
  const groupedPresets = useMemo(() => {
    return quickExercisePresets.reduce<Record<string, typeof quickExercisePresets>>(
      (groups, preset) => {
        const currentGroup = groups[preset.category] ?? [];
        groups[preset.category] = [...currentGroup, preset];
        return groups;
      },
      {}
    );
  }, []);

  useEffect(() => {
    if (focusTrigger === 0) {
      return;
    }

    nameInputRef.current?.focus();
    nameInputRef.current?.select();
  }, [focusTrigger]);

  function handleApplyPreset(form: ExerciseFormState) {
    onApplyPreset(form);
    setSearchQuery(form.name);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        ref={formRef}
        className="panel form-panel modal-card"
        onSubmit={onSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div className="panel-heading">
            <h2>{isEditing ? '編輯運動紀錄' : '新增運動紀錄'}</h2>
            <p>
              {isEditing
                ? `目前正在修改 ${selectedDate} 這一天的紀錄。`
                : `目前會加入到 ${selectedDate} 這一天的運動清單。`}
            </p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="關閉">
            ×
          </button>
        </div>

        <label>
          <span>快速尋找運動</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="搜尋跑步、瑜伽、羽球..."
          />
        </label>

        <div className="preset-chooser">
          <div>
            <p className="preset-section-title">熱門項目</p>
            <div className="preset-chip-list">
              {popularPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="preset-chip"
                  onClick={() => handleApplyPreset(preset.form)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {searchQuery.trim() ? (
            <div>
              <p className="preset-section-title">搜尋結果</p>
              <div className="preset-search-results">
                {filteredPresets.length > 0 ? (
                  filteredPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="preset-search-item"
                      onClick={() => handleApplyPreset(preset.form)}
                    >
                      <span className="preset-title">{preset.label}</span>
                      <span className="preset-description">{preset.description}</span>
                    </button>
                  ))
                ) : (
                  <p className="preset-empty">找不到符合的常用運動，仍可手動輸入。</p>
                )}
              </div>
            </div>
          ) : null}

          <div>
            <p className="preset-section-title">全部運動項目</p>
            <div className="preset-category-list">
              {Object.entries(groupedPresets).map(([category, presets]) => (
                <details key={category} className="preset-category">
                  <summary>
                    <span>{category}</span>
                    <span>{presets.length} 項</span>
                  </summary>
                  <div className="preset-category-items">
                    {presets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        className="preset-category-item"
                        onClick={() => handleApplyPreset(preset.form)}
                      >
                        <span className="preset-title">{preset.label}</span>
                        <span className="preset-description">{preset.description}</span>
                      </button>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        <label>
          <span>運動項目</span>
          <input
            ref={nameInputRef}
            value={form.name}
            onChange={(event) => onChange('name', event.target.value)}
            placeholder="例如：快走、瑜伽、跳繩"
          />
        </label>

        <label>
          <span>持續時間（分鐘）</span>
          <input
            type="number"
            min="1"
            step="1"
            value={form.durationMinutes}
            onChange={(event) => onChange('durationMinutes', event.target.value)}
            placeholder="30"
          />
        </label>

        <label>
          <span>消耗熱量（kcal）</span>
          <input
            type="number"
            min="0"
            step="1"
            value={form.caloriesBurned}
            onChange={(event) => onChange('caloriesBurned', event.target.value)}
            placeholder="180"
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="form-actions">
          <button type="submit">{isEditing ? '更新運動紀錄' : '加入這一天的運動計劃'}</button>
          {isEditing ? (
            <button type="button" className="secondary-button" onClick={onCancelEdit}>
              取消編輯
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}

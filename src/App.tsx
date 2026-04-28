import { useEffect, useState } from 'react';
import BackupPanel from './components/BackupPanel';
import CalendarPanel from './components/CalendarPanel';
import ExerciseForm from './components/ExerciseForm';
import ExerciseList from './components/ExerciseList';
import GettingStarted from './components/GettingStarted';
import StatsPanel from './components/StatsPanel';
import { quickExercisePresets } from './data/presets';
import type { ExerciseFormState, ExerciseLog } from './types';
import {
  createExerciseFormState,
  createExerciseLog,
  filterLogsByDate,
  getCompletionRate,
  getCompletedCount,
  getTotalCalories,
  removeExerciseLog,
  removeLogsByDate,
  sortLogsForDisplay,
  updateExerciseLog,
  validateExerciseForm
} from './utils/exercise';
import { formatDateLabel, monthString, shiftMonth, todayString } from './utils/date';
import {
  downloadLogsBackup,
  importLogsFromText,
  readLogs,
  writeLogs
} from './utils/storage';

export default function App() {
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [visibleMonth, setVisibleMonth] = useState(monthString(todayString()));
  const [form, setForm] = useState<ExerciseFormState>(createExerciseFormState());
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [formFocusTrigger, setFormFocusTrigger] = useState(0);

  useEffect(() => {
    setLogs(readLogs());
  }, []);

  useEffect(() => {
    writeLogs(logs);
  }, [logs]);

  const filteredLogs = sortLogsForDisplay(filterLogsByDate(logs, selectedDate));
  const totalCalories = getTotalCalories(filteredLogs);
  const completedCount = getCompletedCount(filteredLogs);
  const completionRate = getCompletionRate(filteredLogs);
  const dateLabel = formatDateLabel(selectedDate);
  const hasAnyLogs = logs.length > 0;
  const logsCountByDate = logs.reduce<Record<string, number>>((counts, log) => {
    counts[log.date] = (counts[log.date] ?? 0) + 1;
    return counts;
  }, {});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateExerciseForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (editingLogId) {
      setLogs((currentLogs) => updateExerciseLog(currentLogs, editingLogId, form, selectedDate));
      setEditingLogId(null);
    } else {
      const nextLog = createExerciseLog(form, selectedDate);
      setLogs((currentLogs) => [nextLog, ...currentLogs]);
    }

    setForm(createExerciseFormState());
    setError(null);
    setIsFormOpen(false);
  }

  function toggleCompleted(id: string) {
    setLogs((currentLogs) =>
      currentLogs.map((log) =>
        log.id === id ? { ...log, completed: !log.completed } : log
      )
    );
  }

  function handleFormChange(field: keyof ExerciseFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) {
      setError(null);
    }
  }

  function applyPreset(nextForm: ExerciseFormState) {
    setEditingLogId(null);
    setForm(nextForm);
    setError(null);
    setImportError(null);
    setFormFocusTrigger((current) => current + 1);
    setIsFormOpen(true);
  }

  function handleDateChange(date: string) {
    setSelectedDate(date);
    setVisibleMonth(monthString(date));
    setError(null);
    setImportError(null);
  }

  function handleEdit(id: string) {
    const targetLog = logs.find((log) => log.id === id);
    if (!targetLog) {
      return;
    }

    setEditingLogId(id);
    setSelectedDate(targetLog.date);
    setVisibleMonth(monthString(targetLog.date));
    setForm(createExerciseFormState(targetLog));
    setError(null);
    setImportError(null);
    setIsFormOpen(true);
    setFormFocusTrigger((current) => current + 1);
  }

  function handleDelete(id: string) {
    const targetLog = logs.find((log) => log.id === id);
    if (!targetLog) {
      return;
    }

    const shouldDelete = window.confirm(
      `確定要刪除「${targetLog.name}」這筆運動紀錄嗎？此操作無法復原。`
    );
    if (!shouldDelete) {
      return;
    }

    setLogs((currentLogs) => removeExerciseLog(currentLogs, id));

    if (editingLogId === id) {
      setEditingLogId(null);
      setForm(createExerciseFormState());
      setError(null);
    }
  }

  function handleCancelEdit() {
    setEditingLogId(null);
    setForm(createExerciseFormState());
    setError(null);
    setIsFormOpen(false);
  }

  function handleOpenCreate() {
    setEditingLogId(null);
    setForm(createExerciseFormState());
    setError(null);
    setImportError(null);
    setIsFormOpen(true);
    setFormFocusTrigger((current) => current + 1);
  }

  function handleCloseForm() {
    setEditingLogId(null);
    setForm(createExerciseFormState());
    setError(null);
    setIsFormOpen(false);
  }

  async function handleImport(file: File | null) {
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const importedLogs = importLogsFromText(text);
      setLogs(importedLogs);
      setEditingLogId(null);
      setForm(createExerciseFormState());
      setError(null);
      setImportError(null);
    } catch (importErrorValue) {
      setImportError(
        importErrorValue instanceof Error
          ? importErrorValue.message
          : '匯入失敗，請稍後再試。'
      );
    }
  }

  function handleExport() {
    downloadLogsBackup(logs);
    setImportError(null);
  }

  function handleClearSelectedDate() {
    if (filteredLogs.length === 0) {
      return;
    }

    const shouldClear = window.confirm(
      `確定要清空 ${selectedDate} 的全部運動紀錄嗎？此操作無法復原。`
    );
    if (!shouldClear) {
      return;
    }

    setLogs((currentLogs) => removeLogsByDate(currentLogs, selectedDate));

    if (editingLogId && filteredLogs.some((log) => log.id === editingLogId)) {
      setEditingLogId(null);
      setForm(createExerciseFormState());
      setError(null);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Weight Loss Planner Journal</p>
        <h1>減重計劃日誌</h1>
        <p className="hero-copy">
          用最小步驟記錄今天的運動、熱量消耗與完成狀態，先把持續性建立起來。
        </p>
      </section>

      <StatsPanel
        selectedDate={selectedDate}
        dateLabel={dateLabel}
        totalCalories={totalCalories}
        completedCount={completedCount}
        totalCount={filteredLogs.length}
        completionRate={completionRate}
      />

      {!hasAnyLogs ? (
        <GettingStarted onChoosePreset={() => applyPreset(quickExercisePresets[0].form)} />
      ) : null}

      <section className="dashboard-grid">
        <CalendarPanel
          selectedDate={selectedDate}
          visibleMonth={visibleMonth}
          logsCountByDate={logsCountByDate}
          onSelectDate={handleDateChange}
          onMoveMonth={(amount) => setVisibleMonth(shiftMonth(visibleMonth, amount))}
          onOpenCreate={handleOpenCreate}
        />

        <ExerciseList
          logs={filteredLogs}
          selectedDate={selectedDate}
          editingLogId={editingLogId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleCompleted={toggleCompleted}
        />
      </section>

      <BackupPanel
        selectedDate={selectedDate}
        hasLogs={hasAnyLogs}
        hasLogsForSelectedDate={filteredLogs.length > 0}
        importError={importError}
        onExport={handleExport}
        onImport={handleImport}
        onClearSelectedDate={handleClearSelectedDate}
      />

      {isFormOpen ? (
        <div className="modal-stack">
          <ExerciseForm
            form={form}
            error={error}
            selectedDate={selectedDate}
            isEditing={editingLogId !== null}
            focusTrigger={formFocusTrigger}
            onClose={handleCloseForm}
            onChange={handleFormChange}
            onApplyPreset={applyPreset}
            onCancelEdit={handleCancelEdit}
            onSubmit={handleSubmit}
          />
        </div>
      ) : null}
    </main>
  );
}

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import AuthPanel from './components/AuthPanel';
import BackupPanel from './components/BackupPanel';
import CalendarPanel from './components/CalendarPanel';
import ExerciseForm from './components/ExerciseForm';
import ExerciseList from './components/ExerciseList';
import GettingStarted from './components/GettingStarted';
import StatsPanel from './components/StatsPanel';
import { quickExercisePresets } from './data/presets';
import {
  createExerciseLogRemote,
  deleteExerciseLogRemote,
  deleteExerciseLogsByDateRemote,
  listExerciseLogs,
  subscribeExerciseLogs,
  updateExerciseLogRemote
} from './features/logs/supabaseLogs';
import type { ExerciseLogRow } from './features/logs/types';
import { supabase } from './lib/supabase';
import type { ExerciseFormState, ExerciseLog } from './types';
import {
  createExerciseFormState,
  filterLogsByDate,
  getCompletionRate,
  getCompletedCount,
  getTotalCalories,
  sortLogsForDisplay,
  validateExerciseForm
} from './utils/exercise';
import { formatDateLabel, monthString, shiftMonth, todayString } from './utils/date';
import { downloadLogsBackup, writeLogs } from './utils/storage';

function mapRowToExerciseLog(row: ExerciseLogRow): ExerciseLog {
  return {
    id: row.id,
    name: row.name,
    durationMinutes: row.duration_minutes,
    caloriesBurned: row.calories_burned,
    completed: row.completed,
    date: row.date
  };
}

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
  const [session, setSession] = useState<Session | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  async function refreshLogs() {
    const rows = await listExerciseLogs();
    setLogs(rows.map(mapRowToExerciseLog));
  }

  useEffect(() => {
    if (!supabase) {
      setAuthError('Supabase 尚未設定，請先確認 .env 內的 URL 與 anon key。');
      return;
    }

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (sessionError) {
        setAuthError(sessionError.message);
        return;
      }

      setSession(data.session);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    writeLogs(logs);
  }, [logs]);

  useEffect(() => {
    if (!session) {
      setLogs([]);
      return;
    }

    let ignore = false;

    void listExerciseLogs()
      .then((rows: ExerciseLogRow[]) => {
        if (!ignore) {
          setLogs(rows.map(mapRowToExerciseLog));
        }
      })
      .catch((loadError: unknown) => {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : '載入雲端資料失敗。');
        }
      });

    const unsubscribe = subscribeExerciseLogs(() => {
      void listExerciseLogs().then((rows: ExerciseLogRow[]) => {
        if (!ignore) {
          setLogs(rows.map(mapRowToExerciseLog));
        }
      });
    });

    return () => {
      ignore = true;
      unsubscribe();
    };
  }, [session]);

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateExerciseForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!session) {
      setError('請先登入後再新增或修改運動紀錄。');
      return;
    }

    try {
      if (editingLogId) {
        await updateExerciseLogRemote(editingLogId, {
          name: form.name.trim(),
          duration_minutes: Number(form.durationMinutes),
          calories_burned: Number(form.caloriesBurned),
          date: selectedDate
        });
        setEditingLogId(null);
      } else {
        await createExerciseLogRemote({
          user_id: session.user.id,
          name: form.name.trim(),
          duration_minutes: Number(form.durationMinutes),
          calories_burned: Number(form.caloriesBurned),
          completed: false,
          date: selectedDate
        });
      }

      await refreshLogs();
      setForm(createExerciseFormState());
      setError(null);
      setIsFormOpen(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '儲存雲端資料失敗。');
    }
  }

  async function toggleCompleted(id: string) {
    const target = logs.find((log) => log.id === id);
    if (!target) {
      return;
    }

    try {
      await updateExerciseLogRemote(id, { completed: !target.completed });
      await refreshLogs();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : '更新完成狀態失敗。');
    }
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

  async function handleDelete(id: string) {
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

    try {
      await deleteExerciseLogRemote(id);
      await refreshLogs();

      if (editingLogId === id) {
        setEditingLogId(null);
        setForm(createExerciseFormState());
        setError(null);
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '刪除雲端資料失敗。');
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

  function handleExport() {
    downloadLogsBackup(logs);
    setImportError(null);
  }

  async function handleClearSelectedDate() {
    if (filteredLogs.length === 0) {
      return;
    }

    const shouldClear = window.confirm(
      `確定要清空 ${selectedDate} 的全部運動紀錄嗎？此操作無法復原。`
    );
    if (!shouldClear) {
      return;
    }

    try {
      await deleteExerciseLogsByDateRemote(selectedDate);
      await refreshLogs();

      if (editingLogId && filteredLogs.some((log) => log.id === editingLogId)) {
        setEditingLogId(null);
        setForm(createExerciseFormState());
        setError(null);
      }
    } catch (clearError) {
      setError(clearError instanceof Error ? clearError.message : '清空當日資料失敗。');
    }
  }

  async function handleRequestOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setAuthError('Supabase 尚未設定。');
      return;
    }

    try {
      setIsSendingCode(true);
      setAuthError(null);
      setAuthMessage(null);
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: authEmail,
        options: {
          shouldCreateUser: true
        }
      });

      if (signInError) {
        throw signInError;
      }

      setIsOtpSent(true);
      setAuthOtp('');
      setAuthMessage('驗證碼已寄出，請回到 App 輸入 8 碼驗證碼。');
    } catch (submitError) {
      setAuthError(submitError instanceof Error ? submitError.message : '寄送驗證碼失敗。');
    } finally {
      setIsSendingCode(false);
    }
  }

  async function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setAuthError('Supabase 尚未設定。');
      return;
    }

    try {
      setIsVerifyingCode(true);
      setAuthError(null);
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: authEmail,
        token: authOtp,
        type: 'email'
      });

      if (verifyError) {
        throw verifyError;
      }

      setAuthMessage('登入成功。');
      setIsOtpSent(false);
      setAuthOtp('');
    } catch (submitError) {
      setAuthError(submitError instanceof Error ? submitError.message : '驗證碼登入失敗。');
    } finally {
      setIsVerifyingCode(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setLogs([]);
    setSession(null);
    setAuthMessage(null);
    setAuthOtp('');
    setIsOtpSent(false);
  }

  function handleResetOtp() {
    setIsOtpSent(false);
    setAuthOtp('');
    setAuthMessage(null);
    setAuthError(null);
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">Weight Loss Planner Journal</p>
        <h1>減重計劃日誌</h1>
        <p className="hero-copy">
          用最小步驟記錄今天的運動、熱量消耗與完成狀態，並透過登入後的雲端資料完成跨裝置同步。
        </p>
        {session ? (
          <div className="session-bar">
            <span>{session.user.email}</span>
            <button type="button" className="secondary-button" onClick={handleSignOut}>
              登出
            </button>
          </div>
        ) : null}
      </section>

      {!session ? (
        <AuthPanel
          email={authEmail}
          otp={authOtp}
          message={authMessage}
          error={authError}
          isSendingCode={isSendingCode}
          isVerifyingCode={isVerifyingCode}
          isOtpSent={isOtpSent}
          onEmailChange={setAuthEmail}
          onOtpChange={setAuthOtp}
          onRequestOtp={handleRequestOtp}
          onVerifyOtp={handleVerifyOtp}
          onResetOtp={handleResetOtp}
        />
      ) : null}

      <StatsPanel
        selectedDate={selectedDate}
        dateLabel={dateLabel}
        totalCalories={totalCalories}
        completedCount={completedCount}
        totalCount={filteredLogs.length}
        completionRate={completionRate}
      />

      {session && !hasAnyLogs ? (
        <GettingStarted onChoosePreset={() => applyPreset(quickExercisePresets[0].form)} />
      ) : null}

      {session ? (
        <>
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
            onClearSelectedDate={handleClearSelectedDate}
          />
        </>
      ) : null}

      {session && isFormOpen ? (
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

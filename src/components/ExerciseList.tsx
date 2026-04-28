import type { ExerciseLog } from '../types';

type ExerciseListProps = {
  logs: ExerciseLog[];
  selectedDate: string;
  editingLogId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleCompleted: (id: string) => void;
};

export default function ExerciseList({
  logs,
  selectedDate,
  editingLogId,
  onEdit,
  onDelete,
  onToggleCompleted
}: ExerciseListProps) {
  return (
    <section className="panel list-panel">
      <div className="panel-heading">
        <h2>運動清單</h2>
        <p>{selectedDate} 的所有運動紀錄與完成狀態。</p>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">
          <p>這一天還沒有運動紀錄。</p>
          <p>先新增第一筆，或切換到其他日期查看既有資料。</p>
        </div>
      ) : (
        <ul className="log-list">
          {logs.map((log) => (
            <li
              key={log.id}
              className={[
                'log-card',
                log.completed ? 'completed' : '',
                editingLogId === log.id ? 'editing' : ''
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div>
                <p className="log-name">{log.name}</p>
                <p className="log-meta">
                  {log.durationMinutes} 分鐘 · {log.caloriesBurned} kcal
                </p>
              </div>
              <div className="log-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onToggleCompleted(log.id)}
                >
                  {log.completed ? '標記為未完成' : '標記為已完成'}
                </button>
                <button type="button" className="secondary-button" onClick={() => onEdit(log.id)}>
                  編輯
                </button>
                <button type="button" className="danger-button" onClick={() => onDelete(log.id)}>
                  刪除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

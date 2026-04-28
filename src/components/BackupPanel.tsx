type BackupPanelProps = {
  selectedDate: string;
  hasLogs: boolean;
  hasLogsForSelectedDate: boolean;
  importError: string | null;
  onExport: () => void;
  onClearSelectedDate: () => void;
};

export default function BackupPanel({
  selectedDate,
  hasLogs,
  hasLogsForSelectedDate,
  importError,
  onExport,
  onClearSelectedDate
}: BackupPanelProps) {
  return (
    <section className="panel backup-panel">
      <div className="panel-heading compact-heading">
        <h2>備份與整理</h2>
        <p>匯出目前雲端資料，或清空 {selectedDate} 這一天的紀錄。</p>
      </div>

      <div className="backup-actions">
        <button type="button" className="secondary-button" onClick={onExport} disabled={!hasLogs}>
          匯出全部紀錄
        </button>
        <button
          type="button"
          className="danger-button"
          onClick={onClearSelectedDate}
          disabled={!hasLogsForSelectedDate}
        >
          清空當日紀錄
        </button>
      </div>

      {importError ? <p className="error-text">{importError}</p> : null}
      <p className="backup-note">雲端同步版暫不提供直接匯入覆蓋，避免誤覆寫遠端資料。</p>
    </section>
  );
}

type BackupPanelProps = {
  selectedDate: string;
  hasLogs: boolean;
  hasLogsForSelectedDate: boolean;
  importError: string | null;
  onExport: () => void;
  onImport: (file: File | null) => void;
  onClearSelectedDate: () => void;
};

export default function BackupPanel({
  selectedDate,
  hasLogs,
  hasLogsForSelectedDate,
  importError,
  onExport,
  onImport,
  onClearSelectedDate
}: BackupPanelProps) {
  return (
    <section className="panel backup-panel">
      <div className="panel-heading compact-heading">
        <h2>備份與整理</h2>
        <p>匯出全部資料、匯入舊備份，或清空 {selectedDate} 這一天的紀錄。</p>
      </div>

      <div className="backup-actions">
        <button type="button" className="secondary-button" onClick={onExport} disabled={!hasLogs}>
          匯出全部紀錄
        </button>
        <label className="file-button">
          <span>匯入備份檔</span>
          <input
            type="file"
            accept="application/json"
            onChange={(event) => onImport(event.target.files?.[0] ?? null)}
          />
        </label>
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
    </section>
  );
}

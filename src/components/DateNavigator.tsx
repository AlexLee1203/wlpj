type DateNavigatorProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onMoveDate: (days: number) => void;
};

export default function DateNavigator({
  selectedDate,
  onDateChange,
  onMoveDate
}: DateNavigatorProps) {
  return (
    <section className="panel date-panel">
      <div className="panel-heading compact-heading">
        <h2>切換日期</h2>
        <p>檢查過去紀錄，或先安排之後要完成的運動。</p>
      </div>

      <div className="date-controls">
        <button type="button" className="secondary-button" onClick={() => onMoveDate(-1)}>
          前一天
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
        />
        <button type="button" className="secondary-button" onClick={() => onMoveDate(1)}>
          後一天
        </button>
      </div>
    </section>
  );
}

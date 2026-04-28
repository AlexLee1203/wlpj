type StatsPanelProps = {
  selectedDate: string;
  dateLabel: string;
  totalCalories: number;
  completedCount: number;
  totalCount: number;
  completionRate: number;
};

export default function StatsPanel({
  selectedDate,
  dateLabel,
  totalCalories,
  completedCount,
  totalCount,
  completionRate
}: StatsPanelProps) {
  return (
    <section className="panel stats-panel">
      <div>
        <p className="stat-label">選擇日期</p>
        <p className="stat-value">{selectedDate}</p>
        <p className="stat-subvalue">{dateLabel}</p>
      </div>
      <div>
        <p className="stat-label">當日總熱量</p>
        <p className="stat-value">{totalCalories} kcal</p>
      </div>
      <div>
        <p className="stat-label">完成項目</p>
        <p className="stat-value">
          {completedCount} / {totalCount}
        </p>
        <p className="stat-subvalue">完成率 {completionRate}%</p>
      </div>
    </section>
  );
}

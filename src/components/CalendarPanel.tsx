import { formatMonthLabel, getMonthCalendarDays } from '../utils/date';

type CalendarPanelProps = {
  selectedDate: string;
  visibleMonth: string;
  logsCountByDate: Record<string, number>;
  onSelectDate: (date: string) => void;
  onMoveMonth: (amount: number) => void;
  onOpenCreate: () => void;
};

const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

export default function CalendarPanel({
  selectedDate,
  visibleMonth,
  logsCountByDate,
  onSelectDate,
  onMoveMonth,
  onOpenCreate
}: CalendarPanelProps) {
  const days = getMonthCalendarDays(visibleMonth);

  return (
    <section className="panel calendar-panel">
      <div className="calendar-header">
        <div>
          <p className="calendar-eyebrow">Calendar</p>
          <h2>{formatMonthLabel(visibleMonth)}</h2>
        </div>
        <div className="calendar-header-actions">
          <button type="button" className="secondary-button" onClick={() => onMoveMonth(-1)}>
            上個月
          </button>
          <button type="button" className="secondary-button" onClick={() => onMoveMonth(1)}>
            下個月
          </button>
          <button type="button" onClick={onOpenCreate}>
            新增運動紀錄
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day) => {
          const count = logsCountByDate[day.date] ?? 0;
          const isSelected = day.date === selectedDate;

          return (
            <button
              key={day.date}
              type="button"
              className={[
                'calendar-day',
                day.inCurrentMonth ? 'current-month' : 'other-month',
                isSelected ? 'selected' : '',
                count > 0 ? 'has-logs' : ''
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate(day.date)}
            >
              <span className="calendar-day-number">{day.day}</span>
              <span className="calendar-day-meta">
                {count > 0 ? `${count} 筆` : '\u00a0'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function parseMonth(month: string) {
  const [year, monthValue] = month.split('-').map(Number);
  return new Date(year, monthValue - 1, 1);
}

function formatMonth(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function todayString() {
  return formatLocalDate(new Date());
}

export function shiftDate(date: string, days: number) {
  const nextDate = parseLocalDate(date);
  nextDate.setDate(nextDate.getDate() + days);
  return formatLocalDate(nextDate);
}

export function formatDateLabel(date: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  }).format(parseLocalDate(date));
}

export function monthString(date: string) {
  return date.slice(0, 7);
}

export function shiftMonth(month: string, amount: number) {
  const nextMonth = parseMonth(month);
  nextMonth.setMonth(nextMonth.getMonth() + amount);
  return formatMonth(nextMonth);
}

export function formatMonthLabel(month: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long'
  }).format(parseMonth(month));
}

export function getMonthCalendarDays(month: string) {
  const firstDay = parseMonth(month);
  const startWeekday = firstDay.getDay();
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - startWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + index);

    return {
      date: formatLocalDate(current),
      day: current.getDate(),
      inCurrentMonth: current.getMonth() === firstDay.getMonth()
    };
  });
}

export interface YearMonth {
  year: number;
  /** 1 = January, 12 = December */
  month: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const toMonthIndex = ({ year, month }: YearMonth) => year * 12 + (month - 1);

export const currentYearMonth = (): YearMonth => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

export const formatYearMonth = ({ year, month }: YearMonth) => `${MONTHS[month - 1]} ${year}`;

/** Whole years elapsed since `start`, so "7+ years" stays correct as time passes. */
export const yearsSince = (start: YearMonth) =>
  Math.floor((toMonthIndex(currentYearMonth()) - toMonthIndex(start)) / 12);

/** Inclusive month count between two dates, the way LinkedIn shows tenure. */
export const monthsBetween = (start: YearMonth, end: YearMonth = currentYearMonth()) =>
  toMonthIndex(end) - toMonthIndex(start) + 1;

export const formatDuration = (months: number) => {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rest) parts.push(`${rest} mo${rest > 1 ? "s" : ""}`);
  return parts.join(" ");
};

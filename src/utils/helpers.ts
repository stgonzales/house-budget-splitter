export function formatPounds(value: number): string {
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  return formatter.format(value);
}

export function formatDay(value: number): string {
  switch (true) {
    case value === 1 || value === 11 || value === 21 || value === 31:
      return `${value}st`;
    case value === 2 || value === 12 || value === 22 || value === 32:
      return `${value}nd`;
    default:
      return `${value}th`;
  }
}

export function formatMonthAndYear(year: number, monthIdx: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthIdx));
}

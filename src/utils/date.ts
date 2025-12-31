const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const parseDate = (value: string) => {
  if (value.includes(".")) {
    const [day, month, year] = value.split(".");
    return Date.parse(`${year}-${month}-${day}T00:00:00`);
  }

  return Date.parse(value);
};

export const formatDate = (value?: string, fallback = "") => {
  if (!value) {
    return fallback;
  }

  const parsed = parseDate(value);
  if (Number.isNaN(parsed)) {
    return fallback || value;
  }

  return dateFormatter.format(new Date(parsed));
};

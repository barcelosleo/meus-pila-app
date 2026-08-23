export const formatDateTime = (value: string | Date | null | undefined) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { date: value.toString(), time: "" };

  const datePart = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return { date: datePart, time: timePart };
};

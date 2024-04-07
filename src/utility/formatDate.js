export const formatDate = (date) => {
  date = new Date(date);
  const options = {
    year: "2-digit",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

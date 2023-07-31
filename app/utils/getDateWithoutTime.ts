export const getDateWithoutTime = (date: Date) => {
  return new Date(date.toISOString().slice(0, 10));
};

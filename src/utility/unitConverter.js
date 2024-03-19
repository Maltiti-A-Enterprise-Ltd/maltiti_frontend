export const convertGramUnits = (gramUnit) => {
  if (parseInt(gramUnit, 10) < 1000) {
    return `${gramUnit}g`;
  }
  const inKilograms = parseInt(gramUnit, 10) / 1000;
  const roundedNumber =
    inKilograms % 1 === 0 ? inKilograms.toFixed(0) : inKilograms.toFixed(1);

  return `${roundedNumber}kg`;
};

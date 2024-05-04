export const orderStatusProgress = (status) => {
  switch (status) {
    case "review":
      return 25;
    case "packaging":
      return 50;
    case "delivery in progres":
      return 75;
    case "delivered":
      return 100;
    default:
      return 0;
  }
};

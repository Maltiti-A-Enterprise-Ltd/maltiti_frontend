export const productsReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return action.payload;
    case "UPDATE_PRODUCTS":
      return [...state, action.payload];
    case "DELETE_PRODUCT":
      const { id } = action.payload;
      return state.filter((product) => product.id !== id);
    default:
      return state;
  }
};

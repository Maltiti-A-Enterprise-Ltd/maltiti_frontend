export const productsReducer = (state=[], action) => {
    switch(action.type){
        case 'SET_PRODUCTS':
            return action.payload
        case 'UPDATE_PRODUCTS':
            return state
        default:
            return state
    }
}
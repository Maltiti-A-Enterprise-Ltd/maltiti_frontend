export const authReducer = (state={}, action) => {
    switch(action.type){
        case 'SET_AUTH':
            return action.payload
        case 'UNSET_AUTH':
            return ""
        default:
            return state
    }
}
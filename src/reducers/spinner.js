const spinnerReducer = (state = false, action) => {
    switch(action.type){
        case 'LOAD':
            return true
        case 'UNLOAD':
            return false
        default:
            return state
    }
}

export default spinnerReducer;
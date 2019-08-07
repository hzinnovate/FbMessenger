
const reducer = (state = {}, action) => {
    switch(action.type){
        case 'UPDATE_USER' : {
            return {...state, user: action.user}
        }
        case 'REMOVE_USER' : {
            return {...state, user: null}
        }
        case 'CHAT_OBJ' : {
            return {...state, chatRoomObj: action.chatRoomObj}
        }
        case 'REMOVE_CHAT_OBJ' : {
            return {...state, chatRoomObj: null}
        }
        case 'MESSAGES' : {
            return {...state, messages: action.messages}
        }
        case 'REMOVE_MESSAGES': {
            return {...state, messages: null}
        }
        case 'GET_All_USERS' : {
            return {...state, allUsers: action.allUsers}
        }
        case 'REMOVE_ALL_USERS' : {
            return {...state, allUsers: null}
        }
        case 'STORIES' : {
            return {...state, stories: action.stories}
        }
        case 'REMOVE_STORIES': {
            return {...state, stories: null}
        }
        default: {
            return state
        }
    }
}

export default reducer
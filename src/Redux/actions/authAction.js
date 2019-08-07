import firebase from '../../Config/firebase';
import 'firebase/firestore';
const db = firebase.firestore()

const getAllUsers = (myUid) => {
    return (dispatch, getState) => {
        db.collection('users').onSnapshot(function (querySnapshot) {
            const allUsers = []
            querySnapshot.forEach(function (doc) {
                if (doc.data().uid !== myUid) {
                    allUsers.push(doc.data());
                }
            })
            dispatch({ type: 'GET_All_USERS', allUsers })
        })
    }
}
const removeAllUsers = () => {
    return {
        type: 'REMOVE_ALL_USERS',
        allUsers: null
    }
}
const updateuser = (user) => {
    return {
        type: 'UPDATE_USER',
        user
    }
}

const removeUser = () => {
    return {
        type: 'REMOVE_USER',
        user: null
    }
}
const objForChat = (chatRoomObj) => {
    return {
        type: 'CHAT_OBJ',
        chatRoomObj
    }
}
const removeObjForChat = () => {
    return {
        type: 'REMOVE_CHAT_OBJ',
        chatRoomObj: null
    }
}
const chatMessages = () => {
    return (dispatch, getState) => {
        const roomId = getState().reducer.chatRoomObj.chatRoom.roomId
        db.collection('chatrooms').doc(roomId).collection('messages')
            .orderBy('timeStamp')
            .onSnapshot(snapshot => {
                const messages = []
                snapshot.forEach(elem => {
                    messages.push({ data: elem.data(), _id: elem.id })
                })
                dispatch({ type: 'MESSAGES', messages })
            })
    }
}
const removeMessages = () => {
    return {
        type: 'REMOVE_MESSAGES',
        messages: null
    }
}
export {
    updateuser,
    removeUser,
    objForChat,
    removeObjForChat,
    getAllUsers,
    chatMessages,
    removeAllUsers,
    removeMessages
}
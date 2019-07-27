import firebase from '../../Config/firebase';
import 'firebase/firestore';

const db = firebase.firestore();

const auth = firebase.auth();

function loginAccount(email, password) {
    return new Promise((resolve, reject) => {
        auth.signInWithEmailAndPassword(email, password).then(e => {
            db.collection("users").doc(e.user.uid).get().then(function (doc) {
                if (doc.exists) {
                    const obj = doc.data();
                    const data = {
                        createdAt: obj.createdAt,
                        email: obj.email,
                        uid: doc.id
                    }
                    resolve(data)
                }
            }).catch(function (e) {
                reject(e)
            })
        }).catch((e) => {
            reject(e)
        })
    })
}

function register(email, password) {
    return new Promise((resolve, reject) => {
        auth.createUserWithEmailAndPassword(email, password).then(user => {
            console.log(user.user.uid)
            db.collection("users").doc(user.user.uid).set({ email, createdAt: Date.now(), uid: user.user.uid}).then(() => {
                resolve({ message: "Registration successfully" })
            })
                .catch((e) => {
                    reject(e)
                })
        })
            .catch((e) => {
                reject(e)
            })
    })
}
function createRoom(friendId, myId){
    let chatExists = false;
    return new Promise((resolve, reject)=>{
        db.collection('chatrooms')
        .where('users.' + myId, '==', true)
        .where('users.' + friendId, '==', true).get().then(snapshot =>{
            snapshot.forEach(elem =>{
                chatExists = {data: elem.data(), roomId: elem.id};
            })
            if(!chatExists){
                const obj = {
                    createdAt: Date.now(),
                    users: {
                        [friendId]: true,
                        [myId]: true
                    }
                }
                db.collection('chatrooms').add(obj).then(snapshot => {
                    resolve({data: obj, roomId: snapshot.id})
                })
            }else{
                resolve(chatExists);
            }
        })
    })
}

function sendMessageToDb(roomId, message, myId){
    const obj = {
        message,
        userId: myId,
        timeStamp: Date.now()
    }
    return db.collection('chatrooms').doc(roomId).collection('messages').add(obj)
}

export {
    loginAccount,
    register,
    createRoom,
    sendMessageToDb
}
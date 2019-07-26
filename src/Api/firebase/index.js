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
            db.collection("users").doc(user.user.uid).set({ email, createdAt: Date.now() }).then(() => {
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

export {
    loginAccount,
    register
}
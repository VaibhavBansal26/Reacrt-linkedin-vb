import firebase from 'firebase';


const firebaseConfig = {
    apiKey: "AIzaSyB2ZlDXkOoKwB_siGhb41TQfiyCy4cfRN4",
    authDomain: "react-linkedin-vb.firebaseapp.com",
    projectId: "react-linkedin-vb",
    storageBucket: "react-linkedin-vb.appspot.com",
    messagingSenderId: "1051316885712",
    appId: "1:1051316885712:web:6ba6f83f3768cd2b0d26d5"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export {auth, provider, storage};
export default db;
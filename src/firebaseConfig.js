// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const SUCCESS = "success";
const ERROR = "error";
let CONFIGS = {};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
await fetch(
    "https://expirytracker-brain.onrender.com/api/secret/firebase-config"
)
    .then((response) => response.json())
    .then((firebaseConfig) => {
        // Use the retrieved Firebase API keys in your client-side code
        CONFIGS = firebaseConfig;
    })
    .catch((error) => {
        console.error("Error retrieving Firebase config:", error);
    });

function createUser(
    email,
    password,
    successCallback,
    errorCallback,
    saveUserToMongoCallback
) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            saveUserToMongoCallback(email, userCredential.user.uid); // Call the callback function to save user details to MongoDB
            successCallback(); // Call the success callback
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            errorCallback(error); // Call the error callback with the error object
        });
}

function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // console.log(user);
            return SUCCESS;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorCode + " : " + errorMessage);
            return ERROR;
        });
}

function googleAuth() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            // console.log(credential);
            return SUCCESS;
        })
        .catch((error) => {
            console.log(error);
            alert(error);
            return ERROR;
            // ...
        });
}

function logout() {
    return auth.signOut();
}

// Initialize Firebase
const app = initializeApp(CONFIGS);
const auth = getAuth(app);
const user = auth.currentUser;
const provider = new GoogleAuthProvider();
export { app, auth, user, createUser, googleAuth, loginUser, logout };

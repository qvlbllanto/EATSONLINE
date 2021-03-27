import firebase from "firebase/app";
import "firebase/storage"
import "firebase/database"
const firebaseConfig = {
    apiKey: "AIzaSyBfkFyNQYT9SsjFj-6AFksfZCL8s76wF-g",
    authDomain: "vinpyserver.firebaseapp.com",
    projectId: "vinpyserver",
    storageBucket: "vinpyserver.appspot.com",
    messagingSenderId: "874714813466",
    appId: "1:874714813466:web:101b77b7934ffaab1eada3",
    measurementId: "G-EPMRDVP18Y"
  };

  firebase.initializeApp(firebaseConfig);
  const data = firebase.database();
  const storage = firebase.storage();
  
  export {data, storage, firebase as default};
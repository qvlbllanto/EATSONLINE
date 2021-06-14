import firebase from "firebase/app";
import "firebase/storage"
import "firebase/database"

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIFIREKEY,
    authDomain: process.env.REACT_APP_AUTHFIREDOMAIN,
    databaseURL:process.env.REACT_APP_DBURLFIRE,
    projectId: process.env.REACT_APP_PROJFIREID,
    storageBucket: process.env.REACT_APP_STORFIREBUCK,
    messagingSenderId: process.env.REACT_APP_MESSAGEFIRESENDID,
    appId: process.env.REACT_APP_APPFIREID,
    measurementId: process.env.REACT_APP_MEASUREMENTFIREID
  };
firebase.initializeApp(firebaseConfig);
const data = firebase.database();
const storage = firebase.storage();

export {data, storage, firebase as default};
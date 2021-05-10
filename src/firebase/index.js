import firebase from "firebase/app";
import "firebase/storage"
import "firebase/database"
firebase.initializeApp(JSON.parse(process.env.REACT_APP_CONFIG_FIRE));
const data = firebase.database();
const storage = firebase.storage();

export {data, storage, firebase as default};
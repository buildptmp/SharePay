import { initializeApp } from "firebase/app";
// import { getAuth } from 'firebase/auth';
import { 
  getFirestore, collection, getDocs, initializeFirestore, addDoc, setDoc, doc
} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyDGeiVvbQ_zNcXpbrXsGheivJSE5xAqrt0",
  authDomain: "sharepay-77c6c.firebaseapp.com",
  databaseURL: "https://sharepay-77c6c.firebaseio.com",
  projectId: "sharepay-77c6c",
  storageBucket: "sharepay-77c6c.appspot.com",
  messagingSenderId: "G-9ME2LJGL9Q",
  appId: "1:927888254427:android:bc2b3ddb87e075072e33fe"
};

const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore();
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
const colRefUser = collection(db, 'User')
// const colRefTestUsers = collection(db, 'Test-Users')

export function getfromUsers(){
  getDocs(colRefUser)
  .then((snapshot) => {
    let users = []
    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id })
    })
    console.log(users)
  })
  .catch(err => {
    console.log(err.message)
  })
}

export function addUser(uid) {
  // WIP
  const _data = {
    bio: 'New User'
  }
  setDoc(doc(db, 'Test-Users', uid), _data);
}

export function addtoUsers(){
  const data = {
    Password: 'demo2',
    Phonenumber: '800',
    UserID: 3,
    User_image: 'URL',
    Username: 'demo2'
  };
  
  addDoc(colRefUser, data)
    .then(docRef => { //create docRef
        console.log(dbRef.id);
    })
    .catch(error => {
        console.log(error);
    })

}
  
export default colRefUser

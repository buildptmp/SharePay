import { initializeApp } from "firebase/app";
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

  export default app;
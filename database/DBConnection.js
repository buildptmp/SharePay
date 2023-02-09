import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  initializeFirestore, 
  doc, 
  getDoc,
  getDocs, 
  addDoc, 
  setDoc, 
  updateDoc,
  query,
  where
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
// const db = getFirestore();
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
// const colRefUser = collection(db, 'User')
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

/* User management*/

export function addUser(uid, phoneNum) {
  // WIP
  const _data = {
    bio: 'New User',
    phoneNum: phoneNum
  };
  setDoc(doc(db, 'Test-Users', uid), _data)
  .catch(error => {
    console.log(error);
})
}
export function updateUser(uid, name, image, bio="") {
  let _data = {
    name : name,
    image : image
  }
  if(bio){
    _data.bio = bio
  }
  console.log(_data)
  if(Object.keys(_data).length > 0){updateDoc(doc(db, 'Test-Users', uid), _data)
  .catch(error => {console.log(error);})}
}
export async function getUserFromPhoneNum(phoneNum){
  const colRef = collection(db,'Test-Users');
  const q = query(colRef,where("phoneNum","==","+66"+phoneNum.slice(1, 10)));

  const docsSnap = await getDocs(q);
  let debtorids = [];
  docsSnap.forEach(doc => {
    debtorids.push({ uid: doc.id, ...doc.data()})
  })
  // console.log(debtorids);
  return debtorids;
}

/* Group management*/

export const invStatus = {
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined',
  cancelled: 'cancelled',
}
export async function addGroup(name, image, description="" ){
  const colRef = collection(db, 'Test-Groups');
  let _data={
    name: name, 
    image: image
  };
  if(desription){
    _data.description = description;
  }
  const groupid = await addDoc(colRef, _data)
  .then(docRef => {
    console.log("The group id "+docRef.id+" has been added successfully");
    return docRef.id;
  })
  .catch(error => {
    console.log(error);
  })

  return groupid
}
export async function getGroupListByUid(uid){
  const UserGroupRef = collection(db, 'Test-UserGroup');
  const q = query(UserGroupRef,where("uid","==",uid));

  const docsSnap = await getDocs(q);
  let gidList = [];
  docsSnap.forEach( doc => {
    gidList.push({...doc.data()}.gid)
  })

  let groupList = [];
  for(let gid of gidList){
    let group = await getDoc(doc(db,'Test-Groups',gid))
    groupList.push({gid:group.id, ...group.data()})
  }

  return groupList;
}

/* User and Group */

export function addEditGroupMember(gid,uid,status){
  setDoc(doc(db,'Test-UserGroup','('+gid+','+uid+')'),{uid: uid,gid:gid, status: status}).catch(error => {console.log(error)});
}
export async function isInGroup(gid,uid){
  const check = await getDoc(doc(db,'Test-UserGroup','('+gid+','+uid+')'))
  console.log({isInGroup:{...check.data()}.status == "accepted", status: {...check.data()}.status})
  return {isInGroup:({...check.data()}.status == "accepted"), status: {...check.data()}.status}
}
export async function getMemberListByGid(gid){
  const UserGroupRef = collection(db, 'Test-UserGroup');
  const q = query(UserGroupRef,where("gid","==",gid));

  const docsSnap = await getDocs(q);
  let uidList = [];
  docsSnap.forEach( doc => {
    uidList.push({...doc.data()}.uid);
  })

  let memberList = [];
  for(let uid of uidList){
    let member = await getDoc(doc(db,'Test-Groups',uid));
    memberList.push({uid:member.id, ...member.data()});
  }

  return memberList;
}

/* Expense management*/ 

export async function addExpense(name, image, price, description=""){
  let _data = {
    name: name,
    image: image,
    "price (Baht)": price
  }
  if(description){
    _data.description = description
  }

  const eid = await addDoc(collection(db,'Test-Items'),_data)
  .then(docRef => {
    console.log("The expense item id "+docRef.id+" has been added successfully");
    return docRef.id;
  }).catch(error => {console.log(error)})
  
  return eid
}
export async function getExpenseListByGid(gid){
  const ItemRef = collection(db,'Test-Items',gid);
  const q = query(ItemRef,where("gid","==",gid));

  const docsnap = await getDocs(q);
  let expenseList = [];
  docsnap.forEach( doc => {
    expenseList.push({eid:doc.id, ...doc.data()})
  })

  return expenseList
}
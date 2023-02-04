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
export const inviteStatus = {
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined',
  cancelled: 'cancelled',
}
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
export function updateUser(uid, displayName, userImage, bio?) {
  let _data = {
    name : displayName,
    userImage : userImage
  }
  if(bio){
    _data.bio = bio
  }
  console.log(_data)
  if(Object.keys(_data).length > 0){updateDoc(doc(db, 'Test-Users', uid), _data)
  .catch(error => {console.log(error);})}
}
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
export async function addGroup(GroupName, photoURL, GroupDesc? ){
  const colRef = collection(db, 'Test-Groups');
  let _data={
    name: GroupName, 
    photoURL: photoURL
  };
  if(GroupDesc){
    _data.desription = GroupDesc;
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
export async function getUserFromPhoneNum(phoneNum: String){
  const colRef = collection(db,'Test-Users');
  const q = query(colRef,where("phoneNum","==","+66"+phoneNum.slice(1, 10)));

  const docsSnap = await getDocs(q);
  let debtorids = [];
  docsSnap.forEach(doc => {
    debtorids.push({ uid: doc.id, ...doc.data()})
  })
  console.log(debtorids);
  return debtorids;
}
export async function getGroupListByUid(uid){
  const UserGroupRef = collection(db, 'Test-UserGroup');
  const GroupsRef = collection(db, 'Test-Groups');
  const q = query(UserGroupRef,where("uid","==",uid));

  const docsSnap = await getDocs(q);
  let gidList = [];
  // const getGroup = async (gid) => {
  //   const group = await getDoc(doc(db,'Test-Groups',gid))
  //   return group
  // }
  docsSnap.forEach( doc => {
    // let group = await getGroup({...doc.data()}.gid)
    // console.log({ gid: group.id, ...group.data()})
    // docs.push({ gid: group.id, ...group.data()})
    gidList.push({...doc.data()}.gid)
  })
  let groupList = [];
  for(let gid of gidList){
    let group = await getDoc(doc(db,'Test-Groups',gid))

    groupList.push({gid:group.id, ...group.data()})
  }
  return groupList;
}
export class Group {
  gid: String;
  name: String;
  desc: String | null;
  url: String;

  invStatus = {
    pending: 'pending',
    accepted: 'accepted',
    declined: 'declined',
    cancelled: 'cancelled',
  }
  
  constructor(groupId,groupName,groupURL, groupDesc, uid){
    this.gid = groupId;
    this.name = groupName;
    this.url = groupURL;
    this.desc = groupDesc;
    // console.log(this.invStatus.accepted)
    this.addGroupMember(uid,this.invStatus["accepted"])
  }

  setGroupInfo(groupName: String, groupURL: String, groupDesc=""){
    this.groupName = groupName;
    this.groupURL = groupURL;
    this.groupDesc = groupDesc;
    updateDoc(doc(db,'Test-Groups',this.gid),{name:this.name, groupImage:this.url, description: this.desc}).catch(error => {console.log(error)});
  }

  addGroupMember(uid:String,invStatus:String){
    setDoc(doc(db,'Test-UserGroup','('+this.gid+','+uid+')'),{uid: uid,gid:this.gid, status: invStatus}).catch(error => {console.log(error)});
  }
}

import app from './FirebaseConfig'
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

// const db = getFirestore(app);
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

/* User management*/

export function addUser(uid, phoneNum) {
  // WIP
  const _data = {
    bio: 'New User',
    phoneNum: phoneNum
  };
  setDoc(doc(db, 'Test-Users', uid), _data).catch(err => {console.log(err.message)})
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
  .catch(err => {console.log(err.message)})}
}
export async function getUserFromPhoneNum(phoneNum){
  const colRef = collection(db,'Test-Users');
  const q = query(colRef,where("phoneNum","==","+66"+phoneNum.slice(1, 10)));
  
  try{
    const docsSnap = await getDocs(q);
    let member = [];
    docsSnap.forEach(doc => {
      member.push({ uid: doc.id, ...doc.data()})
    })

    return member;
    
  } catch (error){
    console.log(error);
  }

  // console.log(member);
  
}
export async function getUserFromUid(uid){
  const docRef = doc(db,'Test-Users',uid);
  
  try{
    const docsnap = await getDoc(docRef);
    const user = { uid: docsnap.id, ...docsnap.data()}
    return user;
  } catch (error){
    console.log(error);
  }
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
  }).catch(err => {console.log(err.message)})

  return groupid
}
export async function getGroupListByUid(uid){
  const UserGroupRef = collection(db, 'Test-UserGroup');
  const q = query(UserGroupRef,where("uid","==",uid));
  try {
    const docsSnap = await getDocs(q);
    let gidList = [];
    docsSnap.forEach( doc => {
      gidList.push({...doc.data()}.gid)
    })

    let groupList = [];
    for(let gid of gidList){
      let group = await getDoc(doc(db,'Test-Groups',gid)).catch(err => {console.log(err.message)})
      groupList.push({gid:group.id, ...group.data()})
    }

    return groupList;

  } catch (error){
    console.log(error);
  }
}

/* User and Group */

export function addEditGroupMember(gid,uid,status){
  setDoc(doc(db,'Test-UserGroup','('+gid+','+uid+')'),{uid: uid,gid:gid, status: status}).catch(err => {console.log(err.message)})
}
export async function isInGroup(gid,uid){
  const check = await getDoc(doc(db,'Test-UserGroup','('+gid+','+uid+')')).catch(err => {console.log(err.message)})
  // console.log({isInGroup:{...check.data()}.status == "accepted", status: {...check.data()}.status})
  return {isInGroup:({...check.data()}.status == "accepted"), status: {...check.data()}.status}
}
export async function getMemberListByGid(gid){
  const UserGroupRef = collection(db, 'Test-UserGroup');
  const q = query(UserGroupRef,where("gid","==",gid), where("status", "==", "accepted"));

  try {
    const docsSnap = await getDocs(q);
    let uidList = [];
    docsSnap.forEach( doc => {
      uidList.push({...doc.data()}.uid);
    })

    let memberList = [];
    for(let uid of uidList){
      let member = await getDoc(doc(db,'Test-Users',uid)).catch(err => {console.log(err.message)})
      memberList.push({uid:member.id, ...member.data()});
    }

    return memberList;

  } catch (error){
    console.log(error);
  }
}

/* Expense management*/ 

export async function addExpense(name, price, creditorid, gid,description=""){
  let _data = {
    name: name,
    price: price,
    creditorid: creditorid,
    gid: gid
  }
  if(description){
    _data.description = description
  }

  const itemid = await addDoc(collection(db,'Test-Items'),_data)
  .then(docRef => {
    console.log("The expense item id "+docRef.id+" has been added successfully");
    return docRef.id;
  }).catch(error => {console.log(error)})

  return itemid
}
export async function getExpenseListByGid(gid){
  const ItemRef = collection(db,'Test-Items');
  const q = query(ItemRef,where("gid","==",gid));

  try {
    const docsnap = await getDocs(q);
    let expenseList = [];
    docsnap.forEach( doc => {
      expenseList.push({eid:doc.id, ...doc.data()})
    })
    
    return expenseList;

  } catch (error){
    console.log(error);
  }
}

/* Debtor management*/

const dabtstatus_enum = {
  pending: 'pending',
  paid: 'paid',
  owner: 'owner',
  cancel: 'cancel'
};
export async function addDebtor(debtors, itemid, gid, creditorid, price, countSplitEquallyMember=0){
  // debtors = [{uid:xx,isSplitEqully:true,percentage:10}]
  let sortedDebtors = debtors.sort(
    (d1, d2) => (d1.percentage < d2.percentage) ? 1 : (d1.price > d2.price) ? -1 : 0);
  let priceRemainder = price;
  let debtoridList = [];
  
  // console.log(sortedDebtors)
  for (debtor of sortedDebtors){

    let calculatedprice = (debtor.isSplitEqully ? 0 : price*debtor.percentage/100);
    priceRemainder-=calculatedprice

    if (debtor.isSplitEqully) calculatedprice = Math.round(((priceRemainder/countSplitEquallyMember)+Number.EPSILON)*100)/100
    console.log(priceRemainder +" , "+ countSplitEquallyMember)
    // let calculatedprice = (debtor.isSplitEqully ? Math.round(((priceRemainder/countSplitEquallyMember)+Number.EPSILON)*100)/100 : price*percentage/100);
    let debtstatus = (creditorid === debtor.uid ? dabtstatus_enum.owner : dabtstatus_enum.pending);
    let _data = {
      debtorid: debtor.uid,
      gid: gid,
      itemid: itemid,
      calculatedprice: calculatedprice,
      dabtstatus: debtstatus
    };

    let debtorid = await addDoc(collection(db,'Test-Debtors'),_data)
    .then( docRef => {
      console.log("The debtor id "+docRef.id+" has been added successfully")
      return docRef.id
    }).catch(err => {console.log(err.message)})

    debtoridList.push(debtorid)
  }

  return debtoridList
}
  
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
  where,
  deleteDoc,
  Timestamp
} from "firebase/firestore"

// const db = getFirestore(app);
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
const preText = "Test-";
/* User management*/

export function addUser(uid, phoneNum) {
  // WIP
  const _data = {
    bio: 'New User',
    phoneNum: phoneNum
  };
  setDoc(doc(db, preText+'Users', uid), _data).catch(err => {console.log(err.message)})
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
  if(Object.keys(_data).length > 0){updateDoc(doc(db, preText+'Users', uid), _data)
  .catch(err => {console.log(err.message)})}
}
export async function getUserFromPhoneNum(phoneNum){
  const colRef = collection(db,preText+'Users');
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
  const docRef = doc(db,preText+'Users',uid);
  
  try{
    const docsnap = await getDoc(docRef);
    const user = { uid: docsnap.id, ...docsnap.data()}
    return user;
  } catch (error){
    console.log(error);
  }
}

// show Debt and Debtor list function

export async function getPersonalDebtAndDebtorListbyGid(gid, uid){
  const items = await getExpenseListByGroupMember(gid,uid);

  let data_debtorList = [];    
  let data_creditorList = [];

  // console.log(items)
  if(items.length >0){
    for(let item of items){
      
      // Debt //
      const index = item.debtor.findIndex((obj => obj.uid == uid));
      if(item.creditor.uid != uid && item.debtor[index].debtstatus == "owed") {

        const index_c = data_creditorList.findIndex((obj => obj.creditorid == item.creditor.uid))

        if(index_c >=0){
          data_creditorList[index_c].totolPrice += item.debtor[index].calculatedprice;
          data_creditorList[index_c].detail.push({
            eid: item.eid,
            gid: gid,
            itemName: item.name,
            priceToPay: Number(item.debtor[index].calculatedprice),
            debtStatus: item.debtor[index].debtstatus
          })
        }else{
          const _data = {
            creditorName: item.creditor.name,
            creditorid: item.creditor.uid,
            totolPrice: Number(item.debtor[index].calculatedprice),
            debtStatus: item.debtor[index].debtstatus,
            detail: [{
              eid: item.eid,
              gid: gid,
              itemName: item.name,
              priceToPay: Number(item.debtor[index].calculatedprice),
              debtStatus: item.debtor[index].debtstatus
            }]
          };
          data_creditorList.push(_data);
        }
      }
      // Debtor //
      else{
        for(let debtor of item.debtor){
          if(debtor.uid != uid && debtor.debtstatus == "owed"){

            const index_d = data_debtorList.findIndex((obj => obj.debtorid == debtor.uid));
            if(index_d >= 0 ){
              data_debtorList[index_d].totolPrice += debtor.calculatedprice
              data_debtorList[index_d].detail.push({
                eid: item.eid,
                gid: gid,
                itemName: item.name,
                priceToPay: Number(debtor.calculatedprice),
                debtStatus: debtor.debtstatus
              })
            }else{
              const _data ={
                debtorName: debtor.name,
                debtorid: debtor.uid,
                totolPrice: Number(debtor.calculatedprice),
                debtStatus: debtor.debtstatus,
                detail: [{
                  eid: item.eid,
                  gid: gid,
                  itemName: item.name,
                  priceToPay: Number(debtor.calculatedprice),
                  debtStatus: debtor.debtstatus
                }]
              } 
              // console.log("------",_data)
              data_debtorList.push(_data);
            }
          }
        } 
      }
    }
  }
  return {debtor:data_debtorList, creditor:data_creditorList}
}
export async function getPersonalDebtAndDebtorListAllGroup(uid){
  const groupList = await getGroupListByUid(uid);

  let debtorList = [];    
  let creditorList = [];
  
  let havedata = false;
  for(let g of groupList){

    const data = await getPersonalDebtAndDebtorListbyGid(g.gid,uid);

    if(data.debtor.length>0) {debtorList.push({title:g.name,data:data.debtor}); havedata = true}
    if(data.creditor.length>0) {creditorList.push({title:g.name,data:data.creditor}); havedata = true}
  }
  // console.log("debtorList: ", debtorList)
  // console.log("creditorList: ", creditorList)
  return {debtor:debtorList, debt:creditorList, havedata:havedata}
}

/* Group management*/

const invStatus = {
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined',
  cancelled: 'cancelled',
}
export async function addGroup(name, image, description="" ){
  const colRef = collection(db, preText+'Groups');
  let _data={
    name: name, 
    image: image
  };
  if(description){
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
  const UserGroupRef = collection(db, preText+'UserGroup');
  const q = query(UserGroupRef,where("uid","==",uid), where("status","==", "accepted"));
  try {
    const docsSnap = await getDocs(q);
    let gidList = [];
    docsSnap.forEach( doc => {
      gidList.push({...doc.data()}.gid)
    })

    let groupList = [];
    for(let gid of gidList){
      let group = await getDoc(doc(db,preText+'Groups',gid)).catch(err => {console.log(err.message)})
      groupList.push({gid:group.id, ...group.data()})
    }

    return groupList;

  } catch (error){
    console.log(error);
  }
}
export function editGroup(gid, name, image, description="" ){
  let _data={
    name: name, 
    image: image
  };
  if(description){
    _data.description = description;
  }
  setDoc(doc(db, preText+'Groups', gid), _data).catch(err => {console.log(err.message)})
}
export async function getGroupByGid(gid){
  try {
    const groupInfo = await getDoc(doc(db,preText+'Groups', gid));
    if(groupInfo.exists()) {
    } else {
        console.log("Document does not exist")
    }
    return groupInfo.data();
  } catch(error) {
      console.log(error)
  }
}
export async function checkAllowToleave(uid, gid){ //A-edit

  try {
    const data = await getPersonalDebtAndDebtorListbyGid(gid, uid);

    return {creditor:(data.creditor.length == 0), debtor:(data.debtor.length == 0)}; // True if empty.

  } catch (error){
    console.log(error);
  }
}

/* User and Group */

export async function addEditGroupMember(gid,uid,status){
  await setDoc(doc(db,preText+'UserGroup','('+gid+','+uid+')'),{uid: uid,gid:gid, status: status}).catch(err => {console.log(err.message)})
}
export async function isInGroup(gid,uid){
  const check = await getDoc(doc(db,preText+'UserGroup','('+gid+','+uid+')')).catch(err => {console.log(err.message)})
  // console.log({isInGroup:{...check.data()}.status == "accepted", status: {...check.data()}.status})
  return {isInGroup:({...check.data()}.status == "accepted"), status: {...check.data()}.status}
}
export async function getMemberListByGid(gid){
  const UserGroupRef = collection(db, preText+'UserGroup');
  const q = query(UserGroupRef,where("gid","==",gid), where("status", "==", "accepted"));

  try {
    const docsSnap = await getDocs(q);
    if(!docsSnap.empty){     
      let uidList = [];     
      docsSnap.forEach( doc => {
        uidList.push({...doc.data()}.uid);
      })

      let memberList = [];
      for(let uid of uidList){
        let member = await getDoc(doc(db,preText+'Users',uid)).catch(err => {console.log(err.message)})
        memberList.push({uid:member.id, ...member.data()});
      }
      return memberList;
    } 
    return false;
  } catch (error){
    console.log(error);
  }
} 
export async function deleteGroup(gid){
  const ItemRef = collection(db,preText+'Items');
  const q1 = query(ItemRef, where("gid","==",gid));
  const DebtorRef = collection(db,preText+'Debtors');
  const q2 = query(DebtorRef, where("gid","==",gid));
  const UserGroupRef = collection(db, preText+'UserGroup');
  const q3 = query(UserGroupRef,where("gid", "==", gid));
  
  try{

    const ItemSnap = await getDocs(q1);
    ItemSnap.forEach((res)=>{
      // updateDoc(doc(db, preText+'Items', doc.id), {status:'disabled'}).catch(err => {console.log(err.message)})
      deleteDoc(doc(db,preText+'Items', res.id));
    })

    const DebtorSnap = await getDocs(q2);
    DebtorSnap.forEach((res)=>{
      deleteDoc(doc(db,preText+'Debtors', res.id));
    })

    const UserGroupSnap = await getDocs(q3);
    UserGroupSnap.forEach(res=>{
      deleteDoc(doc(db,preText+'UserGroup',res.id));
    })

    deleteDoc(doc(db,preText+'Groups', gid));
    console.log("The group ",gid," has been deleted.")

  } catch (error){
    console.log(error);
  }
}

/* Expense management*/ 

export async function addExpense(name, price, creditorid, method, gid,description=""){
  const creditorInfo = await getUserFromUid(creditorid)
  let _data = {
    name: name,
    price: price,
    creditor: creditorInfo, // an object
    method: method,
    gid: gid
  }
  if(description){
    _data.description = description
  }

  const itemid = await addDoc(collection(db,preText+'Items'),_data)
  .then(docRef => {
    console.log("The expense item id "+docRef.id+" has been added successfully");
    return docRef.id;
  }).catch(error => {console.log(error)})

  return itemid
}
export async function getExpenseListByGid(gid){
  const ItemRef = collection(db,preText+'Items');
  const q = query(ItemRef,where("gid","==",gid));

  try {
    const docsnap = await getDocs(q);
    let expenseList = [];
    docsnap.forEach( doc => {
      expenseList.push({eid:doc.id, ...doc.data()})
    })
    // console.log(expenseList)
    return expenseList
  } catch (error){
    console.log(error);
  }
}
export async function getExpenseListByGroupMember(gid,uid){
  const ItemRef = collection(db,preText+'Items');
  const q = query(ItemRef,where("gid","==",gid));

  try {
    const docsnap = await getDocs(q);
    let expenseList = [];
    docsnap.forEach( doc => {
      const cred = {...doc.data()}.creditor;
      const debt = {...doc.data()}.debtor;
      const index = debt.findIndex((obj => obj.uid == uid))
      if(cred.uid == uid || index >= 0) expenseList.push({eid:doc.id, ...doc.data()})
    })
    // console.log(expenseList)
    return expenseList
  } catch (error){
    console.log(error);
  }
}
export async function getExpenseInfo(eid){
  const itemDoc = await getDoc(doc(db,preText+'Items',eid));
  let itemInfo = {
    eid: itemDoc.id,
    ...itemDoc.data()
  };
  // console.log('iteminfo: ', itemInfo)
  return itemInfo
}
export async function editExpenseAfterView(eid, name, price, creditorid, debtorList, gid, description="" ){
  const creditorInfo = await getUserFromUid(creditorid)
  let _data = {
    name: name,
    price: price,
    creditor: creditorInfo, // an object
  }
  if(description){
    _data.description = description
  }
  await updateDoc(doc(db,preText+'Items',eid),_data)
  .catch(error => {console.log(error)})
}

/* Debtor management*/

const debtstatus_enum = {
  owed: 'owed',
  paid: 'paid',
  owner: 'owner',
  cancel: 'cancel'
};
export async function addDebtor(debtors, itemid, gid, creditorid, price, countSplitEquallyMember=0){
  // debtors = [{uid:xx,isSplitEqually:true,percentage:10}]
  let sortedDebtors = debtors.sort(
    (d1, d2) => (!d2.isSplitEqually) ? 1 : (!d1.isSplitEqually) ? -1 : 0);
  let priceRemainder = Number(price);
  let debtoridList = [];
  
  for (debtor of sortedDebtors){

    // let calculatedprice = (debtor.isSplitEqually ? 0 : price*debtor.percentage/100);
    let calculatedprice = (debtor.isSplitEqually ? 0 : Number(debtor.priceToPay));
    priceRemainder-=calculatedprice

    if (debtor.isSplitEqually) calculatedprice = Math.round(((priceRemainder/countSplitEquallyMember)+Number.EPSILON)*100)/100
    
    // console.log(priceRemainder +" - "+ calculatedprice+ " = "+ priceRemainder-calculatedprice)
    // let calculatedprice = (debtor.isSplitEqually ? Math.round(((priceRemainder/countSplitEquallyMember)+Number.EPSILON)*100)/100 : price*percentage/100);
    let debtstatus = (creditorid === debtor.uid ? debtstatus_enum.owner : debtstatus_enum.owed);
    const debtorInfo = await getUserFromUid(debtor.uid)
    let _data = {
      ...debtorInfo,
      calculatedprice: calculatedprice,
      debtstatus: debtstatus
    };
    debtoridList.push(_data)
  }

  const debtorData = {
    debtor: debtoridList
  }
  await updateDoc(doc(db,preText+'Items', itemid), debtorData).then(docRef => {
    console.log(itemid,"has been updated the debtors");
    // return itemid;
  }).catch(err => {console.log(err.message); return false})
}
  
/* Notification */ 

export async function getAllNoti(uid){
  const notiRef = collection(db, 'Notification-records');
  const q = query(notiRef,where("touid","==",uid));

  let notiList = [];
  try {
    const docsnap = await getDocs(q);

    docsnap.forEach(doc=>{
      notiList.push({nid:doc.id, ...doc.data()});
    })

    // notiList.sort(function(x, y){
    //   return x.timestamp - y.timestamp;
    // })
  return notiList;
    
  } catch (error){
    console.log(error);
  }
}

export async function sendGroupInv(from, to, needreaction, gid, gname){
  const notiType = await getDoc(doc(db,'Notification-props', 'groupinv')); 
  const notiRef = collection(db, 'Notification-records');

  // const gname = gname;
  const uname = from.name;
  const notification = {type:notiType.id, message:{...notiType.data()}.message.replace('{uname}', uname).replace('{gname}', gname), header:'Group Invitation', group:{gid:gid,gname:gname}}
  // console.log(notification.message)
  const date = new Date (Date.now())
  let dateFormat = (date.getHours()<10? '0'+date.getHours():date.getHours()) + ":" + (date.getMinutes()<10? '0'+date.getMinutes():date.getMinutes()) + ", "+ date.toDateString();
  // console.log(dateFormat)

  let _data = {
    fromuid: from.uid,
    touid: to.uid,
    timestamp: dateFormat,
    read:false,
    needreaction: needreaction,
    notification: notification,
  }
  // const colRef = `${preText}UserGroup`;
  // const docID = `(${gid},${to.uid})`;
  // (notification.type=='groupinv'? _data.UserGroup=doc(db,colRef,docID) :null);
  await addDoc(notiRef, _data).catch(error => {console.log(error)})
}

export async function setReadNeedReaction(nid,read, needreaction=""){
  const notiRef = doc(db, 'Notification-records',nid);
  let _data = {
    read:read,
    // needreaction: needreaction,
  }
  if (needreaction !== ""){
    _data.needreaction=needreaction
  }
  await updateDoc(notiRef, _data).catch(error => {console.log(error)})
}
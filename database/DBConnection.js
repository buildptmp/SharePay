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
  Timestamp,
  FieldValue,
  arrayUnion,
  arrayRemove
} from "firebase/firestore"
import { AirbnbRating } from 'react-native-elements';

// const db = getFirestore(app);
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
const preText = "Test-";
// const preText = "Tester-";
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
        const slip = await getSlip(uid,gid,item.creditor.uid)
        const index_c = data_creditorList.findIndex((obj => obj.creditorid == item.creditor.uid))

        if(index_c >=0){
          if(data_creditorList[index_c].timestamp<item.timestamp) {
            data_creditorList[index_c].timestamp = item.timestamp
          } 
          data_creditorList[index_c].totolPrice += item.debtor[index].calculatedprice;
          data_creditorList[index_c].detail.push({
            eid: item.eid,
            // gid: gid,
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
            timestamp: item.timestamp,
            slip: slip,
            gid:gid,
            detail: [{
              eid: item.eid,
              // gid: gid,
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
          // console.log("debtor",debtor)
          if(debtor.uid != uid && debtor.debtstatus == "owed"){
            const slip = await getSlip(debtor.uid,gid,uid)
            const index_d = data_debtorList.findIndex((obj => obj.debtorid == debtor.uid && obj.debtStatus == "owed"));
            if(index_d >= 0 ){
              data_debtorList[index_d].totolPrice += debtor.calculatedprice
              data_debtorList[index_d].detail.push({
                eid: item.eid,
                // gid: gid,
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
                timestamp: item.timestamp,
                slip: slip,
                gid: gid,
                detail: [{
                  eid: item.eid,
                  // gid: gid,
                  itemName: item.name,
                  priceToPay: Number(debtor.calculatedprice),
                  debtStatus: debtor.debtstatus
                }]
              } 
              // console.log("------",_data)
              data_debtorList.push(_data);
            }
          } else if(debtor.uid != uid && debtor.debtstatus == "paid" && debtor.rating == undefined){
            const slip = await getSlip(debtor.uid,gid,uid)
            const index_d = data_debtorList.findIndex((obj => obj.debtorid == debtor.uid && obj.debtStatus == "paid"));
            if(index_d >= 0 ){
              data_debtorList[index_d].totolPrice += Number(debtor.calculatedprice)
              data_debtorList[index_d].detail.push({
                eid: item.eid,
                // gid: gid,
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
                timestamp: item.timestamp,
                slip: slip,
                gid: gid,
                detail: [{
                  eid: item.eid,
                  // gid: gid,
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
async function getPersonalDebt(uid){
  
  const groupList = await getGroupListByUid(uid);
  
  let creditorList = [];  
  
  let havedata = false;
  for(let g of groupList){

    const items = await getExpenseListByGroupMember(g.gid,uid);
    let data_creditorList = [];   
    let totolGroupDebt = 0;

    if(items.length >0){
      for(let item of items){
        // Debt //
        const index = item.debtor.findIndex((obj => obj.uid == uid));
        if(item.creditor.uid != uid && item.debtor[index].debtstatus == "owed") {
          const index_c = data_creditorList.findIndex((obj => obj.creditorid == item.creditor.uid))

          if(index_c >=0){
            if(data_creditorList[index_c].timestamp<item.timestamp) {
              data_creditorList[index_c].timestamp = item.timestamp
            } 
          }else{
            const _data = {
              creditorid: item.creditor.uid,
              timestamp: item.timestamp
            };
            data_creditorList.push(_data);
          }
          totolGroupDebt += Number(item.debtor[index].calculatedprice);
        }
      }
    }
    const data = {creditor:data_creditorList}

    if(data.creditor.length>0) { creditorList.push({gname:g.name,gid:g.gid,totolGroupDebt:totolGroupDebt,data:data.creditor}); havedata = true }
  }
  // console.log("creditorList: ", creditorList)
  return {debt:creditorList, havedata:havedata}
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
export async function checkAllowToleave(uid, gid){

  try {
    const data = await getPersonalDebtAndDebtorListbyGid(gid, uid);
    
    let pass = true
    if(data.debtor.length > 0){
      for(debtor of data.debtor){
        if(debtor.debtStatus=="owed"){
          pass = false;
          break;
        }
      }
    }
    return {creditor:(data.creditor.length == 0), debtor:(data.debtor.length == 0 || pass)}; // True if empty.

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

  let _data = {
    name: name,
    price: price,
    creditorid:creditorid,
    method: method,
    gid: gid,
    timestamp: Date.now(),
    // dateFormat: dateFormat
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

    let newEList = [];
    for(let e of expenseList){
      let etemp = e;

      const creditor = await getUserFromUid(e.creditorid);
      let debtorList = [];
      for(let debtorObj of e.debtor){
        const debtor = await getUserFromUid(debtorObj.uid)
        debtorList.push({...debtor, ...debtorObj})
      }
      etemp.creditor = creditor
      etemp.debtor = debtorList
      newEList.push(etemp)
    }

    // console.log(newEList)
    return newEList
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
      const creditorid = {...doc.data()}.creditorid;
      const debtor = {...doc.data()}.debtor;
      const index = debtor.findIndex((obj => obj.uid == uid))
      if(creditorid == uid || index >= 0) expenseList.push({eid:doc.id, ...doc.data()})
    })
    let newEList = [];
    for(let e of expenseList){
      let etemp = e;
      
      const creditor = await getUserFromUid(e.creditorid);
      let debtorList = [];
      for(let debtorObj of e.debtor){
        const debtor = await getUserFromUid(debtorObj.uid)
        debtorList.push({...debtor, ...debtorObj})
      }
      etemp.creditor = creditor
      etemp.debtor = debtorList
      // console.log(etemp)
      newEList.push(etemp)
    }

    // console.log(newEList)
    return newEList
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

  const creditor = await getUserFromUid(itemInfo.creditorid);
  let debtorList = [];
  for(let debtorObj of itemInfo.debtor){
    const debtor = await getUserFromUid(debtorObj.uid)
    debtorList.push({...debtor, ...debtorObj})
  }
  itemInfo.creditor = creditor
  itemInfo.debtor = debtorList
  
  // console.log('iteminfo: ', itemInfo)
  return itemInfo
}
export async function editExpenseAfterView(eid, name, price, creditorid, method, description="" ){
  let _data = {
    name: name,
    price: price,
    creditorid:creditorid,
    method: method,
    timestamp: Date.now(),
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
      uid:debtorInfo?.uid,
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
      const date = new Date({...doc.data()}.timestamp);
      let dateFormat = (date.getHours()<10? '0'+date.getHours():date.getHours()) + ":" + (date.getMinutes()<10? '0'+date.getMinutes():date.getMinutes()) + ", "+ date.toDateString();
      notiList.push({nid:doc.id, ...doc.data(), dateFormat:dateFormat});
    })

    notiList.sort(function(x, y){
      return y.timestamp - x.timestamp;
    })

    return notiList;
    
  } catch (error){
    console.log(error);
  }
}
export async function getGroupInv(fromuid,touid){
  const notiRef = collection(db, 'Notification-records');
  const q = query(notiRef,where("fromuid","==",fromuid),where("touid","==",touid), where("needreaction","==",true));

  let notiList = [];
  try {
    const docsnap = await getDocs(q);

    if(!docsnap.empty){
      docsnap.forEach(doc=>{
        notiList.push({nid:doc.id});
      })
      return notiList[0].nid;
    }
    return false
  } catch (error){
    console.log(error);
  }
}
export async function sendGroupInv(from, to, needreaction, gid, gname){
  const notiType = await getDoc(doc(db,'Notification-props', 'groupinv')); 
  const notiRef = collection(db, 'Notification-records');

  const uname = from.name;
  const notification = {type:notiType.id, message:{...notiType.data()}.message.replace('{uname}', uname).replace('{gname}', gname), header:'Group Invitation'}
  // console.log(notification.message)

  let _data = {
    fromuid: from.uid,
    touid: to.uid,
    group: {gid:gid,gname:gname},
    timestamp: Date.now(),
    read:false,
    needreaction: needreaction,
    notification: notification,
  }
  // const colRef = `${preText}UserGroup`;
  // const docID = `(${gid},${to.uid})`;
  // (notification.type=='groupinv'? _data.UserGroup=doc(db,colRef,docID) :null);
  const nid = await addDoc(notiRef, _data).then(doc=>{return doc.id}).catch(error => {console.log(error)})
  return nid
}
export async function delGroupInv(nid, gid, uid){ // Del noti and Del UserGroup
  await deleteDoc(doc(db,'Notification-records',nid)).catch(error => {console.log(error)});
  await deleteDoc(doc(db,preText+'UserGroup',`(${gid},${uid})`)).catch(error => {console.log(error)});
}
export async function setGroupInvResponse(nid, action){
  const notiRef = doc(db, 'Notification-records', nid);
  // const date = new Date(Date.now())
  let _data = {
    update_timestamp: Date.now(),
    action: action
  }
  await updateDoc(notiRef, _data).catch(error => {console.log(error)})
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
function formatDate(date) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('');
}
export function timecheck(t_create,t_slip){
  time = new Date(t_create)
  time_create = time.toLocaleTimeString('it-IT')
  // console.log("time_create"+ time_create, "time_slip", t_slip)
  if(time_create<t_slip){
    // console.log("time", 1)
    return 1;
  } else if(time_create==t_slip){
    // console.log("time", 0)
    return 0;
  } else {
    // console.log("time", -1)
    return -1;
  }
}
export function datetimecheck(dt_create,d_slip,t_slip){
  date_create = formatDate(dt_create) 
  // console.log("date_create"+ date_create, "date_slip", d_slip)
  if(date_create<d_slip){
    // console.log("date", 1)
    return 1;
  } else if(date_create==d_slip){
    const check = timecheck(dt_create,t_slip)
    // console.log("date", 0)
    return check;
  } else{
    // console.log("date", -1)
    return -1;
  }
}
export async function debtReminder(/*from,*/ to, gid, gname, priceToPay){
  const notiType = await getDoc(doc(db,'Notification-props', 'debtreminder'));
  const notiRef = collection(db, 'Notification-records');

  const notification = {type:notiType.id, message:{...notiType.data()}.message.replace('{gname}', gname).replace('{priceToPay}', priceToPay), header:'Debt Reminder'}
  let _data = {
    // fromuid: from.uid,
    touid: to.uid,
    group: {gid:gid,gname:gname},
    timestamp: Date.now(),
    read:false,
    needreaction: false,
    notification: notification,
  }

  const nid = await addDoc(notiRef, _data).then(doc=>{return doc.id}).catch(error => {console.log(error)})
  return nid
}
export async function sendPersonalDebtReminder(uid){
  const debtList = await getPersonalDebt(uid);
  if(debtList.havedata){
    for(debt of debtList.debt){
      await debtReminder({uid:uid},debt.gid,debt.gname,debt.totolGroupDebt)
    }
  }
}
export async function sendPaidDebtNoti(from, to, gid, gname,  expense){
  const notiType = await getDoc(doc(db,'Notification-props', 'payment-paid'));
  const notiRef = collection(db, 'Notification-records');

  let message = {...notiType.data()}.message.replace('{uname}', from.name).replace('{gname}',gname);
  let message_padding = "\n"+{...notiType.data()}.padding+"\n"
  let n = 0;
  for(e of expense){
    n++;
    message_padding += {...notiType.data()}.expenseList.replace('{n}', n).replace('{ename}', e.ename).replace('{priceToPay}', e.priceToPay)
    message_padding += "\n"
  }
  let message_endding = {...notiType.data()}.endding.replace('{uname}', from.name)

  const notification = {type:notiType.id, message:message, padding:message_padding, endding:message_endding, header:'Your debt is paid in full'}
  let _data = {
    fromuid: from.uid,
    touid: to.uid,
    group: {gid:gid,gname:gname},
    timestamp: Date.now(),
    read:false,
    needreaction: false,
    notification: notification,
  }

  const nid = await addDoc(notiRef, _data).then(doc=>{return doc.id}).catch(error => {console.log(error)})
  return nid
}
export async function sendDebtClearNoti(touid, gid, gname){
  const notiType = await getDoc(doc(db,'Notification-props', 'payment-clear'));
  const notiRef = collection(db, 'Notification-records');

  const notification = {type:notiType.id, message:{...notiType.data()}.message.replace('{gname}', gname), header:`Zero Debt in ${gname}`}
  let _data = {
    // fromuid: from.uid,
    touid: touid,
    group: {gid:gid,gname:gname},
    timestamp: Date.now(),
    read:false,
    needreaction: false,
    notification: notification,
  }

  const nid = await addDoc(notiRef, _data).then(doc=>{return doc.id}).catch(error => {console.log(error)})
  // console.log("nid"+nid+"  "+touid)
  return nid
}

/* Slip verification */ 
export async function uploadSlipDebt(creditorid,uid, gid, slipURL, verificationStatus, pickerRes){
  const slip = await getSlip(uid,gid,creditorid);
  
  pickerRes.uri = slipURL

  if(!slip){ // add slip
    const _data = {
      gid: gid,
      creditorid: creditorid,
      uid:uid,
      slipURL:slipURL,
      status: verificationStatus,
      pickerRes:pickerRes
    }
    const colRef = collection(db,preText+"SlipDebt")
    await addDoc(colRef,_data)
  } else { // update slip
    const docRef = doc(db,preText+"SlipDebt",slip.sid)
    await updateDoc(docRef,{slipURL:slipURL,status: verificationStatus,pickerRes:pickerRes})
  }
}
export async function getSlip(uid, gid, creditorid){
  const colRef = collection(db,preText+"SlipDebt")
  const q = query(colRef,where("gid","==",gid),where("creditorid","==",creditorid),where("uid","==",uid))

  try {
    const slip = [];
    const docsnap = await getDocs(q);

    if(!docsnap.empty){
      docsnap.forEach(doc=>{
        slip.push({sid:doc.id,slipURL:{...doc.data()}.slipURL,status:{...doc.data()}.status, pickerRes:{...doc.data()}.pickerRes})
      })
      if(slip.length >1) console.log(slip)

      return slip[0];

    } else {
      return false
    }

  } catch (error){
    console.log(error);
  }
}
export async function updateDebtStatus(docid, debtorid, calculatedprice, name, debtstatusChangeTo){
  const docRef = doc(db,preText+'Items',docid)
  // console.log(debtorid, calculatedprice, name);
  await updateDoc(docRef,{
    debtor: arrayUnion({
      uid: debtorid,
      debtstatus: (debtstatusChangeTo == "paid" ? "paid":"owed"),
      calculatedprice: calculatedprice
    })
  })
  await updateDoc(docRef,{
    debtor: arrayRemove({
      uid: debtorid,
      debtstatus: (debtstatusChangeTo == "paid" ? "owed":"paid"),
      calculatedprice: calculatedprice
    })
  })
}

/* Rating */
export async function updateDebtRating(docid, debtorid, calculatedprice, name, rating){
  const docRef = doc(db,preText+'Items',docid)
  // console.log(debtorid, calculatedprice, name);
  await updateDoc(docRef,{
    debtor: arrayUnion({
      uid: debtorid,
      debtstatus: "paid",
      calculatedprice: calculatedprice,
      rating: rating
    })
  })
  await updateDoc(docRef,{
    debtor: arrayRemove({
      uid: debtorid,
      debtstatus: "paid",
      calculatedprice: calculatedprice
    })
  })
}
export async function updateRating(uid, rating){
  const docRef = doc(db, preText+'Users', uid)
  const UserRef = await getDoc(doc(db,preText+'Users',uid))

  const ratingAll = rating + ({...UserRef.data()}.ratingAll == undefined ? 0: {...UserRef.data()}.ratingAll);
  const times = 1 + ({...UserRef.data()}.times == undefined ? 0:{...UserRef.data()}.times);
  const avgRating = Math.round(ratingAll/times*100)/100

  const data = {
    ratingAll: ratingAll,
    times: times,
    avgRating: avgRating
  };

  try{
    await updateDoc(docRef, data)
  } catch(error) {
    console.error('Error updating item rating:', error);
    throw new Error('Error updating item rating');
  }
};

export async function calculateAvgRating (uid) {
  // const ratingCollectionRef = collection(db, preText+'Users');
  // const ratingDocsSnapshot = await getDocs(ratingCollectionRef);
  const UserRef = await getDoc(doc(db,preText+'Users',uid))

  const totalRating = {...UserRef.data()}.ratingAll;
  const times = {...UserRef.data()}.times;

  const avgRating = Math.round(totalRating/times*100)/100

  return avgRating;
  // let totalRating = 0;
  // let numRatings = ratingDocsSnapshot.size;

  // ratingDocsSnapshot.forEach((doc) => {
  //   totalRating += doc.data().rating;
  // });

  // return totalRating/numRatings;
}

export async function getRatingByUid(uid){
  const docRef = doc(db, preText+'Users', uid);
  const docSnap = await getDoc(docRef);

  docSnap.data();

  try {
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    } catch(error) {
        console.log(error)
    }
}
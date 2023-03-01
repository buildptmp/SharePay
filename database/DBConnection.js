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

// show Debt and Debtor list function

async function getDebtorsByItemId(itemid, gid){
  const debtorcolRef = collection(db,'Test-Debtors');
  const q = query(debtorcolRef,where("gid","==",gid),where("itemid","==",itemid));

  try{
    const debtorSnap = await getDocs(q);
    let debtors = [];
    debtorSnap.forEach( debtor => {
      debtors.push({id:debtor.id, ...debtor.data()})
    })
    let debtorList = [];
    for(let debtor of debtors){
      const debtorInfo = await getDoc(doc(db,'Test-Users',debtor.debtorid))
      debtorList.push({...debtor,...debtorInfo.data()})
    }
    // console.log("debtors: ", debtorList)
    return debtorList
  }catch(error){
    console.log(error.message);
  }
}
async function getItemsByCreditorId(uid, gid){
  const itemcolRef = collection(db, 'Test-Items');
  const q = query(itemcolRef, where("gid","==",gid),where("creditorid","==",uid));

  try{ 
    const itemsSnap = await getDocs(q);
    let items = [];
    itemsSnap.forEach( doc => {
      items.push({ id: doc.id, ...doc.data()})
    })

    let itemList = [];
    for(let item of items){
      const debtors = await getDebtorsByItemId(item.id,gid)
      const creditorInfo = await getDoc(doc(db,'Test-Users', item.creditorid))
      itemList.push({...item,creditor:{...creditorInfo.data()},debtors:debtors})
    }
    // console.log("item: ", itemList)
    return itemList;
  } catch (error){
    console.log(error);
  }
}
async function getCreditorsByDebtorId(debtorid, gid){
  const debtorcolRef = collection(db,'Test-Debtors');
  const q = query(debtorcolRef,where("gid","==",gid),where("debtorid","==",debtorid));

  try{
    const debtorSnap = await getDocs(q);
    let debtorList = [];
    debtorSnap.forEach( debtor => {
      if({...debtor.data()}.debtstatus == "pending"){
        debtorList.push({id:debtor.id, ...debtor.data()})
      }
    })
    let creditorList = [];
    for(let debtor of debtorList){
      const itemInfo = await getDoc(doc(db,'Test-Items',debtor.itemid))
      const userInfo = await getDoc(doc(db, 'Test-Users', {...itemInfo.data()}.creditorid))
      creditorList.push({debtor:{...debtor},...itemInfo.data(),creditor:{...userInfo.data()}})
    }
    return creditorList
  }catch(error){
    console.log(error.message);
  }
}
export async function getPersonalDebtAndDebtorList(uid){
  const groupList = await getGroupListByUid(uid);

  let debtorList = [];    
  let creditorList = [];
  
  for(let g of groupList){
    const debtorTemp = await getItemsByCreditorId(uid,g.gid);
    const creditorTemp = await getCreditorsByDebtorId(uid,g.gid);

    let data_debtorList = [];    
    let data_creditorList = [];

    // debtor list 
    if(debtorTemp.length > 0){
      const memberList = await getMemberListByGid(g.gid);

      for(let member of memberList){
        if(member.uid != uid){
          
          let data_debtor = {};
          let calPrice = 0;

          for(let item of debtorTemp){
            for(let debtor of item.debtors){
              if(member.uid == debtor.debtorid){
                data_debtor.debtorName = debtor.name;
                data_debtor.debtorid = debtor.debtorid;
                calPrice += debtor.calculatedprice;
                break;
              }
            }
          }
          if(data_debtor.debtorid){
            data_debtor.calPrice = calPrice;
            data_debtorList.push(data_debtor)
          }
          
        }
      }
      // console.log("data_debtorList: ", data_debtorList)
      debtorList.push({title:g.name,data:data_debtorList})// debtor list
    }
    // debt list 
    if(creditorTemp.length > 0){
      const memberList = await getMemberListByGid(g.gid);

      for(let member of memberList){
        if(member.uid != uid){
          let data_creditor = {};
          let calPrice = 0;

          for(let item of creditorTemp){
            if(member.uid == item.creditorid){
              data_creditor.creditorName = item.creditor.name;
              data_creditor.creditorid = item.creditorid;
              calPrice += item.debtor.calculatedprice;
            }
          }
          if(data_creditor.creditorName){
            data_creditor.calPrice = calPrice;
            data_creditorList.push(data_creditor);
          }
        }
      }
      // console.log("data_creditorList: ", data_creditorList)
      creditorList.push({title:g.name,data:data_creditorList})// creditor list
    }
  }
  // console.log("debtorList: ", debtorList)
  // console.log("creditorList: ", creditorList)
  return [debtorList, creditorList]
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
export function editGroup(gid, name, image, description="" ){
  let _data={
    name: name, 
    image: image
  };
  if(description){
    _data.description = description;
  }
  setDoc(doc(db, 'Test-Groups', gid), _data).catch(err => {console.log(err.message)})
}
export async function getGroupByGid(gid){
  try {
    const groupInfo = await getDoc(doc(db,'Test-Groups', gid));
    if(groupInfo.exists()) {
    } else {
        console.log("Document does not exist")
    }
    return groupInfo.data();
  } catch(error) {
      console.log(error)
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
    
    let expenseListandCreditorname = [];
    for(expense of expenseList){
      const creditorInfo = await getDoc(doc(db,'Test-Users', expense.creditorid))
      expenseListandCreditorname.push({...expense, creditor:{...creditorInfo.data()}})
    }
    return expenseListandCreditorname;

  } catch (error){
    console.log(error);
  }
}

/* Debtor management*/

const debtstatus_enum = {
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
    let debtstatus = (creditorid === debtor.uid ? debtstatus_enum.owner : debtstatus_enum.pending);
    let _data = {
      debtorid: debtor.uid,
      gid: gid,
      itemid: itemid,
      calculatedprice: calculatedprice,
      debtstatus: debtstatus
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
  
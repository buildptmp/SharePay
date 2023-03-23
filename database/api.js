import uuid from 'react-native-uuid';

export async function get_access_key(){
    const url ="https://api-sandbox.partners.scb/partners/sandbox/v1/oauth/token";

    const _data = {
        "applicationKey" : "l713881c799093494e96da2f398152f120",
        "applicationSecret" : "66f6c393b3db49d59726745209e3a6d3"
    }

    const response = await fetch( url , {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            "Content-Type": "application/json",
            "requestUID": uuid.v4(),
            "resourceOwnerId": "AIzaSyCpVQDO3EnKaxSfhU5KtYwBpLrw6DgpaZs"
        },
        body: JSON.stringify(_data),
    }).then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      return data
    })
    .catch((error) => {
      console.error("Error:", error);
      return error
    });

    return response.data.accessToken
}

export async function getpaymentInfo(transRef=""){
    sendingBank = "014"
    transRef = transRef? transRef:"202303143qO8X3qczVArfqJ"
    url = `https://api-sandbox.partners.scb/partners/sandbox/v1/payment/billpayment/transactions/${transRef}?sendingBank=${sendingBank}`
    access_key = await get_access_key();
    // console.log("access_key",typeof access_key,access_key)

    const response = await fetch( url, {
        method: 'GET',
        cache: 'no-cache',
        headers:{
            "authorization": "Bearer " + access_key,
            "requestUID": uuid.v4(),
            "resourceOwnerId": "AIzaSyCpVQDO3EnKaxSfhU5KtYwBpLrw6DgpaZs"
        }
    }).then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      return data
    })
    .catch((error) => {
      console.error("Error:", error);
      return error
    });
    console.log({"amount":response.data.amount,"date":response.data.transDate,"time":response.data.transTime, status:response.status.description});

    return {"amount":response.data.amount,"date":response.data.transDate,"time":response.data.transTime, status:response.status.description};
}
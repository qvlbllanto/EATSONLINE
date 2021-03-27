import {browserName, fullBrowserVersion, mobileModel, mobileVendor, osName, osVersion, deviceType, engineName, engineVersion} from "react-device-detect";
import {data} from "../firebase";
import publicIP from 'react-native-public-ip';

const saveLogs = (ip, page) =>{
    data.ref('logs').push().set({
        "IP" : ip,
        "OS" : osName,
        "osVersion": osVersion,
        "model": mobileModel,
        "mobileVendor": mobileVendor,
        "deviceType": deviceType,
        "browser": browserName,
        "browserVersion": fullBrowserVersion,
        "engineName": engineName,
        "engineVersion": engineVersion,
        "date": todaydate(),
        "page": page
    });
}
const todaydate = () =>{
    let d = new Date();
    return d.toString();
  }
const addCart = (title, price, description, link, idnum,seller, type) =>{
    data.ref('cart').child(idnum).push().set({
        "title": title,
        "price": price,
        "desc": description,
        "date": todaydate(),
        "link": link,
        "type": type,
        "seller": seller,
        "amount": 1
    });
}
const updateAmount = (idnum,itemid, amt, prce) =>{
    return new Promise((resolve, reject)=>{
        data.ref('cart').child(idnum).child(itemid).update({ amount: amt, price: prce}).then(d=>{
            resolve(true);
        });
    })
   
}
const buyItems = (items,total, idnum) =>{
    return new Promise((resolve, reject)=>{
        data.ref('ItemsBoughthistory').child(idnum).push().set({
            "totalprice": total,
            "items": items,
            "dateBought": todaydate(),
            "status": "Pending" 
        }).then(x=>{
            data.ref('cart').child(idnum).remove();
            resolve(true);
        });
    })
    
}

const deleteITM = (idnum, cart) =>{
    return new Promise(function (resolve, reject) {
        data.ref('cart').child(idnum).child(cart).remove();
        resolve(true);
    });
}
const Reservation= (name, email, phone, date, time, people, message) =>{
    return new Promise(function (resolve, reject) {
        data.ref('reservation').push().set({
            "name" : name,
            "email": email,
            "phone": phone,
            "date": date,
            "time": time,
            "people": people,
            "message": message,
            "date_created": todaydate()
        }).then(u =>{
            resolve(true)
        });
      
    });
   }

const getCartData = (idnum) => {
    return new Promise(function (resolve, reject) {
      data.ref("cart").child(idnum).on("value", (snapshot) =>{
        let products = [];
        snapshot.forEach(snap=>{
            let x  = [snap.key, snap.val()]
            products.push(x);
        });
        resolve(products);
      });
    });
 }

const generateCode = () =>{
    let alphs = "ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code=""
    for(let i=0; i<10; i++){
        let x = Math.floor((Math.random() * 60) + 1);
        code+=alphs.charAt(x);
    }
    return code;
}


const addLogs = (page) =>{
    publicIP()
    .then(ip => {
      saveLogs(ip, page);
    })
    .catch(error => {
        saveLogs("unknown", page);
    });
}
const endDateofVerification = () =>{
    let d = new Date();
    var n = parseInt(d.getTime())+300000;
    var x = new Date(n);
    return x.toString();
}

export {addLogs, todaydate, addCart, Reservation, generateCode, endDateofVerification, getCartData, deleteITM, buyItems, updateAmount};
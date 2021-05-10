import {browserName, fullBrowserVersion,  osName, osVersion, deviceType} from "react-device-detect";
import {data, storage} from "../firebase";
import publicIP from 'react-native-public-ip';
const saveLogs = (ip, page) =>{
    data.ref('logs').push().set({
        "IP" : ip,
        "OS" : osName,
        "osVersion": osVersion,
        "deviceType": deviceType,
        "browser": browserName,
        "browserVersion": fullBrowserVersion,
        "date": todaydate(),
        "page": page
    });
    //data.ref('logs').push()
}
const todaydate = () =>{
    let d = new Date();
    return d.toUTCString();
  }
const addCart = (key, title, price, description, link, idnum,seller, type, id, qty) =>{
    return new Promise((resolve, reject)=>{
        data.ref('cart').child(idnum).orderByChild('key').equalTo(key).once('value', (snapshot)=>{
            if(snapshot.val()===null){
                data.ref('cart').child(idnum).push({
                    "title": title,
                    "price": price,
                    "desc": description,
                    "date": todaydate(),
                    "link": link,
                    "type": type,
                    "seller": seller,
                    "amount": qty,
                    "key":key,
                    "id": id
                }).then(()=>{
                    resolve(true);
                });
               
            }else{
                resolve(false);
            }
        })
    })
 
    
}
const sendContact = (name, subject, email, message) =>{
    return new Promise((resolve, reject)=>{
        data.ref('contactus').push().set({
            "name": name,
            "subject": subject,
            "email": email,
            "message": message,
            "date_created": todaydate()
        }).then((d)=>{
            resolve(true);
        });
    });
}

const viewHistory = ( hid) =>{
    return new Promise((resolve, reject)=>{
        data.ref('ItemsBoughthistory').child(hid).once('value', (snapshot)=>{
            resolve(snapshot.val());
        });
    });
}
const viewHistory2 = ( hid) =>{
    return new Promise((resolve, reject)=>{
        data.ref('reservation').child(hid).once('value', (snapshot)=>{
            resolve(snapshot.val());
        });
    });
}
const buyItems = (items,total, idnum, name, address, payment, phone, id) =>{
    return new Promise((resolve, reject)=>{
        let ch = data.ref('ItemsBoughthistory').push({
            "name": name,
            "totalprice": total,
            "items": items[0],
            "dateBought": todaydate(),
            "status": "Pending",
            "pstatus": "Not Paid",
            "address": address,
            "payment": payment,
            "userid": idnum,
            "uid": id, 
            "phone": phone
        });
        ch.then(()=>{
            data.ref('cart').child(idnum).set(items[1]).then(()=>{
                data.ref('ItemsBoughthistory').child(ch.key).update({id: (generateCode().substring(3)+ch.key.substring(6, 9)).replace("-","").replace("_","")}).then((d)=>{
                    data.ref('ItemsBoughthistory').child(ch.key).child('items').once('value',(snapshot)=>{
                        snapshot.forEach((snap)=>{
                            data.ref('products').orderByKey().equalTo(snap.val()[1].key).once('value',(s)=>{
                                s.forEach((x)=>{
                                    data.ref('products').child(x.key).update({numberofitems: x.val().numberofitems - snap.val()[1].amount}); 
                                }); 
                            });
                        });
                        resolve([true, ch.key]);
                     });
                });
            })
        })
        
        
    });
}

const deleteITM = (idnum, cart) =>{
    return new Promise(function (resolve, reject) {
        data.ref('cart').child(idnum).child(cart).remove();
        resolve(true);
    });
}
const Reservation= (name, email, phone, message, set, uid, totalprice, add, id) =>{
    return new Promise(function (resolve, reject) {
        let x = data.ref('reservation').push({
            "name" : name,
            "email": email,
            "phone": phone,
            "message": message,
            "items": set[0],
            "userid": uid,
            "uid": id, 
            "balance": totalprice,
            "status": "Pending",
            "totalprice": totalprice,
            "proof": null,
            "address": add,
            "pstatus": "Not Paid",
            "dateBought": todaydate()
        });
        x.then(()=>{
            data.ref('cart').child(uid).set(set[1]).then(()=>{
                data.ref('reservation').child(x.key).update({id: (generateCode().substring(3)+x.key.substring(6, 9)).replace("-","").replace("_","")}).then((d)=>{
                        resolve(x.key);
                });
            });
        })
        
    });
}



const getCartData = (idnum) => {
    return new Promise(function (resolve, reject) {
      data.ref("cart").child(idnum).once("value", (snapshot) =>{
        let products = [];
        let c = 0;
        snapshot.forEach(snap=>{
            products.push([snap.key, snap.val()]);
        });
        resolve(products);
      });
    });
 }

 const updateCartData = (idnum, vals, keys) =>{
     return new Promise((resolve,reject)=>{
        data.ref("products").child(vals.key).once('value', (s)=>{
            let itemsoutofstock = null;
            let noofit = null;
            if(s.val()!==null){
                let o = s.val();
                vals["title"]=o.title;
                vals["seller"]=o.seller;
                vals["type"]=o.type;
                vals["desc"]=o.description;
                vals["link"]=o.link;
                vals["price"]=o.price;
                if(o.numberofitems<=0){
                    itemsoutofstock = vals["key"];
                }
                noofit = o.numberofitems;
                data.ref("cart").child(idnum).child(keys).update(vals).then(()=>{
                    resolve([itemsoutofstock, noofit]);
                });
                
            }else{
                data.ref("cart").child(idnum).child(keys).set(null).then(()=>{
                    resolve([itemsoutofstock, noofit]);
                });
            }
        });
     })
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
    }).catch(error => {
        saveLogs("unknown", page);
    });
}
const endDateofVerification = () =>{
    let d = new Date();
    var n = parseInt(d.getTime())+86400000;
    var x = new Date(n);
    return x.toString();
}

const removeAllCart = (idnum) =>{
    return new Promise((resolve, reject)=>{
        data.ref('cart').child(idnum).remove();
        resolve(true);
    });
}

const updateCart = (idnum, setss) => {
    return new Promise(function (resolve, reject) {
        data.ref('cart').child(idnum).set(setss).then(()=>{
            resolve(true);
        })
    });
}
const checkCart = (setss) => {
    return new Promise((resolve, reject)=>{
        setss['date'] = todaydate();
        data.ref("products").child(setss.key).once('value', (snapshot)=>{

            if(snapshot.val()===null){
                resolve(false);
            }else{
                let r = snapshot.val();
                if(setss.amount>r.numberofitems){
                    resolve(false);
                }else{
                    resolve(true);
                }
        }
        });
    })
   
}

const getHistory = (idn) =>{
    return new Promise((resolve, reject)=>{
        data.ref('ItemsBoughthistory').orderByChild('userid').equalTo(idn).once('value', (snapshot)=>{
            let s = []
            snapshot.forEach((snap)=>{
                s.push([snap.key, snap.val()]);
            });
            resolve(s);
        });
    })
}
const getUpdatedHistory = (idn) =>{
    return new Promise((resolve, reject)=>{
        data.ref('ItemsBoughthistory').orderByChild('status').equalTo('Delivering').once('value', (snapshot)=>{
            let s = []
            snapshot.forEach((snap)=>{
                if(snap.val().userid===idn){
                    s.push([snap.key, snap.val()]);
                }
            });
            resolve(s);
        });
    })
}
const getUpdatedHistory2 = (idn) =>{
    return new Promise((resolve, reject)=>{
        data.ref('ItemsBoughthistory').orderByChild('status').equalTo('Processing').once('value', (snapshot)=>{
            let s = []
            snapshot.forEach((snap)=>{
                if(snap.val().userid===idn){
                    s.push([snap.key, snap.val()]);
                }
            });
            resolve(s);
        });
    })
}
const getUpdatedR3 = (idn) =>{
    return new Promise((resolve, reject)=>{
        data.ref('reservation').orderByChild('status').equalTo('Pending').once('value', (snapshot)=>{
            let s = []
            snapshot.forEach((snap)=>{
                if(snap.val().userid===idn){
                    for(let x of snap.val().items){
                        if(x[1].status === "Processing" || x[1].status === "Delivering"){
                            s.push([snap.key, x[1], snap.val().id]);
                        }
                    }
                }
            });
            resolve(s);
        });
    })
}
const checkIfAcctExist = (idn) =>{
    return new Promise((resolve, reject)=>{
        data.ref('accounts').orderByKey().equalTo(idn).once('value', (snapshot)=>{
            try{
               if(snapshot.val()===null){
                   resolve(false);
               }else{
                    resolve(true);
               }
            }catch(e){
                resolve(false);
            }
            
        });
    })
}

const getAccountDetails = (idn) =>{
    return new Promise((resolve, reject)=>{
        data.ref('accounts').orderByKey().equalTo(idn).once('value', (snapshot)=>{
            try{
                if(snapshot.val()===null){
                    resolve(false);
                }else{
                   snapshot.forEach((d)=>{
                       resolve(d.val());
                   })
                }
            }catch(e){
                resolve(false);
            }
            
        });
    })
}
const deletePROFPIC = (idn) =>{
    return new Promise(function (resolve, reject) {
            let ref = storage.ref(`profilepics/${idn}`);
            
            ref.listAll().then(dir => {
            dir.items.forEach(fileRef => {
                var dirRef = storage.ref(fileRef.fullPath);
                dirRef.getDownloadURL().then(function(url) {
                var imgRef = storage.refFromURL(url);
                imgRef.delete().then(function() {
                    resolve(true);
                }).catch(function(error) {  
                    console.log(error);
                    resolve(true);  
                });
                });
            });
            }).catch(error => {
                console.log(error);
                resolve(true);
            });
            resolve(true);
    });
}

const checkPasswordIfCorrect = (idn, pass) =>{
    return new Promise((resolve, reject) =>{
        data.ref("accounts").child(idn).once("value", (snapshot) =>{
            resolve(snapshot.val().password === pass);
        });
    })

}

const addImage = (idn, image) =>{
    return new Promise((resolve, reject) => {
        const uploadTask = storage.ref(`profilepics`).child(idn).child(image.name).put(image);
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            storage
            .ref(`profilepics/${idn}`)
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                resolve(url);
            });
          }
        );
    })
   
}
const updateACCOUNT = (idn, set) =>{
    return new Promise((resolve, reject) => {
        data.ref("accounts").child(idn).update(set).then((d)=>{
            resolve(true);
        })
      
    })

  }

const updateStatus = (idnum, hid)=>{
    return new Promise((resolve, reject)=>{
     
            data.ref('ItemsBoughthistory').child(hid).update({status: 'Completed', dateDelivered: todaydate()}).then((d)=>{
                data.ref('accounts').child(idnum).once('value', (snapshot)=>{
                    let x = snapshot.val();
                    data.ref('ItemsBoughthistory').child(hid).once('value', (snaps)=>{
                        let y=snaps.val().totalprice;
                        data.ref('accounts').child(idnum).update({totalspent: parseFloat((Number(x.totalspent)+Number(y)).toFixed(2))}).then((d)=>{
                            resolve(true);
                        });
                    });
                });
                
            });
        });

}
const updateAdvStatus = (idnum, hid)=>{
    return new Promise((resolve, reject)=>{
     
            data.ref('reservation').child(hid).update({status: 'Completed', dateDelivered: todaydate()}).then((d)=>{
                data.ref('accounts').child(idnum).once('value', (snapshot)=>{
                    let x = snapshot.val();
                    data.ref('reservation').child(hid).once('value', (snaps)=>{
                        let y=snaps.val().totalprice;
                        data.ref('accounts').child(idnum).update({totalspent: parseFloat((Number(x.totalspent)+Number(y)).toFixed(2))}).then((d)=>{
                            resolve(true);
                        });
                    });
                });
                
            });
        });
}
const cancelorder = (hid, reason)=>{
    return new Promise((resolve, reject)=>{
        data.ref('ItemsBoughthistory').child(hid).update({status: 'Cancelled', reason: reason}).then((d)=>{
            data.ref('ItemsBoughthistory').child(hid).once('value', (snapshot)=>{
                snapshot.val().items.forEach((d)=>{
                    data.ref('products').child(d[1].key).once('value', (snaps)=>{
                        if(snapshot.val()!==null){
                            data.ref('products').child(d[1].key).update({numberofitems: snaps.val().numberofitems+d[1].amount});
                        }
                    });
                })
                resolve(true);
            })
        });
    })
}
const cancelorderR = (hid, reason)=>{
    return new Promise((resolve, reject)=>{
        data.ref('reservation').child(hid).update({status: 'Cancelled' , reason: reason}).then((d)=>{
            resolve(true);
        });
    })
}


const checkIfEmailExist = (email, code) =>{
    return new Promise((resolve, reject)=>{
        try{
            data.ref('accounts').orderByChild('email').equalTo(email).once('value', (snapshot)=>{
                try{
                    if(snapshot.val()===null){
                        resolve(false);
                    }else{
                        snapshot.forEach((snap)=>{
                            data.ref('accounts').child(snap.key).update({code: code}).then((d)=>{
                                resolve(true);
                            });
                        });     
                    } 
                }catch(e){
                    resolve(false);
                }
    
            });
        }
        catch(e){
            resolve(false);
        }
    })
}
const checkCode = (code) =>{
    return new Promise((resolve, reject)=>{
        data.ref('accounts').orderByChild('code').equalTo(code).once('value', (snapshot)=>{
            try{
                if(snapshot.val()===null){
                    resolve([false]);
                }else{
                    snapshot.forEach((snap)=>{
                        resolve([true, snap.key]);
                    });  
                }
            }catch(e){
                resolve([false]);
            }
        });
    })
}

const updatePass = (id, p)=>{
    return new Promise((resolve, reject)=>{
        data.ref('accounts').child(id).update({password: p, code:null}).then((d)=>{
            resolve(true);
        })
    })
}

const getData = (qty) => {
    return new Promise(function (resolve, reject) {
      data.ref("products").once("value", (snapshot) =>{
        let products = [];
        let categories = [];
        let suppliers = [];
        let ratings  = [];
        let qt = [];
        let noofsupp = {

        };
        snapshot.forEach((snap)=>{
            let values = snap.val();
             qt.push(1);
        if(values.comments!==undefined){
            let avgrating = 0;
            let co = 0;
            for(let x in values.comments){
                avgrating+=parseInt(values.comments[x].rating);
                co++;
            }
            if(avgrating!==0){
                ratings.push([parseInt(avgrating/co), co]);
            }
        }else{
            ratings.push([0, 0]);
        }
          if(!(categories.includes(values.type))){
            categories.push(values.type);
          }
          if(!(values.seller in noofsupp)){
            noofsupp[values.seller] = 1;
          }else{
            noofsupp[values.seller] += 1;
          }
          products.push([snap.key, values]);
        });

        for(let x in noofsupp){
            suppliers.push([x, noofsupp[x]]);
        }
        if(JSON.stringify(qt)!==JSON.stringify(qty) && qt.length===qty.length){
            qt=qty;
        }

        resolve([products, categories, suppliers, ratings, qt]);
      });
    });
 }



 const getData2 = (t, v, qty) => {
    return new Promise(function (resolve, reject) {
      data.ref("products").orderByChild(t).startAt(v.toUpperCase()).endAt(v.toLowerCase()+ "\uf8ff").once("value", (snapshot) =>{
        let products = [];
        let categories = [];
        let suppliers = [];
        let ratings  = [];
        let noofsupp = {

        };
        let qt = [];
        snapshot.forEach((snap)=>{
            let values = snap.val();

            qt.push(1);
            if(values[t].toLowerCase().includes(v.toLowerCase())){
            
            if(values.comments!==undefined){
                let avgrating = 0;
                let co = 0;
                for(let x in values.comments){
                    avgrating+=parseInt(values.comments[x].rating);
                    co++;
                }
                if(avgrating!==0){
                    ratings.push([parseInt(avgrating/co), co]);
                }
            }else{
                ratings.push([0, 0]);
            }
            if(!(categories.includes(values.type))){
                categories.push(values.type);
            }
            if(!(values.seller in noofsupp)){
                noofsupp[values.seller] = 1;
            }else{
                noofsupp[values.seller] += 1;
            }
            products.push([snap.key, values]);
            }
        });

        for(let x in noofsupp){
            suppliers.push([x, noofsupp[x]]);
        }
        if(JSON.stringify(qt)!==JSON.stringify(qty) && qt.length===qty.length){
            qt=qty;
        }


        resolve([products, categories, suppliers, ratings, qt]);
      });
    });
 }
 const waitloop = (data) =>{
  return new Promise(function (resolve, reject) {
      
    const l = []
    const y = data[0].length;
    var x=0
    for(x=0; x<Math.ceil(y/6); x++){
        
        l.push(x+1);
    }
    resolve(l)
  });
 }
 const NumberFormat = (n) =>{
    try{
      let g = n.toString().split(".");
      let x = g[0].split("");
        x=x.reverse();
        if(x.length>3){
            for(let i=3; i<x.length; i+=4){
                x.splice(i, 0, ",");
            }
        }
        x.reverse();
       return(g.length===2?x.join("")+"."+g[1]:x.join(""));
      }catch{
        return("0");
      }
  }

  const getAdvanceOrder = (id) =>{
     return new Promise((resolve, reject)=>{
        data.ref('reservation').orderByChild('userid').equalTo(id).once('value', (snapshot)=>{
        let o = [];
        snapshot.forEach((data)=>{
            o.push([data.key,data.val()]);
        });            
        resolve(o);
      })
    });
  }

  const checkDate = (date) =>{
    let next2weeks = new Date();
    next2weeks.setDate(new Date().getDate()+14);
    let tomorrow = new Date();
    tomorrow.setDate(new Date().getDate());

    if(date <= next2weeks && tomorrow <= date){
        return true;
    }else{
        return false;
    }
  }
  const addReceipt = (idn, image)=>{
    return new Promise((resolve, reject) => {
        const uploadTask = storage.ref(`receipt`).child(idn).child(image.name).put(image);
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            storage
            .ref(`receipt/${idn}`)
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                data.ref('ItemsBoughthistory').child(idn).update({receipt: url}).then((ch)=>{
                    resolve(true);
                });
            });
          }
        );
    })
  }
  const deleteReceipt= (idn) =>{
    return new Promise(function (resolve, reject) {
            let ref = storage.ref(`receipt/${idn}`);
            
            ref.listAll().then(dir => {
            dir.items.forEach(fileRef => {
                var dirRef = storage.ref(fileRef.fullPath);
                dirRef.getDownloadURL().then(function(url) {
                var imgRef = storage.refFromURL(url);
                imgRef.delete().then(function() {
                    resolve(true);
                }).catch(function(error) {  
                    console.log(error);
                    resolve(true);  
                });
                });
            });
            }).catch(error => {
                console.log(error);
                resolve(true);
            });
            resolve(true);
    });
}


const getChat = (num, id, func) =>{
   
        data.ref("chat").child(id).limitToLast(num).once("value", (snapshot)=>{
            let o = [];
            snapshot.forEach((d)=>{
                o.push(d.val());
            })
            func(o);
           
        })
  }
  const newMessage = (id) =>{
    return new Promise((resolve, reject)=>{
        data.ref("chat").child(id).limitToLast(1).once("value", (snapshot)=>{
            snapshot.forEach((d)=>{
                resolve({[d.key]:d.val()});
            })
            
        })
    })
  }
  
  const sendChat = ( id, mes) =>{
    return new Promise((resolve, reject)=>{
        data.ref("chat").child(id).push({message: mes, who: 'user', date: new Date().toString(), readbya: false, readbyu:true}).then((d)=>{
            resolve(true);
        })
    });
  }
const getCurrOrder =(id)=>{
    return new Promise((resolve, reject)=>{
        data.ref("reservation").child(id).once("value", (snapshot)=>{
            resolve(snapshot.val());
        })
    })
}
const deleteAdvReceipt= (idn) =>{
    return new Promise(function (resolve, reject) {
            let ref = storage.ref(`reservation-full/${idn}`);
            
            ref.listAll().then(dir => {
            dir.items.forEach(fileRef => {
                var dirRef = storage.ref(fileRef.fullPath);
                dirRef.getDownloadURL().then(function(url) {
                var imgRef = storage.refFromURL(url);
                imgRef.delete().then(function() {
                    resolve(true);
                }).catch(function(error) {  
                    console.log(error);
                    resolve(true);  
                });
                });
            });
            }).catch(error => {
                console.log(error);
                resolve(true);
            });
            resolve(true);
    });
}
const addAdvReceipt = (idn, image)=>{
    return new Promise((resolve, reject) => {
        const uploadTask = storage.ref(`reservation-full`).child(idn).child(image.name).put(image);
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            storage
            .ref(`reservation-full/${idn}`)
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                data.ref('reservation').child(idn).update({proof: url}).then((ch)=>{
                    resolve(true);
                });
            });
          }
        );
    })
  }
  const deleteDownAdvReceipt= (idn) =>{
    return new Promise(function (resolve, reject) {
            let ref = storage.ref(`reservation-down/${idn}`);
            
            ref.listAll().then(dir => {
            dir.items.forEach(fileRef => {
                var dirRef = storage.ref(fileRef.fullPath);
                dirRef.getDownloadURL().then(function(url) {
                var imgRef = storage.refFromURL(url);
                imgRef.delete().then(function() {
                    resolve(true);
                }).catch(function(error) {  
                    console.log(error);
                    resolve(true);  
                });
                });
            });
            }).catch(error => {
                console.log(error);
                resolve(true);
            });
            resolve(true);
    });
}
const addDownAdvReceipt = (idn, image)=>{
    return new Promise((resolve, reject) => {
        const uploadTask = storage.ref(`reservation-down`).child(idn).child(image.name).put(image);
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          () => {
            storage
            .ref(`reservation-down/${idn}`)
            .child(image.name)
            .getDownloadURL()
            .then(url => {
                data.ref('reservation').child(idn).update({downproof: url}).then((ch)=>{
                    resolve(true);
                });
            });
          }
        );
    })
  }


const getProductData = (id) =>{
    return new Promise((resolve, reject)=>{
        data.ref("products").child(id).once('value', (snapshot)=>{
            resolve(snapshot.val());
        })
    })
}
const getProductComments = (id) =>{
    return new Promise((resolve, reject)=>{
        data.ref("products").child(id).child('comments').once('value', (snapshot)=>{
            if(snapshot.val()===null){
                resolve([])
            }else{
                let x = [];
                snapshot.forEach((d)=>{
                    x.push(d.val());
                });
                resolve(x);
            }
          
        })
    })
}
const addAddress = (id, val) =>{
    return new Promise((resolve, reject)=>{
        data.ref("accounts").child(id).child("addresses").push(val).then(()=>{
            resolve(true);
        })
    })
}
const addComment= (id, message, user, rate, email, uid) =>{
    return new Promise((resolve, reject)=>{
        data.ref("products").child(id).child('comments').push({date: new Date().toString(), message: message, user: user, rating: rate, email: email, uid:uid}).then(()=>resolve(true));
    })
}

const removeAddress = (id, id2) =>{
    data.ref("accounts").child(id).child("addresses").child(id2).remove();
}
const setPrimaryAddress = (id, id2, id3)=>{
    data.ref("accounts").child(id).child("addresses").child(id2).update({primary: false}).then(()=>{
        data.ref("accounts").child(id).child("addresses").child(id3).update({primary: true});
    })
}

const getCartLength = (idnum) =>{
    return new Promise((resolve, reject)=>{
        data.ref("cart").child(idnum).once('value', (snapshot)=>{
            resolve(snapshot.numChildren());
        })
    })
}

const getType = (type, seller, mid) =>{
    return new Promise((resolve, reject)=>{
        
        new Promise((resolve, reject)=>{
            data.ref("products").orderByChild("type").equalTo(type).once('value', (snapshot)=>{
                let x = [];
                snapshot.forEach((snap)=>{
                    if(snap.key!==mid){
                         x.push([snap.key, snap.val()]);
                    }
                })
                resolve(x);
            });
        }).then((x)=>{
            let arr = x;
            new Promise((resolve, reject)=>{
                data.ref("products").orderByChild("seller").equalTo(seller).once('value', (snapshot)=>{
                    let x = [];
                    snapshot.forEach((snap)=>{
                        if(snap.key!==mid){
                             x.push([snap.key, snap.val()]);
                        }
                    })
                    resolve(x);
                });
            }).then((p)=>{
                for (let d of p){
                    arr.push(d);
                }
                resolve(arr);
            })
           
        })
        
    })
}

const addAdvanceOrderList = (idn, key, set)=>{
    return new Promise((resolve, reject)=>{
        data.ref("advorderlist").child(idn).orderByChild('key').equalTo(key).once('value', (snapshot)=>{
            if(snapshot.val()===null){
                set["date"] = todaydate();
                set["amount"] = 1;
                data.ref("advorderlist").child(idn).push(set).then(()=>{
                    resolve(true);
                });
            }
        })
        

    })
}

const checkLastKey = (what) =>{
    return new Promise((resolve, reject)=>{
        data.ref(what).limitToLast(1).once('value',(snapshot)=>{
            if(snapshot.val()!==null){
                let v = null;
                snapshot.forEach((s)=>{
                    v=s.val().id;
                });
                resolve((parseInt(v)+11).toString());
            }else{
                resolve('10101');
            }
        })
    })
}
const checkk = async(v,id)=>{
    return new Promise((resolve, reject)=>{
        try{
            data.ref("cart").child(id).orderByChild("key").equalTo(v).once('value', (snapshot)=>{
                if(!snapshot.val()){
                    resolve(false);
                }else{
                    resolve(true);
                }
            })
        }catch(e){
            resolve(false);
        }
        
    })
}
const checkifincart= async(arr, id) =>{
    let x = arr.map(async(d)=>await checkk(d[0], id));
    x = await Promise.all(x);
    return(x);
}

const checkIfItemisBought = (idnum, menuid) =>{
    return new Promise((resolve, reject)=>{
        data.ref("ItemsBoughthistory").orderByChild('userid').equalTo(idnum).once('value', (snapshot)=>{
            snapshot.forEach((snap)=>{
                snap.val().items.forEach((d)=>{
                    if(d[1].key===menuid && snap.val().status === "Completed"){
                        resolve(true);
                    }
                })
            })
            
        })
        data.ref("reservation").orderByChild('userid').equalTo(idnum).once('value', (snapshot)=>{
            snapshot.forEach((snap)=>{
                snap.val().items.forEach((d)=>{
                    if(d[1].key===menuid && d[1].status === "Completed"){
                        resolve(true);
                    }
                })
            })
            resolve(false);
        })
    })
   
}

const readAll = (id, num) =>{
    data.ref("chat").child(id).limitToLast(num).once('value', (snapshot)=>{
        snapshot.forEach((snap)=>{
            data.ref("chat").child(id).child(snap.key).update({readbyu: true});
        })
    })
}
const getAllUnread = (id) =>{
    return new Promise((resolve, reject)=>{
        data.ref("chat").child(id).orderByChild('readbyu').equalTo(false).once('value', (snapshot)=>{
            resolve(snapshot.numChildren());
        })
    })
}


const recLogin  = (id) =>{
    data.ref("accounts").child(id).update({recent: new Date().toString()});
}
const getDatesz = () => {
    return new Promise(function (resolve, reject) {
      data.ref("products").once("value", (snapshot) =>{
        let u = [];
        snapshot.forEach(snap=>{
          let m = []
          for(let v in snap.val().adv){
           m.push([v, snap.val().adv[v]]);
          }
          u.push([snap.key,m])
        });
        resolve(u);
      });
    });
  }

  const getDat = async(id) =>{
    let values = await new Promise((resolve, reject)=>{
        data.ref("products").child(id).once('value', (snapshot)=>{
            
            if(snapshot.val()!==null){
                let o = [];
                for(let x in snapshot.val().adv){
                    o.push([x, snapshot.val().adv[x]]);
                }
                resolve(o);
            }
            resolve(null);
        })
    })
    values = await Promise.all(values);
    return(values);
  }


const getDateforCart = (cartd) =>{
    return new Promise(async(resolve, reject)=>{
        let x = [];
        for(let o of cartd){
            x.push([o[0], await getDat(o[1].key)]);
        }
        resolve(x);
    })
}

export {getUpdatedR3, getDateforCart, getDatesz,recLogin, getAllUnread, readAll, checkIfItemisBought, checkk, checkifincart, getData2, cancelorderR, updateAdvStatus, getUpdatedHistory2, checkLastKey, viewHistory2,updateCartData, addAdvanceOrderList, checkCart, getType, getCartLength, setPrimaryAddress, removeAddress, addAddress, getProductComments, addComment, getProductData, deleteDownAdvReceipt, addDownAdvReceipt, addAdvReceipt,deleteAdvReceipt, getCurrOrder, newMessage, getChat, sendChat, deleteReceipt, addReceipt, checkDate, getAdvanceOrder, NumberFormat,getData, waitloop, updatePass, checkCode, checkIfEmailExist, cancelorder, updateStatus,getUpdatedHistory, viewHistory, updateACCOUNT, addImage, checkPasswordIfCorrect, deletePROFPIC, getAccountDetails, sendContact,checkIfAcctExist, getHistory, updateCart, removeAllCart,addLogs, todaydate, addCart, Reservation, generateCode, endDateofVerification, getCartData, deleteITM, buyItems};
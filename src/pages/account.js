    import React, {useState} from 'react';
import { useHistory} from "react-router-dom";
import { getAdvanceOrder, cancelorderR, cancelorder,addAddress,  removeAddress, updateACCOUNT, addImage, NumberFormat, checkPasswordIfCorrect, deletePROFPIC, addLogs, getHistory, getAccountDetails, setPrimaryAddress} from "./functions.js";
import {cyrb53, encrypt} from "./encdec.js";
import TopSide from "../components/TopSide.js";
import { set } from 'animejs';
import Receipt from "./Receipt2";
const Account = (props)=>{
    const [historyList, setHistoryList] = useState([]);
    const [details, setDetails] = useState([]);
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const [contact, setContact] = useState(null);
    const [confimpass, setConfirmPass] = useState(null);
    const [confirmToSave, setConfirmToSave] = useState(null);
    const [image, setImage] = useState(null);
    const [advanced, setAdvanced] = useState([]);
    const [address, setAddress] = useState([]);
    const [streetno, setNo] = useState(null);
    const [street, setS] = useState(null);
    const [brgy, setBrgy] = useState(null);
    const [city, setC] = useState(null);
    const [region, setR] = useState(null);
    const [addornot, setaorn] = useState(false);
    const [ch, setCh] = useState(false);
    const [primaryindex, setPrimaryindex] = useState(0);
    const [updating, setUpdating] = useState([null, false]);
    const [updating2, setUpdating2] = useState([null, false]);
    const [er1, setEr1] = useState(null);
    const [er2, setEr2] = useState(null);
    const [er3, setEr3] = useState(null);
    const [idToDel, setidToDel] = useState(null);
    const [what, setWhat] = useState(null);
    const [reason, setReason] = useState('');
    const [reserveq, setReserveq] = useState(false);
    const [idtopass, setIdtoP] = useState(null);
    React.useEffect(()=>{
        if(!ch){
            props.setP("Acct");
            addLogs("Accounts");
            props.set(true);
            setCh(true);
        }
        const timer = setTimeout(() => {
            getAccountDetails(props.idnum).then((d)=>{
                setDetails(d);
                let a = [];
                let c = 0;
                for(let b in d.addresses){
                    a.push([b, d.addresses[b]])
                    if(d.addresses[b].primary){
                        setPrimaryindex(c);
                    }
                    c++;
                }
                setAddress(a);
            });
            getHistory(props.idnum).then((u)=>{
                setHistoryList(u);   
            });
            getAdvanceOrder(props.idnum).then((d)=>{
                setAdvanced(d);
            })
          }, 100);
          return () => clearTimeout(timer);
     

    });
    const togglePopup = () => {
        document.getElementById("menu1").scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
        document.getElementById("popup-1").classList.toggle("active");
    }
    const filechange = (e) => {
        if (e.target.files[0]){
            setImage(e.target.files[0]);
            var file = e.target.files[0];
            var reader  = new FileReader();
            reader.onload = function(e)  {
                document.getElementById("image").src = e.target.result;
             }
             reader.readAsDataURL(file);
        }
      };

      const checkPass = () =>{
          return new Promise((resolve, reject)=>{
              resolve(password === confimpass);
          })
      }
      
      const checkImage = (x) =>{
          return new Promise((resolve, reject)=>{
            if(image!==null){
                deletePROFPIC(props.idnum).then((d)=>{
                    console.log(x);
                    if(d){
                        addImage(props.idnum, image).then((d)=>{
                            x.img = d;
                            resolve(x);
                        })
                    }
                });
            }else{
                resolve(x);
            }
          })
       
      }
      const waitforAdding = (address2) =>{
        setUpdating(["Adding address.. Please wait...", true]);
          addAddress(props.idnum, {address: address2, primary: address.length===0?true:false}).then((x)=>{
            if(x){
                setUpdating(["Done!", false]);
            }
          })
      }
      const checkPassChange = (x) =>{
        return new Promise((resolve, reject)=>{
            if(password!==null && password!==''){
                var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
                if(re.test(password)){
                checkPass().then((d)=>{
                    if(d){
                        x.password = cyrb53(password);
                        resolve([x, true]);
                    }else{ 
                        resolve(["Password did not match!", false]);
             }
                })
                }else{ 
                    resolve(['Password should contain special characters, numbers, lowercase, uppercase and must contain 8 characters and above.', false]);

                }
            }else{
                resolve([x,true]);
            }
        });
    }

    const checkPhoneNumber = () =>{
        return new Promise((resolve, reject)=>{
            if(contact!==null && contact!==''){
                let c = /^\d+$/;
                if(c.test(contact)){
                    if(contact.length>10){
                        resolve([contact, true]);
                    }else{
                        resolve(['Enter 11-digit phone number!', false]);
                    }
                }else{
                    resolve(['Enter a valid phone number', false]);
    
                }
            }else{
                resolve([contact, true]);
            }
        })
       
    }
    const encryptvalues = (str1)=>{
        return new Promise((resolve, reject)=>{
            let x = encrypt(str1, "EATSONLINE", 1);
            resolve(x);
        })
      }
    const save = () =>{
        let x = {
            "name": name!==null && name !==''?name:details.name,
            "password": details.password,
            "phoneNumber": contact!==null && contact!==''?contact:details.phoneNumber,
            "img":details.img!==undefined?details.img:null
        }
       
        checkPhoneNumber().then((w)=>{
            if(w[1] || details.guest){
                checkPassChange(x).then((a)=>{
                   
                    if(a[1]){
                        checkImage(a[0]).then((u)=>{
                            updateACCOUNT(props.idnum, u).then((j)=>{
                                if(j){
                                    encryptvalues(u.name).then((d)=>{
                                        setUpdating2(["Account Updated!", false]);
                                    })  
                                }
                            });
                        })
                    }else{
                        if(a[0]==="Password did not match!"){
                 
                            setEr1(a[0]);
                            setEr2(a[0]);
                        }else{
              
                            setEr1(a[0]);
                        }

                    }
                });
            }else{                      
                setUpdating2(["Updating your account.. Please wait...", false]);
                setEr3(w[0]);
            }
        });
            
       
       
    }

    const confirmation = (e) =>{
        e.preventDefault();
        checkPasswordIfCorrect(props.idnum, cyrb53(confirmToSave)).then((d)=>{
            if(d){  
                document.getElementById("popup-1").classList.toggle("active");
                setUpdating2(["Updating your account.. Please wait...", true]);
                
                save();
            }else{
                document.getElementById("popup-1").classList.toggle("active");
                return alert("Password confirmation does not match.");
            }
        })
    }
    const history = useHistory();
    const toReceipt = (e, hid) =>{
        props.setAID(false);
        props.cart(hid);
        history.push('/receipt');
    }
    const toReceipt2 = (e, hid) =>{
        props.setAID(true);
        props.cart(hid);
        history.push('/receipt');
    }

    const cancel = (e, hid) =>{
        e.preventDefault();
        if(what==="T"){
            cancelorder(hid, reason).then((d)=>{
                if(d){
                    getHistory(props.idnum).then((u)=>{
                        getAccountDetails(props.idnum).then((d)=>{
                            setDetails(d);
                            setHistoryList(u);
                            setReason('');
                            document.getElementById("reas").value = "";
                            document.getElementById("popup-2").classList.toggle("active"); setidToDel(d[0])
                        });
                    })
                }
            });
        }else{
            cancelorderR(hid, reason).then((d)=>{
                if(d){
                    getHistory(props.idnum).then((u)=>{
                        getAdvanceOrder(props.idnum).then((d)=>{
                            setDetails(d);
                            setHistoryList(u);
                            setReason('');
                            document.getElementById("reas").value = "";
                            document.getElementById("popup-2").classList.toggle("active"); setidToDel(d[0])
                        });
                    })
                }
            })
        }
    }



    const close = () =>{
        document.getElementById("popup-3").classList.toggle("active");
        setReserveq(false);
        setIdtoP(null);
    }
    const guestSave=()=>{setUpdating2(["Updating your account.. Please wait...", true]);save()}
    return(
        <div>
              <TopSide first="Your " second="Account" third={'Total Spent: ₱'+NumberFormat(details.totalspent)} desc={"\"Manage your personal details.\""} img={["./assets/img/0 NEW SLIDER/Account.png"]} right={false}/>
            {/* <section id="hero" className="d-flex align-items-center">
            <div id="myCarouel" className="fullscreen carousel slide " data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="item active">
                            <img src="./assets/img/alinglucingSisig.jpg"  style={{width:'100%', backgroundPosition: 'center bottom', opacity: 0.2}}/>
                        </div>
                    </div>
                        <a className="left carousel-control" href="#myCarousel" data-slide="prev" id="prev" style={{visibility: 'hidden'}}>
                            <span className="glyphicon glyphicon-chevron-left"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="right carousel-control" href="#myCarousel" id="right" style={{visibility: 'hidden'}}>
                            <span className="glyphicon glyphicon-chevron-right"></span>
                            <span className="sr-only">Next</span>
                        </a>
                       
                    </div>
            <div className="container position-relative text-center text-lg-start" data-aos="zoom-in" data-aos-delay="100">
                <div className="row">
                    <div className="col-lg-10">
                        <h1 style={{fontFamily: 'Alex Brush', fontSize: '90px', textAlign: 'center'}}>Your <span style={{fontFamily: 'Alex Brush'}}>Account</span></h1>
                        <h5 style={{fontSize:'30px', textAlign: 'center', color:'#aa2b1d'}}>" Manage your personal details "</h5>
                        &nbsp;&nbsp;&nbsp;&nbsp;<h3 style={{fontSize:'30px', textAlign: 'center', color: '#aa2b1d'}}>Total Spent: <strong>₱{NumberFormat(details.totalspent)}</strong></h3>
                        </div>
                </div>
            </div>
      
        </section> */}
        <main id="main">
        <section id="menu1" className="menu section-bg">
        <div className="row"> 
            <center>
            <div className="row">
             {/* popup */}
                <div className="accountpopup" id="popup-2">
                    <div className="overlay"></div>
                        <div className="accountcontent1">
                            <div className="close-btn" onClick={(e) => document.getElementById("popup-2").classList.toggle("active")}>&times;</div>
                            <br/>
                            <form onSubmit={(e)=>cancel(e, idToDel)}>
                                <h1 id="popuptitle" style={{color: 'black', fontSize: '20px'}}>Are you sure, you want to cancel your order?</h1>
                                {/* Reason:  */}
                                <textarea className="form-control" placeholder="Reason..." id = "reas" onChange={(e)=>setReason(e.target.value)} style={{height: '120px'}} required={true}/>
                                <p style={{color: 'red'}}>Note: Kindly type your reason for cancellation of order. </p> 
                                <input type="submit" className="btn btn-danger my-cart-btn" value="Yes" style={{fontSize: '15px'}}/>&nbsp;&nbsp;&nbsp;
                                <input type="button" className="btn btn-danger my-cart-btn" data-id="1" onClick={(e)=>document.getElementById("popup-2").classList.toggle("active")} /*data-summary="summary 1" data-price="100" data-quantity="1" data-image="assets/img/Eats Online logo.png"*/ value="No"  style={{fontSize: '15px'}}/>
                            </form>
                        </div>
                </div>

                <div className="billingpopup" id="popup-3">
                    <div className="overlay"></div>
                        <div className="billingcontent1">
                            <div className="close-btn" onClick={(e) => close()}>&times;</div>
                            <br/>
                            <form onSubmit={()=>cancel(idToDel)}>
                            <br/>
                                {/* Biling  */}
                                {idtopass!==null?
                                    <div className="my-custom-scrollbar3">
                                <Receipt reserve={reserveq} set = {props.set}  idnum = {props.idnum} hid={idtopass}/>
                                </div>:null
                                }
                                
                              {/*  <input type="button" className="btn btn-danger my-cart-btn" data-id="1" onClick={(e)=>document.getElementById("popup-3").classList.toggle("active")} /*data-summary="summary 1" data-price="100" data-quantity="1" data-image="assets/img/Eats Online logo.png" value="Close"  style={{fontSize: '15px'}}/>*/}
                            </form>
                        </div>
                </div>
                    <div className="col-lg-15">
                    <h1>Account Details</h1>
                    </div>
            </div>
            <div className="container">
            <div className="row1">
                <div className="accountpopup" id="popup-1">
                    <div className="overlay"></div>
                    <div className="accountcontent1">
                    <div className="close-btn" onClick={togglePopup}>&times;</div>
                    <br/>
                    <form>
                        <h1 id="popuptitle">Enter your password to confirm.</h1>
                        <br/>
                        <input className="form-control" id="password2" type="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={(e)=>setConfirmToSave(e.target.value)} required={true}/>
                        <br/>
                        <input type="submit" className="btn btn-danger my-cart-btn" data-id="1" data-name="Product 1" onClick={confirmation}
                                    data-summary="summary 1" data-price="100" data-quantity="1" data-image="assets/img/Eats Online logo.png" value="Confirm"/>
                            
                        </form>
                    </div>
                    </div>
                </div>
                <div>
                   
                    <div className="col-md-4 text-center">               
                        <img className="menu-img" id="image" src={details.img===undefined?"./assets/img/Eats Online logo.png":details.img} alt=""/><br/>
                        <center> {!details.guest?<input className="form-control" type="file" style={{width: "63.4%"}} accept="image/*" onChange={filechange}/>:null}</center>
                    </div>
                    <div className="col-md-8 text-center"><br/>
                        <div className="row">
                            <h4 style={{color: 'black', textAlign: 'start', marginTop: '10px'}}>Name:</h4>
                            <input className="form-control" id="name" placeholder={details.name} onChange={(e)=>!details.guest?setName(e.target.value):null} readOnly={details.guest}/>
                            <h4 style={{color: 'black', textAlign: 'start', marginTop: '10px'}}>Email:</h4>
                            <input className="form-control" id="email"  placeholder={details.email} readOnly={true}/>
                            {!details.guest?<h4 style={{color: 'black', textAlign: 'start', marginTop: '10px'}}>Password:</h4> :null}
                            {!details.guest?<input className="form-control" id="password" type="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={(e)=>setPassword(e.target.value)} />:null}
                            {password!==null && password!==''?<span id="passw" style={{color:'red', textAlign: 'start'}}>{er1}</span>:null}
                            {password!==null && password !== ''?<h4 style={{color: 'black', textAlign: 'start', marginTop: '10px'}}>Repeat password:</h4>:null}
                            {   (()=>{
                                    if((password!==null && password!=='')){
                                        return(<input className="form-control" id="confirmpassword" type="password" placeholder="Confirm Password" onChange={(e)=>setConfirmPass(e.target.value)} />);
                                    }
                                })()
                            }
                            {password!==null && password!==''?<span id="rpassw" style={{color:'red', textAlign: 'start'}}>{er2}</span>:null}
                            <h4 style={{color: 'black', textAlign: 'start', marginTop: '10px'}}>Phone Number:</h4>
                            <input className="form-control" id="phonenumber" type="number" placeholder={details.phoneNumber} onChange={(e)=>setContact((e.target.value).toString())}/>
                            {(image!==null)||(name!==null && name!=='') || (password!==null && password!=='') || (contact!==null && contact!=='')?<span id="contactnum" style={{color:'red', textAlign: 'start'}}>{er3}</span>:null}
                            {   (()=>{
                                    if((image!==null)||(name!==null && name!=='') || (password!==null && password!=='') || (contact!==null && contact!=='')){
                                        return(updating2[1]?
                                            <div>
                                               <br/>
                                               <p style={{color: 'blue', textAlign: 'start'}}>{updating2[0]}</p>
                                            </div>:
                                            <div>
                                                {updating2[0]==="Account Updated!"?<div><br/>
                                               <p style={{color: 'green', textAlign: 'start'}}>{updating2[0]}</p></div>:null}
                                                
                                               <br/>
                                               <input input type="button" className="form-1" value="Save" style={{width: '50%', marginTop: '20px'}} onClick={()=>{!details.guest?togglePopup():guestSave()}}/>
                                            </div>);
                                    }
                                })()
                            }
                            
                        </div>
                        <br/>
                        <h3 style={{color: 'black', textAlign: 'start'}}>Address</h3>
                        <hr style={{color: 'black'}}/>
                        <div className="row" style={{width: 'auto'}}>
                       {address.map((d, i)=>{
                           return(<div key={i}>
                            <hr style={{color: '#aa2b1d', height: '5px'}}/>
                               <input key={i} readOnly={true} className="form-control" value={d[1].address} id={"chAdd"+i} style={{borderWidth: '0', height:'auto', marginBottom: '12px'}} />
                               {d[1].primary?<h5 style={{color: 'black', textAlign: 'end'}}><span>Primary Address</span></h5>
                               :<h5 style={{color: 'black', textAlign: 'end'}}>
                                   <span onClick = {()=>setPrimaryAddress(props.idnum, address[primaryindex][0], d[0])}style={{cursor: 'pointer', color: 'black',  textDecoration: 'underline'}} onMouseOver={(e)=>{e.target.style.color="blue"}} onMouseOut={(e)=>{e.target.style.color="black"}} >Set as Primary address</span> 

                                   <span style={{marginLeft: '18px', cursor:'pointer', color:'black', textDecoration: 'underline'}} onMouseOver={(e)=>{e.target.style.color="red"}} onMouseOut={(e)=>{e.target.style.color="black"}} onClick={()=>removeAddress(props.idnum, d[0])}>Remove</span>
                                </h5>}</div>);
                       })}
                       {address.length===0?<div><h5 style={{color: 'black', textAlign: 'start'}}>No registered address!</h5><br/></div>:null}
                        
                        <input type="button" className="form-1" style={{width: 'auto', borderRadius: '50px'}} value={!addornot?"+ Add Address":"Cancel"} onClick={()=>{addornot?setaorn(false):setaorn(true); setUpdating([null, false])}}/>
                        {addornot?<form onSubmit={(e)=>{e.preventDefault();  waitforAdding(street);}}>
                        <h4 style={{color: 'black', textAlign: 'start'}}><span className="required">*</span>Full Address</h4>
                            <input className="form-control" placeholder="Full Address" onChange={(e)=>setS(e.target.value)} required={true}/>
                            
                        
                            {/*<h4 style={{color: 'black', textAlign: 'start'}}><span className="required">*</span>City:</h4>
                            <input className="form-control" placeholder="City" onChange={(e)=>setC(e.target.value)} required={true}/>
                            <h4 style={{color: 'black', textAlign: 'start'}}><span className="required">*</span>Region:</h4>
                    <input className="form-control" placeholder="Region" onChange={(e)=>setR(e.target.value)} required={true}/>*/}
                            {updating[1]?
                            <div>
                               <br/>
                               <p style={{color: 'blue', textAlign: 'start'}}>{updating[0]}</p>
                            </div>:
                            <div>
                                {updating[0]==="Done!"?<div><br/>
                               <p style={{color: 'green', textAlign: 'start'}}>{updating[0]}</p></div>:null}
                                
                               <br/>
                                <input className="form-1" type="submit" value="Add" id="addadd" style={{width: '50%'}}/>
                            </div>}
                            
                           
                        </form>:null}
                        </div>
                    </div>
                    
                </div>
            </div>
            </center>
        </div>
       
        </section>

        <section id="history" className="menu section-bg1" >
        <hr style={{width: '100%', color: 'black'}}/>
            <div className="row" >   
                <center>
                <div className="row" > 
                    <div className="col-lg-15">
                    <h1>Purchase History</h1>
                    <h5 style={{fontSize:'20px'}}>Transaction History: {details.name}</h5> 
                    </div>
                </div>
                <div style={{padding: '70px'}} >
                    {/* table-wrapper-scroll-y my-custom-scrollbar2 */}
                    <div className="row" >
                        <div className="overflow-x" >
                            <table className="table">
                                <thead className="thead-dark" style={{fontSize:'18px', padding: '20px 20px'}}>
                                    <tr>
                                        <th>No.</th>
                                        <th>Order ID</th>
                                        <th>Order Date</th>   
                                        <th>Order Item</th>
                                        <th>Total Price</th>
                                        <th>Order Status</th>
                                        <th style={{textAlign: 'center'}}>View Order</th>
                                        <th>Cancel Order</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {historyList.map((d,index)=>{
                                    return( 
                                    <tr key={index} >
                                        <td data-label="No." style={{cursor:'pointer', fontSize:'15px'}} onClick={(e)=>{toReceipt(e, d[0])}}>{index+1}</td>
                                        <td data-label="Item ID"  style={{cursor:'pointer', fontSize:'15px' }} onClick={(e)=>{toReceipt(e, d[0])}}>{d[1].id}</td>
                                        <td data-label="Date" style={{cursor:'pointer', fontSize:'15px'}} onClick={(e)=>{toReceipt(e, d[0])}}>{new Date(d[1].dateBought).toDateString()} {new Date(d[1].dateBought).toLocaleTimeString()}</td>
                                        <td data-label="Items" style={{cursor:'pointer', fontSize:'15px', textAlign: 'center'}} onClick={(e)=>{toReceipt(e, d[0])}}>{d[1].items.length}</td>
                                        <td data-label="TotalPrice" style={{cursor:'pointer', fontSize:'15px'}} onClick={(e)=>{toReceipt(e, d[0])}}>₱{NumberFormat(d[1].totalprice)}</td>
                                        <td data-label="Status" style={{cursor:'pointer'}} onClick={(e)=>{toReceipt(e, d[0])}} ><div className="flex-btn"></div>    
                                            <p style={{fontSize:'15px'}} className={d[1].status==="Pending" || d[1].status==="Delivering" || d[1].status==="Cancelled"?d[1].status==="Cancelled"?"label label-error":d[1].status==="Pending" ?"label label-warning":"label label-info":"label label-success"}>{d[1].status}</p></td>
                                            <td style={{textAlign: 'center'}} onClick={(e)=>{setIdtoP(d[0]); setReserveq(false); document.getElementById("popup-3").classList.toggle("active"); }}><i class="fas fa-receipt" style={{cursor:'pointer'}}>View</i></td>
                                        {d[1].status==="Pending"?<td data-label="Cancel Order" style={{textAlign: 'center'}}><i className="fas fa-trash-alt btndelete" style={{cursor:'pointer'}} onClick={(e)=>{setidToDel(d[0]); setWhat("T"); document.getElementById("popup-2").classList.toggle("active"); }}></i></td>:<td data-label="Cancel Order" >---</td>}
                                    </tr> 
                                    );
                                })}
                                        
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                </center>
            </div>
        </section>
        <section id="advhistory" className="menu section-bg" >
        <hr style={{width: '100%', color: 'black'}}/>
            <div className="row" >   
                <center>
                <div className="row" > 
                    <div className="col-lg-15">
                    <h1>Advance Order</h1>
                    <h5 style={{fontSize:'20px'}}>Order By: {details.name}</h5> 
                    </div>
                </div>
                <div style={{padding: '70px'}} > 
                    <div className="row">
                        <div className="overflow-x">
                            <table className="table">
                                <thead className="thead-dark" style={{fontSize:'18px'}}>
                                    <tr>
                                        <th>No.</th>
                                        <th>Order ID</th>
                                        <th>Order Date</th>
                                        <th>Delivery Date and Time</th>
                                        <th>Total Price</th>
                                        <th>Total Price of item</th>
                                        <th>Payment Status</th>
                                        <th>Total Item</th>
                                        <th>Message</th>
                                        <th>Order Status</th>
                                        <th style={{textAlign: 'center'}}>View Order</th>
                                        <th style={{textAlign: 'center'}}>Cancel  Order</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {advanced.map((d,index)=>{
                                    return(
                                    <tr key={index} >
                                        <td data-label="No." style={{cursor:'pointer'}} onClick={(e)=>{toReceipt2(e, d[0])}}>{index+1}</td>
                                        <td data-label="Order ID" style={{cursor:'pointer'}} onClick={(e)=>{toReceipt2(e, d[0])}}>{d[1].id}</td>
                                        <td data-label="Order Date" style={{cursor:'pointer'}} onClick={(e)=>{toReceipt2(e, d[0])}} >{new Date(d[1].dateBought).toDateString()} {new Date(d[1].dateBought).toLocaleTimeString()}</td>
                                        <td data-label="Delivery Date and Time" style={{cursor:'pointer'}} onClick={(e)=>{toReceipt2(e, d[0])}}>{new Date(d[1].date).toDateString()} {new Date(new Date(d[1].date).toDateString()+" "+d[1].time).toLocaleTimeString()}</td>
                                        <td data-label="Total Price" style={{cursor:'pointer'}} onClick={(e)=>{toReceipt2(e, d[0])}}>₱{NumberFormat(d[1].totalprice)}</td>
                                        <td data-label="Balance" style={{cursor:'pointer'}} onClick={(e)=>{toReceipt2(e, d[0])}}>₱{NumberFormat(Number(d[1].balance))}</td>
                                        <td data-label="Payment Status" style={{cursor:'pointer'}} onClick={(e)=>{toReceipt2(e, d[0])}}>{d[1].pstatus}</td>
                                        <td data-label="Total Item" style={{cursor:'pointer',textAlign: 'center'}} onClick={(e)=>{toReceipt2(e, d[0])}}>{d[1].items.length}</td>

                                        <td data-label="Message" style={{cursor:'pointer'}} onClick={(e)=>{toReceipt2(e, d[0])}}>{d[1].message}</td>
                                        <td data-label="Order Status" style={{cursor:'pointer'}} onClick={(e)=>{toReceipt2(e, d[0])}}><div className="flex-btn"></div>    
                                            <p style={{cursor:'pointer'}} onClick={(e)=>{toReceipt2(e, d[0])}} className={d[1].status==="Pending" || d[1].status==="Delivering" || d[1].status==="Cancelled"?d[1].status==="Cancelled"?"label label-error":d[1].status==="Pending" ?"label label-warning":"label label-info":"label label-success"}>{d[1].status}</p></td>
                                            <td style={{textAlign: 'center'}}  onClick={()=>{setIdtoP(d[0]); setReserveq(true);  document.getElementById("popup-3").classList.toggle("active");}}><i class="fas fa-receipt" style={{ cursor:'pointer'}}>View</i></td>
                                        {d[1].status==="Pending"?<td data-label="Cancel Order" style={{textAlign: 'center'}} ><i className="fas fa-trash-alt btndelete" style={{cursor:'pointer'}} onClick={(e)=>{setidToDel(d[0]); setWhat("R"); document.getElementById("popup-2").classList.toggle("active"); }}></i></td>:<td data-label="Cancel Order">---</td>}
                                        
                                    </tr>
                                    );
                                })}
                                        
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                </center>
            </div>
        </section>
        </main>
        <footer id="footer">
            <div className="footer-top " style={props.legitkey===true && props.logedin===true && props.idnum!==null? {backgroundColor: '#353333'}:{backgroundColor: '#353333', color: 'black'}}>
                <div className="container">
                    
                    <div className="row">
                        <div col-lg-3="true" col-md-6="true">
                            <div className="footer-info">
                                <div className="section-title">
                                <h2>Eats Online</h2>
                                </div>
                                <p style={props.legitkey===true && props.logedin===true && props.idnum!==null?null:{color: 'black'}}>
                                <strong style={props.legitkey===true && props.logedin===true &&  props.idnum!==null?null:{color: 'black'}}>Location:</strong> 19, Via Milano St., Villa Firenze, Quezon City, Philippines <br></br>
                                    <strong style={props.legitkey===true && props.logedin===true && props.idnum!==null?null:{color: 'black'}}>Open Hours:</strong> Monday-Saturday: 9:00 AM-5:00 PM<br></br>
                                    <strong style={props.legitkey===true && props.logedin===true &&  props.idnum!==null?null:{color: 'black'}}>Phone:</strong> 09157583842<br></br>
                                    <strong style={props.legitkey===true && props.logedin===true && props.idnum!==null?null:{color: 'black'}}>Email: </strong> EATSONLINE.2021@gmail.com<br></br>
                                </p>
                                <div className="social-links mt-3">
                                    <a href="#hero" className="facebook"><i className="bx bxl-facebook"></i></a>
                                    <a href="#hero" className="instagram"><i className="bx bxl-instagram"></i></a>
                                    <a href="#hero" className="twitter"><i className="fab fa-google-plus-g"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container" >
                <div className="copyright">
                    &copy; Copyright <strong><span>Eats Online</span></strong>. All Rights Reserved
                </div>
            </div>
        </footer>
        </div>
    );
}
//hahahha wait try ko
//ayan okay na
export default Account;
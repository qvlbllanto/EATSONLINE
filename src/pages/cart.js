import React, {useState} from 'react';
import { useHistory, Link } from "react-router-dom";
import {updateCartData, checkCart, checkPasswordIfCorrect, removeAllCart, addLogs,  getCartData, buyItems,  updateCart,  NumberFormat, getAccountDetails, checkDate, Reservation} from "./functions.js";
import {cyrb53} from "./encdec.js";
import TopSide from "../components/TopSide.js";
import { set } from 'animejs';
const Cart = (props)=>{
    const [cart, setCart] = useState([]);
    const [amount, setAmount] = useState(0);
    const [buyorsave, setbuyorsave]=useState(null);
    const [accountD, setAccountD] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [ch,setCh] = useState(false);
    const [primaryadd, setPrimaryAdd] = useState(null);
    const [outofstock, setOutofStock] = useState([]);
    const [higherthan, setHigherthan] = useState([]);
    const [itemQty, setItemQty] = useState([]);
    const [ind, setInd] = useState(0);
    const [checkboxes, setCheckBoxes] = useState([]);
    const [totalamt, setTotalamt] = useState(0);
    const [date, setDate] = useState(null);
    const [valuesCh, setvaluesCh] = useState([]);
    const [valuesCh2, setValuesCh2] = useState([]);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [time, setTime] = useState(null);
    const [message, setMessage] = useState(null);
    const [check, setCheck] = useState(false);
    const [orderm, setOrderm] = useState([false, false]);
    const [processing, setProcessing] = useState(false);
    const [res, setRes] = useState(false);
    React.useEffect(()=>{
        if(!ch){
            props.setP("Cart");
            addLogs("Cart");
            props.set(true);
            setCh(true);   
        }
    const timer = setTimeout(() => {
        getCartData(props.idnum).then((x) =>{
            setCart(x);
            updateStock(x);
            let num = 0;
            let totalcartamt = 0;
            for (let i of cart) {
                if(checkboxes.includes(i[0])){
                    num+=Number(i[1].price)*i[1].amount;
                }
                totalcartamt+=Number(i[1].price)*i[1].amount;
            }
            setTotalamt(Number(totalcartamt).toFixed(2));
            setAmount(Number(num).toFixed(2));
            console.log(checkboxes);
        });
            checkifHighRepeat();
            getAccountDetails(props.idnum).then((d)=>{
                setAccountD(d);
                let arr = [];
                for(let x in d.addresses){
                    arr.push(d.addresses[x]);
                    if(d.addresses[x].primary){
                        setPrimaryAdd(d.addresses[x]);
                    }
                }
                setAddresses(arr);
            });

      }, 300);
      return () => clearTimeout(timer);
    });
    const updateStock = async(v) =>{
        let x = v.map(async(d)=>await updateCartData(props.idnum, d[1], d[0]));
        x = await Promise.all(x);
        setItemQty(arrayRemove(  x.map((d)=>d[1]), null));
        setOutofStock(arrayRemove( x.map((d)=>d[0]), null));
    }
    const open = (e, ch) =>{
        e.preventDefault();
        if(orderm[1]){
            checkDateIncal().then((x)=>{
                if(x===null){
                    togglePopup(ch);
                }else{
                    alert(x);
                }
            })
        }else{
         togglePopup(ch);
        }
    }
    const togglePopup = (ch) => {
        setbuyorsave(ch);
        if(ch===null){
            document.getElementById("popup-1").classList.toggle("active");
        }
        if(ch==="Save"){
            document.getElementById("popup-1").classList.toggle("active");
        }
        if(cart.length!==0 && ch==="Buy"){
            document.getElementById("popup-1").classList.toggle("active");
        }else if(ch==="Buy"){
            alert("Nothing to "+ch);
        }
    }
    const countMoneyNotInDB = (c) =>{
        return new Promise((resolve, reject)=>{
            let x=c;
            let num = 0;
            let totalcartamt = 0;
            for (let i in x) {
                if(checkboxes.includes(x[i][0])){
                num+=Number(x[i][1].price)*x[i][1].amount;
                }
                totalcartamt+=Number(x[i][1].price)*x[i][1].amount;
            }
            setTotalamt(Number(totalcartamt).toFixed(2));
            resolve(Number(num).toFixed(2));
        });
    }

    const arrayRemove = (arr, value) => { 
        return arr.filter(function(ele){ 
            return ele !== value; 
        });
    }
    const arrayRemove2 = (arr, value) => { 
        return arr.filter(function(ele){ 
            return ele[0] !== value; 
        });
    }
    const checkifHighRepeat = async() =>{
        let x = cart.map(async(d)=>!await checkCart(d[1])?d[1].key:null);
        x = await Promise.all(x);
        setHigherthan(arrayRemove(x, null));
    }
    const checkifHighRepeat2 = async() =>{
        let x = cart.map(async(d)=>!await checkCart(d[1])?checkboxes.includes(d[0])?[d[0],d[1].key]:null:null);
        x = await Promise.all(x);
        return(arrayRemove(x, null));
    }
    const checkifHigh = () =>{
        let x = cart.map((d)=>checkboxes.includes(d[0])?higherthan.includes(d[1].key)?d[1].title:null:null);
        return(arrayRemove(x, null));
    }
    const buyNow = () =>{
        return new Promise(async(reso, reje)=>{
                const v = await checkifHighRepeat2();
                if(v.length===0 || res){
                    setProcessing(true);
                    let x1 = null;
                    if(orderm[0]){
                     x1 = document.getElementById('asx').checked?document.getElementById('asx').value:document.getElementById('bsx').checked?document.getElementById('bsx').value:null;
                    }
                     if(cart.length!==0){
                        new Promise((resolve, reject)=>{
                            let x = [];
                            let x2 = {};
                            for(let v of cart){
                                if(checkboxes.includes(v[0])){
                                    x.push(v);
                                }else{
                                    x2[v[0]]=v[1];
                                }
                            }
                            resolve([x,x2]);
                        }).then((ca)=>{
                            if(orderm[1]){
                            Reservation( accountD.name, accountD.email, accountD.phoneNumber, date, time, message, ca, props.idnum, amount, document.getElementById("selection").value, accountD.id).then((dx)=>{
                                props.setAID(true);
                                props.cart(dx);
                                reso([true]);
                            });
                            }else{
                                buyItems(ca, amount, props.idnum, accountD.name,document.getElementById("selection").value, x1, accountD.phoneNumber, accountD.id).then((x)=>{
                                    if(x[0]){
                                        props.setAID(false);
                                        props.cart(x[1]);
                                        reso([true]);
                                    }
                                });
                            }
                        });
                    }
                }else{
                    document.getElementById("popup-1").classList.toggle("active");
                    document.getElementById("popup-2").classList.toggle("active");
                
                }
        });

        
    }
     
    const confirmIfAdv = (conf) =>{
        buy2(conf).then((d)=>{
            if(d[0]){
                setProcessing(false);
                history.push('/receipt');
            }
        })
    }

    const buy2 = (clickY) =>{
        return new Promise((reso, reje)=>{
            setProcessing(true);
            let x1 = null;
            if(orderm[0]){
                x1 = document.getElementById('asx').checked?document.getElementById('asx').value:document.getElementById('bsx').checked?document.getElementById('bsx').value:null;
            }
                if(cart.length!==0){
                new Promise((resolve, reject)=>{
                    let x = [];
                    let x2 = {};
                    let count = 0;
                    let toBeAdvanceval = new Array();
                    let advamount = 0;
                    for(let v of cart){
                        if(checkboxes.includes(v[0])){
                            if(v[1].amount > itemQty[count]){
                                let newval = {};
                                let remaining = v[1].amount - itemQty[count];
                                newval.amount = remaining;
                                for(let i in v[1]){
                                    if(i!=="amount"){
                                        newval[i] = v[1][i];
                                    }
                                }
                                toBeAdvanceval.push([v[0], newval]);
                                advamount += Number(remaining*v[1].price);
                                v[1].amount = itemQty[count];
                                if(itemQty[count]>0){
                                    x.push(v);
                                }
                            }else{
                                x.push(v);
                            }
                        }else{
                            x2[v[0]]=v[1];
                        }
                        count++;
                    }
                    let newtotalprice = amount;
                    newtotalprice-=advamount;
                    resolve([x,x2, toBeAdvanceval, advamount, newtotalprice]);
                }).then((ca)=>{
                    const nv = [ca[2], ca[1]];
                    let nextDay = new Date();
                    nextDay.setDate(nextDay.getDate() + 3); 
                    if(!clickY){
                        buyItems(ca, Number(ca[4]).toFixed(2), props.idnum, accountD.name,document.getElementById("selection").value, x1, accountD.phoneNumber, accountD.id).then((x)=>{
                            if(x[0]){
                                props.setAID(false);
                                props.cart(x[1]);
                                reso([true]);
                            }
                        });
                    }else{
                        if(ca[0].length>0){
                            buyItems(ca, Number(ca[4]).toFixed(2), props.idnum, accountD.name,document.getElementById("selection").value, x1, accountD.phoneNumber, accountD.id).then((x)=>{
                                if(x[0]){
                                    Reservation( accountD.name, accountD.email, accountD.phoneNumber, nextDay, nextDay.toLocaleTimeString(), message, nv, props.idnum, Number(ca[3]).toFixed(2), document.getElementById("selection").value, accountD.id).then((dx)=>{
                                        props.setAID(false);
                                        props.cart(x[1]);
                                        reso([true]);
                                    });
                                }
                            });
                        }else{
                            Reservation( accountD.name, accountD.email, accountD.phoneNumber, nextDay, nextDay.toLocaleTimeString(), message, nv, props.idnum, Number(ca[3]).toFixed(2), document.getElementById("selection").value, accountD.id).then((dx)=>{
                                props.setAID(true);
                                props.cart(dx);
                                reso([true]);
                            });
                        }
                        
                    }
                });
            }
        })
       
    }

    const add = (e, index) =>{
        let i = cart;
        i[index][1].amount += 1;
        setCart(i);
        document.getElementById("textbox"+index).innerHTML=i[index][1].amount;
        countMoneyNotInDB(cart).then(d=>{
            setAmount(d);
            saveToDB();
        });
    }
    const minus = (e, index) =>{
        let i = cart;
        if(i[index][1].amount > 1){
            i[index][1].amount -= 1;
            setCart(i);
            document.getElementById("textbox"+index).innerHTML=i[index][1].amount;
            countMoneyNotInDB(cart).then(d=>{
                setAmount(d);
                saveToDB();
            });
        }
    }

    const saveToDB = () =>{
        new Promise((resolve, reject)=>{
            let p = {};
            for(let ca of cart){
                p[ca[0]]=ca[1];
            }
            resolve(p);
        }).then((ful)=>{
            updateCart(props.idnum, ful);
        })

        
        // removeAllCart(props.idnum).then((x)=>{
        //     if(x){
        //         new Promise(()=>{
        //             countMoneyNotInDB(cart).then(o=>{
        //                 setAmount(o);
        //                 alert("Saved!");
        //                 document.getElementById("popup-1").classList.toggle("active");
        //             });
        //         })
        //     }
        // })
        
    }
    const confirmation = () =>{
        if(buyorsave==="Buy"){
            buyNow().then((d)=>{
                if(d[0]){
                    setProcessing(false);
                    history.push('/receipt')
                }
            });
        }else{
                new Promise((resolve, reject)=>{
                    let x = cart;
                    
                    x = arrayRemove2(x, ind);
                    let p = {};
                    for(let ca of x){
                        p[ca[0]]=ca[1];
                    }
                    
                    resolve([p,x]);
                }).then((ful)=>{
                    updateCart(props.idnum, ful[0]).then(()=>{
                        setCart(ful[1]);
                        togglePopup(null);
                    });
                })
            }
        
    }

    const selectAll = (e) =>{
        let x = [];
        if(e.target.checked){
            for(let i=0; i<cart.length; i++){
                document.getElementById("check"+i).checked = true;
                x.push(cart[i][0]);
            }
            setCheckBoxes(x);
        }else{
            for(let i=0; i<cart.length; i++){
                document.getElementById("check"+i).checked = false;
            }
            setCheckBoxes(x);
        }
        
    }

    const clickCheck = (e, i) =>{
        new Promise((resolve, reject)=>{
            let checkb = checkboxes;
            if(e.target.checked){
                checkb.push(i);
            }else{
                document.getElementById("allcheck").checked = false;
                checkb = arrayRemove(checkb, i);
            }
            resolve(checkb);    
        }).then((k)=>{
            setCheckBoxes(k);
            countMoneyNotInDB(cart).then((x)=>{
                setAmount(x);
            });
        })
       
        
    }
    const checkDateIncal = () =>{
        return new Promise((resolve, reject)=>{
            if(checkDate(new Date(date))){
                let o = [];
                valuesCh.forEach((d)=>{
                    o.push(d);
                })
                setValuesCh2(o);  
                resolve(null); 
            }else{
               resolve("Date should start tomorrow and within the 2 weeks.");
            }
        })
        
    }

    const valuesForReservation = (e) =>{
        if(e.target.name === "name"){
            setName(e.target.value);
        }else if(e.target.name === "email"){
            setEmail(e.target.value);
        }else if(e.target.name === "phone"){
            setPhone(e.target.value);
        }else if(e.target.name === "date"){
            setDate(e.target.value);
        }else if(e.target.name === "time"){
            setTime(e.target.value);
        }else if(e.target.name === "message"){
            setMessage(e.target.value);
        }
      }

    const togglePopup2 = () => {
        document.getElementById("popup-1").classList.toggle("active");
    }
    const history = useHistory();



    return(
        <div>
              <TopSide right={false} first="Your " second="Cart" third={'Total cart price: ₱'+ NumberFormat(totalamt)} desc={"Manage your order here!"} img={["./assets/img/0 NEW SLIDER/Cart.png"]}/>
           {/* <section id="hero" className="d-flex align-items-center">
           <div id="myCarouel" className="fullscreen carousel slide " data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="item active">
                            <img src="./assets/img/bigbetterburger.png" style={{width:'100%', backgroundPosition: 'center bottom'}}/>
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
                        <h1 style={{fontFamily: 'Alex Brush', fontSize: '90px'}}>Your Cart</h1>
                        </div>
                        <div className="row">
                            <span type="text" className="input">{'Total cart price: ₱'+ NumberFormat(amount)} </span>
                        </div>
                    </div>
                </div>
        </section> */}
        <main id="main">
            <section id="menu" className="menu section-bg"> 
            <div className="row1">
                <div className="cartpopup" id="popup-1">
                    <div className="overlay"></div>
                    <div className="cartcontent1">
                    <div className="close-btn" onClick={(e) => togglePopup(null)}>&times;</div>
                    <br/>
                        <form>
                            <h1 id="popuptitle" style={{color: 'black'}}>Are you sure?</h1>
                            <br/>
                            {processing?
                                <span>Please Wait...</span>:
                                <div>
                                <input type="button" className="btn btn-danger my-cart-btn"  onClick={()=>confirmation()} value="Yes" style={{fontSize: '15px'}}/>&nbsp;&nbsp;&nbsp;
                                <input type="button" className="btn btn-danger my-cart-btn" data-id="1"onClick={(e)=>togglePopup(null)}
                                data-summary="summary 1" data-price="100" data-quantity="1" data-image="assets/img/Eats Online logo.png" value="No"  style={{fontSize: '15px'}}/>
                        </div>}</form>
                    </div>
                    </div>
                </div>
                <div className="row1">
                <div className="advancepopup" id="popup-2">
                    <div className="overlay"></div>
                    <div className="advancecontent1">
                    <div className="close-btn" onClick={(e) => document.getElementById("popup-2").classList.toggle("active")}>&times;</div>
                    <br/>
                    <form>
                        <h1 id="popuptitle" style={{color: 'black'}}>Some products exceeded the stock, do you want to advance order?</h1>
                     <br/>
                     {processing?
                     <span>Please Wait...</span>:
                     <div>
                     <input type="button" className="btn btn-danger my-cart-btn"  onClick={()=>confirmIfAdv(true)} value="Yes" style={{fontSize: '15px'}}/>&nbsp;&nbsp;&nbsp;
                     <input type="button" className="btn btn-danger my-cart-btn" data-id="1" onClick={()=>confirmIfAdv(false)}
                    data-summary="summary 1" data-price="100" data-quantity="1" data-image="assets/img/Eats Online logo.png" value="No"  style={{fontSize: '15px'}}/>
                       </div> }
                    </form>
                    </div>
                    </div>
                </div>
                <div className="container">
                    <div className="section-title">
                        <h2>Food List</h2>
                        <p>My Orders</p>
                    </div>
                
                    <div className="container-fluid">
                    <div className="row" >
                        <div className="col-md-10 col-11 mx-auto"  >
                               <div className="row">
                                <div className="col-md-12 col-lg-8 col-11 mx-auto main_cart">
                                    <div style={{boxShadow:'0 3px 20px #aa2b1d', margin:'10px', padding:'10px'}}>
                                    <h2 className="py-4 font-weight-bold">My Orders: {accountD.name}</h2>  
                                    
                                    <hr/>
                                    <label style= {{display: 'inline'}}><input type="checkbox" className="checkbox"  id="allcheck" style={{display: 'inline'}} onClick={selectAll}/> &nbsp;&nbsp;All Items</label>
                                </div>
                                       
                                        {cart.map((d, index)=>{
                                            return(
                                            
                                            <div className="card p-4" key={index+20} style={{boxShadow:'0 3px 20px #aa2b1d', margin:'10px'}}> 
                                             <div className="row"  >
                                               
                                             <input type="checkbox" className="checkbox" id={"check"+index} onClick={(e)=>clickCheck(e, d[0])} style={{position: 'relative', marginLeft: '-44%', marginRight: '100%'}}/>
                                             <div className="col-md-5 col-11 mx-auto d-flex justify-content-center product_img" style={{paddingTop: '20px'}}>
                                                <img src={d[1].link} className="img-fluid" alt={d[1].link} style={{padding:'10px', background:'transparent'}}/>
                                             </div>
                                             <div className="col-md-7 col-11 mx-auto px-4 mt-2">
                                                   <br/>
                                                 <div className="row">
                                                     
                                                         <h2 className="mb-4">{d[1].title}</h2>
                                                         <p className="mb-2">{d[1].desc}</p>
                                                         <p className="mb-2">Supplier: {d[1].seller}</p>
                                                         <p className="mb-2">Type: {d[1].type}</p>
                                                         <p className="mb-2">Stock: {itemQty[index]} </p>
                                                         <p className="mb-3">Price: <span style={{fontSize: '15px'}}>₱</span>{NumberFormat(Number(d[1].price).toFixed(2))}</p>
                                                     <br/>
                                                     <p className="mb-3">Quantity: </p>
                                                     <ul className="pagination">
                                                            <li className="page-item" ><span type="text" style={{height:'100%'}} key={index} className="page-link" id={"textbox"+index}>{d[1].amount}</span>
                                                             </li>
                                                             <li className="page-item">
                                                             <button className="page-link" onClick={(e) => add(e, index)}> <i className="fas fa-plus"></i></button>
                                                             </li>
                                                             <li className="page-item">
                                                             <button className="page-link" onClick={(e)=>minus(e, index)} style={{borderRadius: '30px'}}><i className="fas fa-minus"></i> </button>
                                                             </li>
                                                         </ul>
                                                 </div>
                                                 <div className="row">
                                                     <div className="col-8 d-flex remove_wish">
                                                         <a className="fas fa-trash-alt" style={{cursor:'pointer'}} name = {index} onClick={(e)=>{setInd(d[0]); togglePopup("Save");}} >&nbsp; Delete</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                     </div>
                                                     
                                                 </div>
                                                 <br/>
                                             </div>
                                         </div>
                                         </div>);
                                        })}
                                         
                                </div>
                                <div className="col-md-12 col-lg-4 col-11 mx-auto">
                                <div className="right_side p-4 bg-white">
                                        <div className="my-custom-scrollbar" >
                                            <div className="row" >
                                                <div className="overflow-x" >
                                                    <center>
                                                <label >Purchase Order</label>
                                                </center>
                                                    <table className="table" style={{fontSize:'13px', width: '100%'}}>
                                                    <thead className="thead-dark" >
                                                        <tr style={{width:'100%', fontSize:'17px'}}>
                                                            <th>Name</th>
                                                            <th>Qty</th>
                                                            <th>Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {cart.map((d, index)=>{
                                                    return(
                                                        checkboxes.includes(d[0])?
                                                    <tr key={index}>
                                                        <td data-label="Name">{d[1].title} </td>
                                                        <td data-label="Qty" >{d[1].amount}</td>
                                                        <td data-label="Price"><span id="total_cart_amt"><span style={{fontSize: '15px'}}>₱</span>{NumberFormat(Number(Number(d[1].price)*d[1].amount).toFixed(2))}</span></td>
                                                    </tr>:null);
                                                    })}
                                                    </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                            <hr />
                                            <div>
                                            </div>
                                            <div className="">
                                                <form onSubmit={(e)=>open(e, "Buy")}>
                                                    <div className="form-group">
                                                    
                                                    <label className="control-label"> <span className="required">*</span>Order Method: </label>
                                                    <label>
                                                        <input type="radio" name="colorRadio2" id="opr" value="C.O.D" required={true} onClick={()=>{setRes(false);setOrderm([true, false])}}/> Order Now
                                                        <input type="radio" name="colorRadio2" id="oaor" value="Online Payment" style={{marginLeft: '10px'}} required={true} onClick={()=>{setRes(true);setOrderm([false, true])}} /> Advance Order
                                                    </label>
                                                    <hr/>
                                                    {orderm[0]? <div>
                                                        <h2 style={{color: '#97191d'}}>ORDER NOW</h2>
                                                        <br/>
                                                        <label className="control-label"> <span className="required">*</span>Payment Method: </label>
                                                        <label>
                                                            <input type="radio" name="colorRadio" id="asx" value="C.O.D"  required={true} /> Pay C.O.D 
                                                            <input type="radio" name="colorRadio" id="bsx" value="Online Payment"   style={{marginLeft: '10px'}} required={true}/> Online Payment
                                                        </label>
                                                        <hr/>
                                                    </div>
                                                    :
                                                    orderm[1]?
                                                    <div>
                                                    <h2 style={{color: '#97191d'}}>ADVANCE ORDER</h2>
                                                    <br/>
                                                    <div data-aos="fade-up" data-aos-delay="100">
                                                            <div className="row">
                                                                <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
                                                                <label className="inline"><span className="required">*</span>Date: </label>
                                                                    <input type="date" name="date" className="form-control" id="date" placeholder="Date"  onChange={valuesForReservation} required={true}/>
                                                                    <div className="validate"></div>
                                                                </div>
                                                                
                                                                <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
                                                                <label className="inline"><span className="required">*</span>Time: </label>
                                                                    <input type="time" className="form-control" name="time" id="time" placeholder="Time" onChange={valuesForReservation} required={true}/>
                                                                    <div className="validate"></div>
                                                                </div>
                                                            
                                                    
                                                            </div>
                                                                <div className="form-group mt-3">
                                                                <label className="inline">Message: </label>
                                                                    <textarea className="form-control" name="message" rows="5" placeholder="Message" onChange={valuesForReservation}></textarea>
                                                                    <div className="validate"></div>
                                                                </div>

                                                                <hr/>
                                                                </div>
                                                                {/* <div className="text-center"><input type="submit" className="reservation-btn scrollto d-lg-flex" value="Order Now" style={{borderRadius: '50px'}}/></div> */}
                                                        </div>
                                                        :null}
                                                    <div>
                                                    <label className="control-label">Address:</label>
                                                        <select style={{width:'100%', fontSize:'16px'}} id="selection">
                                                                {addresses.length===0?<option>No registered address.</option>:null}
                                                                {primaryadd!==null?<option value={primaryadd.address}>{primaryadd.address}</option>:null}
                                                                {addresses.map((d, index)=>{
                                                                    return(!d.primary?<option key={index} value={d.address} >{d.address}</option>:null);
                                                                })}
                                                        </select>
                                                        
                                                    {addresses.length===0?<h5>You need to have an address to continue. To add an address, go to account page. <span style={{textDecoration:'underline', color: 'black', cursor: 'pointer'}} onMouseOver={(e)=>{e.target.style.color='blue';}} onMouseOut={(e)=>{e.target.style.color='black';}} onClick={()=>history.push("/account")}>Click here to go to account page</span></h5>:null}
                                                    <br/><br/>
                                                    <div className="total-amt d-flex font-weight-bold" style={{textAlign: 'start',}}>
                                                        <br/> 
                                                        <p style={{marginRight: '10px',  fontWeight: 'bold',}}>Total Amount: </p>
                                                        <p style={{fontWeight:'bold', textAlign:'start'}}><span id="total_cart_amt"><span style={{fontSize: '15px'}}>₱</span>{NumberFormat(amount)}</span></p>
                                                    </div>
                                                    
                                                   {addresses.length!==0 && cart.length!==0 && checkboxes.length!==0 ?<button type="submit" className="reservation-btn scrollto d-lg-flex" >Order Now</button>:null}
                                                   {/* {checkifHigh().length !== 0?<p style={{marginRight: '100px'}}>Some Items exceeded the stock quantity or out of stock, please lower the value or delete the item. Items ({checkifHigh().map((d,i)=>i===0?<span style={{fontWeight: 'bold', color: 'red'}}>{d}</span>:<span>, <span style={{fontWeight: 'bold', color: 'red'}}>{d}</span></span>)})</p>:null } */}
                                                   </div>
                                                   </div>
                                                </form>
                                            </div>
                                        </div>
                                        </div>
                                                        
                                        </div>  
                                    </div>
                                </div>
                            </div>
                        </div>
                </section>
            </main>
            <footer id="footer">
            <div className="footer-top " style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{backgroundColor: '#faff65'}:{backgroundColor: 'white', color: 'black'}}>
                <div className="container">
                    
                    <div className="row">
                        <div col-lg-3="true" col-md-6="true">
                            <div className="footer-info">
                                <div className="section-title">
                                <h2>Eats Online</h2>
                                </div>
                                <p style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?null:{color: 'black'}}>
                                <strong style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?null:{color: 'black'}}>Location:</strong> 19, Via Milano St., Villa Firenze, Quezon City, Philippines <br></br>
                                    <strong style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?null:{color: 'black'}}>Open Hours:</strong> Monday-Saturday: 9:00 AM-5:00 PM<br></br>
                                    <strong style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?null:{color: 'black'}}>Phone:</strong> 09157483872<br></br>
                                    <strong style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?null:{color: 'black'}}>Email: </strong> EATSONLINE.2021@gmail.com<br></br>
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
export default Cart; 

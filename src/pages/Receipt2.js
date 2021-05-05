import React, {useState} from 'react'; 
import { useHistory, Link } from "react-router-dom";
import {updateAdvStatus, deleteReceipt, addReceipt, checkPasswordIfCorrect, viewHistory,viewHistory2, updateStatus, addLogs, NumberFormat, addAdvReceipt, deleteAdvReceipt} from "./functions.js";
import {cyrb53} from "./encdec.js"
import axios from 'axios';
import $ from 'jquery';
const Receipt = (props) => {
    const [totalamt, setAmount] = useState(0);
    const [items, setItems] = useState({id: '',status:'', items:[]});
    const [con1, setConfirm] = useState(false);
    const [pw, setPw] = useState(null);
    const [image, setImage] = useState(null);
    const [tab, setTab] = useState([false, false, false]);
    React.useEffect(()=>{
        addLogs("Receipt");
        if(props.reserve){
            viewHistory2(props.hid).then((d)=>{
                console.log(d);
                setItems(d);
                let num = 0;
                for (let i of d.items){
                    num+=(i[1].price*i[1].amount);
                }
                setAmount(Number(num).toFixed(2));
            })
        }else{
            viewHistory(props.hid).then((d)=>{
                console.log(d);
                setItems(d);
                let num = 0;
                for (let i of d.items){
                    num+=(i[1].price*i[1].amount);
                }
                setAmount(Number(num).toFixed(2));
            })
        }
    }, []);

    const submitReceipt = (e) =>{
        e.preventDefault();
        document.getElementById("sub").style.visibility="hidden";
        deleteReceipt(props.hid).then((d)=>{
            addReceipt(props.hid, image).then((d)=>{
                document.getElementById("sub").style.visibility="visible";
                alert("Submitted");
            });
        });
       
    }
    const submitReceipt2 = (e) =>{
        e.preventDefault();
        document.getElementById("sub").style.visibility="hidden";
        deleteAdvReceipt(props.hid).then((d)=>{
            addAdvReceipt(props.hid, image).then((d)=>{
                document.getElementById("sub").style.visibility="visible";
                alert("Submitted");
            });
        });
       
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
    const confirm = (e) =>{
        e.preventDefault();
        checkPasswordIfCorrect(props.idnum, cyrb53(pw)).then((d)=>{
            if(d){
                updateStatus(props.idnum, props.hid).then((a)=>{
                    
                    if(a){
                    viewHistory(props.hid).then((x)=>{
                        setItems(x);
                        let num = 0;
                        for (let i of x.items){
                            num+=(i[1].price*i[1].amount);
                        }
                        setAmount(Number(num).toFixed(2));
                    });
                    }
                });
            }
        });
    }
    const confirm2 = (e) =>{
        e.preventDefault();
        checkPasswordIfCorrect(props.idnum, cyrb53(pw)).then((d)=>{
            if(d){
                updateAdvStatus(props.idnum, props.hid).then((a)=>{
                    
                    if(a){
                    viewHistory2(props.hid).then((x)=>{
                        setItems(x);
                        let num = 0;
                        for (let i of x.items){
                            num+=(i[1].price*i[1].amount);
                        }
                        setAmount(Number(num).toFixed(2));
                    });
                    }
                });
            }
        });
    }
    const done1 = () =>{
        if (con1) 
        {
            setConfirm(false); 
        }else 
        {
            setConfirm(true);
        }
    }
    const history = useHistory();
    const goHome = () =>{
        history.push('/account');
     }
     
     $(document).ready(function(){
        $('input[type="radio"]').click(function(){
            var inputValue = $(this).attr("value");
            var targetBox = $("." + inputValue);
            $(".box").not(targetBox).hide();
            $(targetBox).show();
        });
    });

    
    return(
        <div  className="overflow"  style={{borderRadius: '20px'}}>
        {/* <div style={{backgroundImage: "url('/assets/img/BACKGROUND IMAGE 2.png')", height: '100%', position: 'absolute', width: '100%'}}></div> */}
            {/* <div className="container-fluid2" style={{overflow: 'auto'}}>
                
                <div className="row" > 
                    
                    <div className="col-md-10 col-11 mx-auto" >
                        <div className="row mt-5 gx-3">*/}
                       
                            {/* <div className="col-md-12 col-lg-8 col-11 mx-auto main_cart" > */}
                                <div className="card p-4"style={{marginRight: '50px'}} style={{borderRadius: '20px' }} >
                                <p style={{fontSize: '40px', fontFamily: 'cursive'}}><img src="assets/img/Eats Online logo.png" style={{height: '50px', width: '40px', marginRight: '50px'}}/>Eats Online </p>
                                    <h1 className="product_name" style={{fontSize:'20px', textAlign: 'center'}}>BILLING<br/></h1>
                                    <div className="p-4 shadow bg-white"> 
                                        <h5 style={{color:'black'}}>Name:  <strong style={{fontSize:'12px', color:'#000000'}}>{items.name}</strong></h5>
                                        <h5 style={{color:'black', left: 50}}>Order Id: <strong style={{fontSize:'15px', color:'#000000'}}>{items.id}</strong></h5>
                                        <h5 style={{color:'black', left: 50}}>Phone: {items.phone}</h5>
                                        <h5 style={{color:'black', left: 50}}>Address:  {items.address}</h5>
                                        <h5 style={{color:'black', left: 50}}>Order Date: {new Date(items.dateBought).toDateString()} {new Date(items.dateBought).toLocaleTimeString()}</h5>
                                        {props.reserve?<h5 style={{color:'black'}}>Delivery Date and Time: {new Date(items.date).toDateString()} {new Date(new Date(items.date).toDateString()+" "+items.time).toLocaleTimeString()}</h5>:null}
                                        {props.reserve?<h5 style={{color:'black'}}>Message:  {items.message}</h5>:null}
                                        <div className="my-custom-scrollbar" >
                                            <div className="row" >
                                                <div>
                                                    <table className="table" style={{width:'100%'}}>
                                                    <thead className="thead-dark" >
                                                        <tr>
                                                            <th><h5 style={{color:'black'}}><strong>Name</strong></h5></th>
                                                            <th><h5 style={{color:'black'}}><strong>Quantity</strong></h5></th>
                                                            <th><h5 style={{color:'black'}}><strong>Price</strong></h5></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="thead-dark">
                                                    {items.items.map((val,index)=>{
                                                        return(
                                                            <tr key={index}>
                                                                <td data-label="Name">{val[1].title}</td>
                                                                <td data-label="Qty" style={{paddingLeft:'40px'}}>{val[1].amount}</td>
                                                                <td data-label="Price">₱{NumberFormat(Number(val[1].price*val[1].amount).toFixed(2))}</td>
                                                            </tr>
                                                            /*<p style={{fontSize: '15px'}}>{val[1].title} x{val[1].amount}</p>
                                                            &nbsp;&nbsp;
                                                        <p>₱{Number(val[1].price*val[1].amount).toFixed(2)}</p> */
                                                             );
                                                        })}
                                                    </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                            <div className="total-amt d-flex justify-content-between font-weight-bold">
                                                    <p style={{fontWeight: 'bold'}}>The total amount of (including VAT)</p>
                                                    <p style={{fontWeight: 'bold', fontSize: '20px'}}>₱<span id="total_cart_amt" style={{fontWeight: 'bold', fontSize: '20px'}}>{NumberFormat(totalamt)}</span></p>
                                            </div>
                                    </div>
                                </div>
                            {/* </div> */}
                                    {/* <div className="col-md-12 col-lg-4 col-11 mx-auto" > */}
                                        
                                        {/* <div className="p-4 shadow bg-white" style={{borderRadius: '20px'}}>
                                            <h5 style={{color:'black'}}>Order Status: {items.status.toUpperCase()}</h5>
                                            {items.status==="Cancelled"?<h5 style={{color:'black'}}>Reason for Cancellation:</h5>:null}
                                            {items.status==="Cancelled"?<p style={{fontWeight:'normal', color:'#97191d'}}>{items.reason}</p>:null}
                                            <h5 style={{color:'black'}}>Payment Status: {items.pstatus}</h5>
                                            {!props.reserve?<h5 style={{color:'black'}}>Payment Mode: {items.payment}</h5>:null}
                                            {items.status.toUpperCase()==="DELIVERING"?
                                            <div className="total-amt d-flex justify-content-between font-weight-bold">
                                                    <p style={{fontWeight: 'bold'}}>Delivery fee</p>
                                                    <p style={{fontWeight: 'bold', fontSize: '20px'}}>₱<span id="total_cart_amt"  style={{fontWeight: 'bold', fontSize: '20px'}}>{items.deliveryfee}</span></p>
                                            </div>:null}
                                            {items.pstatus==="Not Paid" && (items.payment === "Online Payment"||props.reserve) && items.status === "Pending" ?
                                            <div className="pt-5">
                                                <div className="card">
                                                    <ul className="nav nav-pills mb-3"> 
                                                        <li><a href="#nav-tab-card" className="nav-link" data-toggle="pill" style={tab[0]?{fontSize: '13px' ,backgroundColor:  '#97191d', color: 'white'}:{fontSize: '13px'}} onClick={()=>setTab([true, false, false])}>Upload Receipt</a></li>
                                                        {/* start comment <li><a href="#nav-tab-bank" className="nav-link" data-toggle="pill"><i className="fa fa-credit-card"></i>Online Payment Details</a></li>
                                                        &nbsp;&nbsp;&nbsp;<li><a href="#nav-tab-bank1" className="nav-link" data-toggle="pill"><i className="fa fa-credit-card"></i>Gcash Details</a></li> // end comment
                                                        <a href="#" className="nav-link" data-toggle="pill" id="c" style={{visibility:'hidden'}}></a>
                                                        <li className="dropdown" style={{cursor:'pointer'}} onClick={(e)=>{document.getElementById("c").click();}}>
                                                            
                                                            <a className="dropdown-toggle" data-toggle="dropdown"  style={tab[1] || tab[2]?{fontSize: '13px' ,backgroundColor:  '#97191d', color: 'white'}:{fontSize: '13px'}} >Online Payment Details</a>
                                                            <ul className="dropdown-menu nav nav-pills mb-3" >
                                                                <li  style={{width:'100%'}}><a href="#nav-tab-bank" className="nav-link" data-toggle="pill" style={tab[1]?{backgroundColor:  '#97191d', color: 'white'}:{backgroundColor: 'white', color: 'black'}}  onClick={()=>setTab([false, true, false])}>Bank Details</a></li>
                                                                <li  style={{width:'100%' }}><a href="#nav-tab-bank1" className="nav-link" data-toggle="pill" style={tab[2]?{left: '-1.3%', backgroundColor:  '#97191d', color: 'white'}:{left: '-1.3%',backgroundColor: 'white', color: 'black'}} onClick={()=>setTab([false, false, true])}> Gcash Details</a></li>                     
                                                            </ul>
                                                        </li>
                                                       
                                                    </ul>
                                                </div>
                                                <div className="tab-content p-3">
                                                    
                                                    <div className="tab-pane fase text-center" id="nav-tab-card">
                                                     <label style={{color: 'red'}}>Note: Only <span>JPEG</span> and <span>PNG</span> is accepted!</label> 
                                                        <img id="image" style={{width:'100%'}}/><br/>
                                                        <p className="text-left">Upload Receipt</p>
                                                        <form >
                                                         <input type="file" className="btn btn-primary" accept="image/*" onChange={filechange} style={{width:'100%'}} required={true}/>
                                                         <br/>
                                                         <input type="button" onClick={image!==null?props.reserve?submitReceipt2:submitReceipt:null} id="sub" className="btn btn-primary" value="Submit Receipt"/>
                                                         </form>
                                                    </div>

                                                    <div className="tab-pane fade" id="nav-tab-bank">
                                                        <p>Bank account details</p>
                                                        <dl>
                                                            <dt>BANK:</dt>
                                                            <dd>BANK NAME</dd>
                                                            <dt>Account Number:</dt>
                                                            <dd>account number</dd>
                                                        </dl>
                                                        <p><strong>Note:</strong>You can pay here!</p>                          
                                                    </div>
                                                    <div className="tab-pane fade" id="nav-tab-bank1">
                                                        <p>Gcash account details</p>
                                                        <dl>
                                                            <dt>ACCOUNT NAME:</dt>
                                                            <dd>name</dd>
                                                            <dt>Mobile Number:</dt>
                                                            <dd>mobile number</dd>
                                                        </dl>
                                                        <p><strong>Note:</strong>You can pay here!</p>                          
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            :null
                                        }
                                        <br/><br/>
                                            
                                            {items.status==='Delivering'?<div><button type="button" className="btn btn-primary" onClick={done1} style={{borderRadius: '50px'}}>{!con1?'Item Received':'Cancel'}</button>
                                            <p style={{fontSize:"13px", marginTop: '5px', color:'green'}}><strong>Note:</strong> Click only if the items are received successfully</p></div> :null}
                                    
                                            {con1 && items.status==='Delivering'?<form  style={{borderRadius: '50px'}} > 
                                                <span style={{fontSize:"13px"}}>Please Enter your password to confirm</span>
                                                <input type="password" className="form-control"placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={(e)=>setPw(e.target.value)} required={true} />
                                                <br/> <input type="submit" className="btn btn-primary" id="confirm" value="Confirm" onClick={(e)=>pw!==null?props.reserve?confirm2(e):confirm(e):null} style={{borderRadius: '50px'}} />
                                            </form>
                                            :null}<br/>
                                </div> */}
                            {/* </div> */}
                            </div>
                // </div>
                // </div>
                
        //     </div>  
        // </div>
    );
}
export default Receipt;
 
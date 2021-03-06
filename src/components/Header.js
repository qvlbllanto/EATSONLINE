import React, {useState} from 'react';
import { useHistory, Link } from "react-router-dom";
import {getUpdatedR3, recLogin, getAccountDetails, getUpdatedHistory, getCartLength, getUpdatedHistory2} from '../pages/functions.js';
import Chat from "../pages/Chat.js";

const Header = (props) =>{
    const history = useHistory();
    const box = document.getElementById('box');
    const [notifArr, setNotifArr] = useState([]);
    const [notifArr2, setNotifArr2] = useState([]);
    const [notifArr3, setNotifArr3] = useState([]);
    const [accountD, setAccountD] = useState({});
    const [cart, setCart] = useState(0);
    const down = false;
    const [ch, setCh] = useState(false);
    const [ch2, setCh2] = useState(false);
    const [count, setCount] = useState(0);
    React.useEffect(()=>{
        if(!ch){
            
            const script = document.createElement("script");
            script.src = process.env.PUBLIC_URL + "/assets/js/main.js";
            script.async = true;
            document.body.appendChild(script);
            setCh(true);
        }
        if(props.logedin && props.legitkey===true){
        const timer = setTimeout(() => {
            if(!ch2){
                recLogin(props.idnum);
                setCh2(true);
            }
            getAccountDetails(props.idnum).then((d)=>{
                setAccountD(d);
            });
            getUpdatedHistory(props.idnum).then((d)=>{
                setNotifArr(d);
            });
            getUpdatedHistory2(props.idnum).then((o)=>{
                setNotifArr2(o);
            });
            getUpdatedR3(props.idnum).then((d)=>{
                setNotifArr3(d);
                
            })
            getCartLength(props.idnum).then((d)=>{
                setCart(d);
            })
   
            if(count===120){
                recLogin(props.idnum);
                setCount(0);
            }else{
                setCount(count+1);
            }
          }, 200);
          return () => clearTimeout(timer);
        }
        
    });
  
    const goLogin = () =>{
        history.push('/login');
    }
    const logout = () =>{
        new Promise((resolve, reject)=>{
            localStorage.setItem('userID', null);
            localStorage.setItem('ifloggedin', false);
            localStorage.setItem('idValues', null);
            resolve(true);
        }).then((d)=>{
            props.checkLoggedIn(false, null, null);
            window.location.reload(false);
        })
        
        
    }	
    
    const toggleNotifi = () => {
        if (down) {
            box.style.height  = '0px';
            box.style.opacity = 0;
            down = false;
	    }else {
            box.style.height  = '510px';
            box.style.opacity = 1;
            down = true;
	    }
    }

    const goToReceipt = (id) =>{
        props.hid(id);
        history.push("/receipt");
    }
    return(<div>
        
         <header id="header" className="fixed-top d-flex align-items-cente">
            <div className="container-xl d-flex align-items-center justify-content-lg-between">
            <h1 className="logo me-auto me-lg-0"><a href="/"><img alt="eats" src="./assets/img/eatsonlinelogo.png"/></a></h1>
            
           {props.logedin && props.legitkey? <nav id="navbar2" className="navbar2" id="reserve" style={{right: '40px'}}>
                
                <li className="dropdown" style={{listStyleType: 'none'}}>

                        <a> <i className="fa fa-bell" style={{color: '#017a73'}}></i>{notifArr.length+notifArr2.length+notifArr3.length!==0?<span className="icon-button__badge">{notifArr.length+notifArr2.length+notifArr3.length}</span>:null}</a>
                        {notifArr.length+notifArr2.length+notifArr3.length!==0?<ul style={{width: '300px', left: '-240px'}}>
                        <div style={{ 
                            height: '200px',
                            overflowX: 'hidden',
                            overflowY: 'auto'
                        }}>
                        {notifArr.map((d, index)=>{
                            return(<li key={index} style={{padding:"8px"}} onClick={()=>goToReceipt(d[0])}>
                                <h6 style={{ cursor: 'pointer', color:'black'}}><span>Item</span> {d[1].id} <span>is now being delivered. Items: {d[1].items.length}</span></h6>
                                <hr/>   
                            </li>);
                        })}
                        {notifArr2.map((d, index)=>{
                                    return(<li key={index} style={{padding:"8px"}} onClick={()=>goToReceipt(d[0])}>
                                        <h6 style={{ cursor: 'pointer', color:'black'}}><span>Item</span> {d[1].id} <span>is now being processed. Items: {d[1].items.length}</span></h6>
                                      <hr/>   
                                    </li>);
                                })}
                        </div>
                    </ul>:null}
                        
                </li> 
                <li className="dropdown" style={{listStyleType: 'none', position:'absolute', top: '-6px', left: '-65px'}}>
                <Link className={props.p==="Cart"?"nav-link scrollto active":"nav-link scrollto"}  to="/cart"><span><i className="fa fa-shopping-cart"></i>{cart!==0?<span className="icon-button__badge" style={{position: 'absolute', left: '60%',top:'-8px'}}>{cart}</span>:null}</span></Link>
               

                    </li> 
               
            </nav>:null}
            <nav id="navbar" className="navbar" style={{margin:'-10px'}}>
            <ul id={!props.logedin? "leftsideelogout": "leftsidee"}>
                <li id="right10"><Link className={props.p==="Home"?"nav-link scrollto active":"nav-link scrollto"} to="/" style={{textDecoration:'none', marginLeft: 'auto', marginRight: 'auto', }}>Home</Link></li>

                <li id="right10"><Link className={props.p==="Menu"?"nav-link scrollto active":"nav-link scrollto"} to="/menu" style={{textDecoration:'none', }}>Products</Link></li>
 
                {/*<li id="right10"><Link className={props.p==="Advance"?"nav-link scrollto active":"nav-link scrollto"}  to={props.logedin?"/advance":"/login"} style={{textDecoration:'none'}} >Advance Order</Link></li> */}
            </ul>
                <ul>
                <li id="left10"><Link className={props.p==="Home"?"nav-link scrollto active":"nav-link scrollto"} to="/" style={{textDecoration:'none', marginLeft: 'auto', marginRight: 'auto', textShadow: '#000 0px 0px 3px, #000 0px px 3px, #000 0px 0px 3px'}}>Home</Link></li>

                <li id="left10"><Link className={props.p==="Menu"?"nav-link scrollto active":"nav-link scrollto"} to="/menu" style={{textDecoration:'none'}}>Products</Link></li>

            {/* <li id="left10"><Link className={props.p==="Advance"?"nav-link scrollto active":"nav-link scrollto"}  to={props.logedin?"/advance":"/login"} style={{textDecoration:'none'}} >Advance Order</Link></li>  */}

                             { 
                    (() => {
                        if(props.logedin || props.legitkey){
                            return (<div><li className="dropdown"><Link to="#"className={props.p==="Acct"?"nav-link scrollto active":"nav-link scrollto"} style={{textDecoration:'none'}}><span>Account <i className="fa fa-user fa-2x"></i></span> <i className="bi bi-chevron-down"></i></Link>
                            <ul>
                                <li style={{padding: '10px',}} ><h4 style={{color:'black',  fontWeight: 'bold', color: '#017A73'}}>{accountD.name}</h4></li>
                                <li><Link className={props.p==="Acct"?"nav-link scrollto active":"nav-link scrollto"} to="/account" style={{textDecoration:'none',fontSize: '15px'}}>Account</Link></li>
                                <li><Link to="#" style={{textDecoration:'none',fontSize: '15px'}}><span onClick={logout}>Logout</span></Link></li>
                            </ul>
                        </li></div>);
                        }else{
                            return (<div><li><Link className="nav-link scrollto" to="#" onClick={goLogin} style={{textDecoration:'none'}}><span >SignUp/Login</span></Link>
                        </li></div>);
                        }
                    })()
                }
               {(()=>{
                if(props.logedin && props.legitkey){
                    return(<>
                        <li>
                        <Link className={props.p==="Cart"?"nav-link scrollto active":"nav-link scrollto"}  to="/cart"><span><i className="fa fa-shopping-cart"></i>{cart!==0?<span className="icon-button__badge" style={{position: 'absolute', left: '100%',top:'1px'}}>{cart}</span>:null}</span></Link>
                        </li>
                        <li className="dropdown" id="reservebutton">
                            <div onClick={toggleNotifi}></div>
                               <a> <i className="fa fa-bell"></i>&nbsp;{notifArr.length+notifArr2.length+notifArr3.length!==0?<span className="icon-button__badge" style={{position: 'absolute', left: '90%',top:'1px'}}>{notifArr.length+notifArr2.length+notifArr3.length}</span>:null}</a>
                               {notifArr.length+notifArr2.length+notifArr3.length!==0?
                                <ul style={{width: '300px', left: '-230px'}}>
                                <div style={{ 
                                    height: '200px',
                                    overflowX: 'hidden',
                                    overflowY: 'auto'
                                }}>

                                {notifArr.map((d, index)=>{
                                    return(<li key={index} style={{padding:"8px"}} onClick={()=>{props.setAID(false);goToReceipt(d[0])}}>
                                        <h6 style={{ cursor: 'pointer', color:'black'}}><span>Order</span> {d[1].id} <span>is now being delivered. Items: {d[1].items.length}</span></h6>  
                                    </li>);
                                })}
                                {notifArr2.map((d, index)=>{
                                    return(<li key={index} style={{padding:"8px"}} onClick={()=>{props.setAID(false);goToReceipt(d[0])}}>
                                        <h6 style={{ cursor: 'pointer', color:'black'}}><span>Order</span> {d[1].id} <span>is now being processed. Items: {d[1].items.length}</span></h6>
                                    </li>);
                                })}
                                {notifArr3.map((d, index)=>{
                                      return(<li key={index} style={{padding:"8px"}} onClick={()=>{props.setAID(true);goToReceipt(d[0])}}>
                                      <h6 style={{ cursor: 'pointer', color:'black'}}><span>Product</span> {d[1].title} in order {d[2]} <span>is now being {d[1].status==="Processing"?"processed":"delivered"}. Quantity: {d[1].amount}</span></h6>
                                  </li>);
                                })}
                                </div>
                            </ul>:null}
                        </li> 
                      
                    </>);
                    }
            })()} 
            </ul>
            <i className="bi bi-list mobile-nav-toggle"></i>
            </nav>

            
            </div>
            
        </header>
        {props.logedin && props.legitkey===true?<Chat idnum={props.idnum}/>:null}
    </div>)
}

export default Header;
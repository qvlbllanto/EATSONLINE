
import { useHistory, Link } from "react-router-dom";
import React, {useState} from 'react';
import {data} from "../firebase";
import { checkLastKey, todaydate, generateCode, addLogs, endDateofVerification, checkIfEmailExist} from "./functions.js";
import {encrypt, cyrb53} from "./encdec.js"
import emailjs ,{ init } from 'emailjs-com';

init("user_gR4vjiZWG1kHvFh2dC23L");
const Login = (props)=>{
    const [idn, setId] = useState(null);
    const [idnvalues, setIdnValues] = useState({});
    const [verify, setVerification] = useState(false);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPass, setConfirmPass] = useState(null);
    const [email1, setEmail1] = useState(null);
    const [password1, setPassword1] = useState(null);
    const [code, setCode] = useState(null);
    const [forget, setForget] = useState(false);
    const [address, setAddress] = useState(null);
    const history = useHistory();
    const [login, setLogin] = useState(false);
    const [guest, setGuest] = useState(false);
    React.useEffect(() => { 
        addLogs("Login/Register");
        props.set(false);
    }, []);

    const sendVerificationEmail = (n, e, randomcode) => {
        var templateParams = {
            name: n,
            code: randomcode,
            email: e,
            messsage: "Thanks for registering to EATS ONLINE, here is your verification code,",
        };
        let template ="service_gkqzauk";
        let id = "template_3kpnkpt";
        emailjs.send(template,id,templateParams, )
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
              }, function(error) {
                console.lo.g('FAILED...', error);
              });
    }

    const checkAcctforReg = () => {
        return new Promise(function (resolve, reject) {
            data.ref("accounts").on("value", (snapshot) =>{
            let x = snapshot.val()
            for(let id in x){
                if(x[id].email === email && x[id].guest===false){
                    resolve(false);
                    break;
                }
            }
            resolve(true);
            });
            
        });
     }
    
    const saveDatatoFirebase = (x) =>{
        checkAcctforReg().then(async(ch)=>{
            if(ch){
                const id = await checkLastKey('accounts');
                let coderandom = generateCode2();
                let x9 = data.ref('accounts').push({
                    "id": id,
                    "name": name,
                    "email": email,
                    "phoneNumber": phoneNumber,
                    "password": cyrb53(password),
                    "verified": false,
                    "totalspent": 0,
                    "verificationCode": coderandom,
                    "verifyend": x,
                    "dateCreated": todaydate(),
                    "guest": false
                });
                data.ref("accounts").child(x9.key).child('addresses').push({address: address, primary: true}).then(()=>{
                    sendVerificationEmail(name, email, coderandom);
                    document.getElementById("errororsuccess2").innerHTML = "<span style='color: green'>Successfully Registered <br/> Verification Code is sent to your inbox</span>"
                })

            }else{
                document.getElementById("errororsuccess2").innerHTML = "Account already Exist!";
            }
        }) 
    }
    const RegisterAccount = (e) => {
        e.preventDefault();
            let re = /[A-Z]/;
            let re2 = /[a-z]/;
            let re3 = /[!@#$%^&*\(\)_+\}\{\":?><|~\.\-]/;
            let re4 = /[0-9]/;
            if((name === null && name === '') || (email === null && email === '') ||(password === null && password === '')|| (confirmPass ===null && confirmPass === '') || (phoneNumber ===null || phoneNumber === '')){
                return false;
            }
            if(password.length<8){
                document.getElementById("errororsuccess2").innerHTML = "Passwords must be at least 8 characters long.";
                return false;
            }
            if(!re.test(password)){
                document.getElementById("errororsuccess2").innerHTML = "Password should contain capital letters.";
                return false;
            }
            if(!re2.test(password)){
                document.getElementById("errororsuccess2").innerHTML = "Password should contain small letters.";
                return false;
            }
            if(!re3.test(password)){
                document.getElementById("errororsuccess2").innerHTML =  "Password should contain special characters. Ex: (!,@,#,$,...)";
                return false;
            }
            if(!re4.test(password)){
                document.getElementById("errororsuccess2").innerHTML = "Password should contain numbers.";
                return false;
            }
            let c = /^\+?\d+$/;
            if(!c.test(phoneNumber)){
                document.getElementById("errororsuccess2").innerHTML = 'Enter a valid phone number!';
                return false;
            }
            if(phoneNumber.length<11){
                document.getElementById("errororsuccess2").innerHTML = 'Enter a valid 11-digit phone number!';
                return false;
            }
            if(password === confirmPass){
                var l = endDateofVerification();
                saveDatatoFirebase(l);
            }else{
                document.getElementById("errororsuccess2").innerHTML = "Password did not match!";
            }
    }
    const checkAcctforLogin = (email1, password1) => {
        return new Promise((resolve, reject) =>{
            let c = [false, false];
         
            data.ref("accounts").orderByChild('email').equalTo(email1).once("value", (snapshot) =>{
                let x = snapshot.val();
                if(x === null){
                    resolve(c);
                }else{
                    
                    let idd =null;
                    let idnnn = null;
                    for(let id in x){
                      
                        if(x[id].password === cyrb53(password1) &&  x[id].email === email1 && x[id].guest===false){
                            
                            c[0] = true;
                            idd = id;
                            idnnn = x[id];
                            if(x[id].verified){
                                c[1] = true;
                            }else{
                                c[1] = false;
                            }  
                            break; 
                        }
                    }
                    console.log([c, idd, idnnn]);
                    resolve([c, idd, idnnn]);
                }
            });
           
        });
     }
     const checkForCode = () => {
        return new Promise((resolve, reject)=> {
            let c = false;
           
            data.ref("accounts").orderByChild('verificationCode').equalTo(code).on("value", (snapshot) =>{
                let x = snapshot.val()
                if(x===null){
                   
                    resolve(c);
                }else{
                   
                    snapshot.forEach((d)=>{ 
                        if(d.key === idn){
                            
                            resolve(true);
                        }
                    })
                    resolve(false);
                }
                
            });
           
        });
     }
     const iflog = () =>{
        if(login){
            setLogin(false);
        }else{
            setLogin(true);
        }

     }
     const ifguest = () =>{
        if(guest){
            setGuest(false);
        }else{
            setGuest(true);
        }

     }

     const CompareDate = (dateEnds) => {
        let end = new Date(dateEnds);
        let d = new Date();
        if(d > end){
            return false;
        }
        return true;
     }

     const handleCode = (e) =>{
         
        e.preventDefault();
        console.log(code)
        checkForCode().then(d=>{
            if(d){
                if(CompareDate(idnvalues.verifyend)){
                    data.ref('accounts').child(idn).update({verified:true, verifyend: null, verificationCode:null}).then(()=>{
                        data.ref('accounts').child(idn).once('value', (snapshot)=>{
                            props.checkLoggedIn( true, idn, snapshot.val().name);
                            history.push('/');
                        })
                        document.getElementById("errororsuccess").innerHTML = "Code Expired. <br/> <span style='color: green'>New Code Sent!</span>"
                    })
                }else{
                    data.ref('accounts').child(idn).update({verificationCode: generateCode2(), verifyend: endDateofVerification()}).then(()=>{
                        data.ref('accounts').child(idn).once('value', (snapshot)=>{
                            sendVerificationEmail(snapshot.val().name, snapshot.val().email, snapshot.val().verificationCode);
                            document.getElementById("errororsuccess").innerHTML = "Code Expired. <br/> <span style='color: green'>New Code Sent!</span>"

                        })
                   })
                }
            }else{
                document.getElementById("errororsuccess").innerHTML = "Wrong Code!";
            }
        })
     }
     const encryptvalues = (str1)=>{
        return new Promise((resolve, reject)=>{
            let x = encrypt(str1, process.env.REACT_APP_CODEP, 1);
            resolve([x]);
        });
      }

    const loginAsGuest = async() =>{
        const id = await checkLastKey('accounts');
        let x9 = data.ref('accounts').push({
            "id": id,
            "name": "Guest -"+generateCode3(),
            "email": "GUEST",
            "phoneNumber": '',
            "password": "GUEST",
            "verified": true,
            "totalspent": 0,
            "dateCreated": todaydate(),
            "guest": true
        });
        x9.then(()=>{
            encryptvalues(x9.key).then(r=>{
                localStorage.setItem( 'ifloggedin', true);  
                localStorage.setItem( 'userIDs', r[0]); 
                history.push("/");
                window.location.reload(false);
              });
        })
              

    }
    const LoginAccount = (e) => {
        e.preventDefault();
        checkAcctforLogin(email1, password1).then(data=>{
            if(data[0][0] && data[0][1]){
                if(data[1] !== null && data[2].name !== undefined && data[2].name !==null){
                    encryptvalues(data[1]).then(r=>{
                      localStorage.setItem( 'ifloggedin', true);  
                      localStorage.setItem( 'userIDs', r[0]); 
                      history.push("/");
                      window.location.reload(false);
                    });
                  }
            }else if(data[0][0] && !data[0][1]){
                setId(data[1]);
                setVerification(true);
            }else{
                setId(null);
                setVerification(false);
                document.getElementById("errororsuccess").style.color="red";
                document.getElementById("errororsuccess").innerHTML = "Wrong Email or Password!";
            }
        })
        
    }

    const [email2, setEmail2] = useState(null);
    const [v, setV]= useState(null);
    const sendEmail = (e) => {
        e.preventDefault();
        let codeGenerated = generateCode();
        checkIfEmailExist(email2, codeGenerated).then((d)=>{
            if(d){
                let path = "http://"+window.location.host+"/reset?id="+codeGenerated;
                sendVerificationEmail2(email2, path);
            }else{
                setV('Account does not exist!');
            }
        })
    }

    const generateCode = () =>{
        let alphs = "ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code=""
        for(let i=0; i<60; i++){
            let x = Math.floor((Math.random() * 60) + 1);
            code+=alphs.charAt(x);
        }
        return code;
    }
    const generateCode2 = () =>{
        let alphs = "ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code=""
        for(let i=0; i<12; i++){
            let x = Math.floor((Math.random() * 60) + 1);
            code+=alphs.charAt(x);
        }
        return code;
    }
    const generateCode3= () =>{
        let alphs = "ABCDEFGHIKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code=""
        for(let i=0; i<18; i++){
            let x = Math.floor((Math.random() * 60) + 1);
            code+=alphs.charAt(x);
        }
        return code;
    }
    const sendVerificationEmail2 = (e,l) => {

        var templateParams = {
            name: e,
            code: l,
            email: e,
            message: "Here is the link for resetting your password,"
        };
        let template ="service_gkqzauk";
        let id = "template_3kpnkpt";
        emailjs.send(template,id,templateParams, )
            .then(function(response) {
                setV('Verification link sent!');
              }, function(error) {
                setV('Failed!');
              });
        
    
    }
    const toggleForm = () => {
        const container3 = document.querySelector('.container3');
        container3.classList.toggle('active');
      }
    const goHome = () =>{
        history.push('/');
      }
    return(
        <div >
            <div style={{backgroundImage: "url('/assets/img/BACKGROUND IMAGE 2.png')", height: '100%', position: 'absolute', width: '100%'}}></div>
            
            <div style={{backgroundImage: "url('./assets/img/Eats Online logo.png')", width:'20%', height: '20%'}}></div>
            <section id= "section1">
                <div className="container3">
                    <div className="user signinBx">
                        <div className="imgBx"><img src="./assets/img/Eats Online logo.png" alt=""/></div>
                        <div className="formBx">
                        
                        <div>

                        {!login && !guest?
                        <form style={{display:'grid'}} onSubmit={(e)=>e.preventDefault()}>
                                {/* <div className="row"> */}
                                    
                                    <input type="submit" name="" value="&#xf007; LOGIN / SIGN UP" onClick={iflog} style={{maxWidth: '500px', width: '200px', height: '50px',border: '2px solid black', fontFamily: 'FontAwesome', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'inherit'}}/>
                                    {/* </div> */}
                                        <h1 style={{textAlign: 'center'}}>OR</h1>
                                    {/* <div className="col-lg-6 col-md-6 col-xs-12 col-sm-6"> */}
                                    <div>
                                        <input type="submit" name="" value="&#xf2c0; LOGIN as GUEST"  onClick={loginAsGuest} style={{maxWidth: '500px',  width: '200px', height: '50px',border: '2px solid black', fontFamily: 'FontAwesome', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'inherit'}}/>
                                        </div>
                                    {/* </div> */}
                                    <div>
                                    <input type="submit" id="homeLog" className="homehome" value="&#xf015; Home" onClick={goHome} style={{fontFamily: 'FontAwesome',fontWeight: 'normal',fontSize: '17px', fontStyle: 'normal', textDecoration: 'inherit', textDecoration: 'underline', top: '100px', left:'45px'}}/>        
                                    </div>
                            </form>
                        :!guest?<form actionName="" onSubmit={LoginAccount}>
                             <input type="submit" name="" value="Back" onClick={iflog}/>
                        <h2>LOG IN</h2>
                            <label className="controllabel" style={{color: 'black'}}><span className="required">*</span>Email: </label>
                                <input type="email" name="" placeholder="Email Address" onChange={(e)=>setEmail1(e.target.value)}  required={true}/>
                                    <label className="controllabel" style={{color: 'black'}}><span className="required">*</span>Password: </label>
                                        <input type="password" name="" placeholder="Password"  onChange={(e)=>setPassword1(e.target.value)} required={true}/>
                                        <span id="errororsuccess" style={{color:"red"}}></span><br/>
                                        <input type="submit" name="" value="Login" onClick={(e)=>setForget(false)}/>
                                            <p className="signup" style={{fontWeight: 'bold'}}>
                                            Don't have an account ? 
                                        <a href="#" onClick={toggleForm} style={{fontSize: '15px', textDecorationLine: 'underline' }}> Sign Up.</a>
                                    </p>
                            <h5><Link onClick={(e)=>{forget?setForget(false):setForget(true); setVerification(false);}} style={{color: '#97191d', fontSize: '15px'}}>Forget your password?</Link></h5>
                    
                            {/*dito*/}
                        </form>:
                      null}
                        
                            { verify && !guest&& login? <div>  <form onSubmit={(e)=>handleCode(e)}>
                                            <input type="text" style={{color: 'black'}} name="code" placeholder="Verification Code" onChange={e => setCode(e.target.value)} required/>
                                        <input type="submit" value="Verify" />
                                        </form>
                                        </div>:null
                                } 
                                {
                                    forget && !guest && login?<form  onSubmit={sendEmail}>
                                    <h2>Password Reset</h2>
                                    <input className="input-form" type="email"  name="email1" placeholder="Enter your email to send reset link." style={{color: 'black'}} required={true} onChange={(e)=>setEmail2(e.target.value)}/>
                                    <p style={v==="Verification link sent!"?{color:'green'}:{color:'red'}}>{v}</p>
                                    <input type="submit" value="Send"/>
                                </form>:null
                                } 
                                {/* <form>      
                                    <input type="submit" name="" value="&#xf015; Home" onClick={goHome} style={{top: '110px', left: '250px', fontFamily: 'FontAwesome',fontWeight: 'normal',fontSize: '17px', fontstyle: 'normal', textDecoration: 'inherit'}}/></form> */}
                            </div>
                        </div>
                    </div>
                    <div className="user signupBx">
                        <div className="formBx">
                            <div>
                            <form action="" onSubmit={RegisterAccount} style={{marginTop: '40px'}}>
                                <h2>Create an account</h2>
                                <label className="controllabel" style={{color: 'black'}}><span className="required">*</span>Name:</label>
                                <input type="text" name="" placeholder="Name" onChange={e => setName(e.target.value)} required={true} style={{height: '-5px'}}/>
                                <label className="controllabel" style={{color: 'black'}}><span className="required">*</span>Email: </label>
                                <input type="email" name="" placeholder="Email Address" onChange={e => setEmail(e.target.value)} required={true}/>
                                <label className="controllabel" style={{color: 'black'}}><span className="required">*</span>Address: </label>
                                <input type="text" name="" placeholder="Address" onChange={(e)=>setAddress(e.target.value)}/>
                                <label className="controllabel" style={{color: 'black'}}><span className="required">*</span>Phone Number: </label>
                                <input type="number" name="" placeholder="Phone Number" onChange={e => setPhoneNumber(e.target.value.toString())} required={true}/>
                                <label className="controllabel" style={{color: 'black'}}><span className="required">*</span>Password: </label>
                                <input type="password" name="" placeholder="Create Password" onChange={e => setPassword(e.target.value)}/>
                                <label className="controllabel" style={{color: 'black'}}><span className="required">*</span>Confirm Password: </label>
                                <input type="password" name="" placeholder="Confirm Password" onChange={e=>setConfirmPass(e.target.value)}/>
                                <span id="errororsuccess2" style={{color: 'black'}} style={{color:"red", fontSize:'15px'}}></span><br/>
                                <input type="submit" name="" value="Sign Up" />
                                <p className="signup" style={{Top: '30px', fontWeight: 'bold'}}>
                                Already have an account ?
                                <a href="#" onClick={toggleForm}  style={{fontSize: '15px', textDecorationLine: 'underline'}}> Log in.</a>
                                </p>
                            </form>
                            </div>
                        </div>
                        <div className="imgBx"><img src="./assets/img/Eats Online logo.png" alt=""/></div>
                    </div>
                </div>
            </section>
            {/* <section id="form-page" >
            <div className="hw"></div>
            <div className="container" >
            <button type="button" className="btn-home btn-default" onClick={goHome}>{'<< HOME'}</button>
            <img src="./assets/img/Eats Online logo.png" style={{width: '100px'}}/>
            
                <div className="login-page">
                    <div className="col-sm-4 col-sm-offset-1">
                        
                        <div className="login-form" style={{width: '100%'}}>
                        
                            <h2>Login to your account</h2>
                            <form onSubmit={LoginAccount}>
                                <input type="email" placeholder="Email Address" style={{color: 'black'}} onChange={(e)=>setEmail1(e.target.value)}  required={true}/>
                                <input type="password" placeholder="Password"  style={{color: 'black'}} onChange={(e)=>setPassword1(e.target.value)} required={true}/>
                                <span>
                                <h5><Link onClick={(e)=>{forget?setForget(false):setForget(true); setVerification(false);}}>Forget your password?</Link></h5>
                                </span>
                                <button type="submit" className="btn btn-default" onClick={(e)=>setForget(false)}>Login</button>
                            </form><br/>
                            <span id="errororsuccess" style={{color:"red"}}></span>
                                { 
                                    (() => {
                                        if(verify) {
                                        return (<div>  <form onSubmit={handleCode}>
                                            <input type="text" style={{color: 'white'}} name="code" placeholder="Verification Code" onChange={e => setCode(e.target.value)}/>
                                        <button type="submit" >VERIFY</button>
                                        </form>
                                        </div>);
                                        }
                                    })()
                                } 
                                {
                                    forget?<form  onSubmit={sendEmail}>
                                    <h2>Forget your password</h2>
                                    <input className="input-form" type="email"  name="email1" placeholder="Enter your email" style={{color: 'white'}} required={true} onChange={(e)=>setEmail2(e.target.value)}/>
                                    <p style={v==="Verification link sent!"?{color:'green'}:{color:'red'}}>{v}</p>
                                    <button type="submit" >Send</button>
                                </form>:null
                                } 
                        </div>
                    </div>
                    <div className="col-sm-1">
                        <h2 className="or">OR</h2>
                        
                    </div>
                    <div className="col-sm-4">
                        <div className="signup-form">
                            <h2>New User Signup!</h2>
                            <form onSubmit={RegisterAccount} >
                                <input type="text" style={{color: 'black'}} placeholder="Name" onChange={e => setName(e.target.value)} required={true}/>
                                <input type="email"style={{color: 'black'}}  placeholder="Email Address" onChange={e => setEmail(e.target.value)} required={true}/>
                                <input type="text" style={{color: 'black'}} placeholder="Mobile Number"  onChange={e => setPhoneNumber(e.target.value)} required={true}/>
                                <input type="password" style={{color: 'black'}} placeholder="Password" onChange={e => setPassword(e.target.value)} required={true}/>
                                <input type="password" style={{color: 'black'}} placeholder="Confirm Password" onChange={e => setConfirmPass(e.target.value)} required={true}/>
                                <span id="errororsuccess2" style={{color: 'black'}} style={{color:"red", fontSize:'12px'}}></span><br/>
                                <button type="submit" className="btn btn-default">Signup</button>
                            </form>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section> */}
        </div>
    );
}
export default Login;
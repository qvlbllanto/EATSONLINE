
import { useHistory } from "react-router-dom";
import React, {useState} from 'react';
import {data} from "../firebase";
import {todaydate, generateCode, addLogs, endDateofVerification} from "./functions.js";
import emailjs ,{ init } from 'emailjs-com';

init("user_9ufwFtgwqfcgEMVEUd66j");
const Login = (props)=>{
    const [verify, setVerification] = useState(false);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPass, setConfirmPass] = useState(null);
    const [email1, setEmail1] = useState(null);
    const [password1, setPassword1] = useState(null);
    const [code, setCode] = useState(null);
    const [idn, setId] = useState(null);
    const [idnvalues, setIdnValues] = useState({});
    const history = useHistory();

    React.useEffect(() => { 
        addLogs("Login/Register");
    }, []);

    const register = () =>{
        let x = document.getElementById("login-form");
		let y = document.getElementById("register-form");
		let z = document.getElementById("pointer-btn");
		let l = document.getElementById("login");
		let r = document.getElementById("register");
		let ac = document.getElementById("action_title");
        x.style.left = "-450px";
		y.style.left = "25px";
		z.style.left = "215px";
		l.style.color = "#848484";
		r.style.color = "#cda45e";
		ac.textContent = "Register";
    }

    const sendVerificationEmail = (n, e, randomcode) => {
        var templateParams = {
            name: n,
            code: randomcode,
            email: e,
        };
        let template ="service_oibfq4g";
        let id = "template_c62m6vv";
        emailjs.send(template,id,templateParams, )
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
              }, function(error) {
                console.log('FAILED...', error);
              });
        
    
    }

    const checkAcctforReg = () => {
        return new Promise(function (resolve, reject) {
            data.ref("accounts").on("value", (snapshot) =>{
            let x = snapshot.val()
            for(let id in x){
                if(x[id].email === email){
                    resolve(false);
                    break;
                }
            }
            resolve(true);
            });
            
        });
     }
    const login = () => {
        let x = document.getElementById("login-form");
		let y = document.getElementById("register-form");
		let z = document.getElementById("pointer-btn");
		let l = document.getElementById("login");
		let r = document.getElementById("register");
		let ac = document.getElementById("action_title");
        x.style.left = "25px";
        y.style.left = "450px";
        z.style.left = "30px";
        l.style.color = "#cda45e";
        r.style.color = "#848484";
        ac.textContent = "Login";
    }	


    const saveDatatoFirebase = (x) =>{
        checkAcctforReg().then(ch=>{
            if(ch){
                let coderandom = generateCode();
                data.ref('accounts').push().set({
                    "name": name,
                    "email": email,
                    "phoneNumber": phoneNumber,
                    "password": password,
                    "verified": false,
                    "verificationCode": coderandom,
                    "verifyend": x,
                    "dateCreated": todaydate()
                }).then(id=>{
                    sendVerificationEmail(name, email, coderandom);
                    document.getElementById("errororsuccess2").innerHTML = "<span style='color: green'>Successfully Registered <br/> Verification Code is sent to your inbox</span>"

                });
            }else{
                document.getElementById("errororsuccess2").innerHTML = "Account Existed!";
            }
        }) 
    }
    const RegisterAccount = (e) => {
        e.preventDefault();
        if(password === confirmPass){
            var l = endDateofVerification();
            saveDatatoFirebase(l);
        }else{
            document.getElementById("errororsuccess2").innerHTML = "Password didn't Matched!";
        }
    }

    const checkAcctforLogin = () => {
        return new Promise(function (resolve, reject) {
            let c = [false, false];
            data.ref("accounts").on("value", (snapshot) =>{
                let x = snapshot.val()
                for(let id in x){
                    if(x[id].email === email1 && x[id].password === password1){
                        c[0] = true;
                        setId(id);
                        setIdnValues(x[id]);
                        if(x[id].verified === true){
                            c[1] = true;
                        }else{
                            c[1] = false;
                        }
                        break;
                    }
                }
            });
            resolve(c);
        });
     }
     const checkForCode = () => {
        return new Promise(function (resolve, reject) {
            let c = false;
            data.ref("accounts").on("value", (snapshot) =>{
                let x = snapshot.val()
                for(let id in x){
                    if(id === idn){
                        if(x[id].verificationCode === code){
                            c=true;
                        }
                        break;
                    }
                }
            });
            resolve(c);
        });
     }

     const updateData = (ch) =>{
        data.ref('accounts/' + idn).set(idnvalues, (error) => {
            if (error) {
              console.log(error);
            } else {
                if(ch){
                    props.checkLoggedIn( true, idn, idnvalues);
                    console.log("Verified!")
                        
                    history.push('/');
                }else{
                    document.getElementById("errororsuccess").innerHTML = "Code Expired <br/> <span style='color: green'>New Code Sent!</span>"
                }
            }
          });
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
        checkForCode().then(d=>{
            if(d){
                if(CompareDate(idnvalues.verifyend)){
                    let x = idnvalues;
                    x.verified = true;
                    x.verifyend = null;
                    x.verificationCode = null;
                    setIdnValues(x);
                    updateData(true);
                }else{
                    let x = idnvalues;
                    x.verificationCode = generateCode();
                    x.verifyend = endDateofVerification();
                    sendVerificationEmail(x.name, x.email, x.verificationCode);
                    setIdnValues(x);
                    updateData(false);
                }
            }else{
                document.getElementById("errororsuccess").innerHTML = "Wrong Code!";
            }
        })
     }
     const goHome = () =>{
        history.push('/');
     }
    const LoginAccount = (e) => {
        e.preventDefault();
        checkAcctforLogin().then(data=>{
            console.log(data[0]);
            if(data[0]){
                document.getElementById("errororsuccess").innerHTML = "";
                if(data[1]){
                    props.checkLoggedIn( true, idn, idnvalues);
                    history.push('/');
                }else{
                    setVerification(true);
                }
            }else{
                setId(null);
                setVerification(false);
                document.getElementById("errororsuccess").style.color="red";
                document.getElementById("errororsuccess").innerHTML = "Wrong Email or Password!";
            }
        })
        
    }

    return(
            <div className="main2">
		        <div className="card2">
			        <div className="card-title2">
                        <h3><i className="fa fa-user-circle-o" aria-hidden="true"></i> User <span id="action_title">Login</span></h3>
                    </div>
                    <center>
                    <div className="card-body2">
				        <div className="card-body-top2">
                            <button id="login" className="btn2" name="login" onClick={login}>Login</button>
                            <button id="register" className="btn2" name="register" onClick={register}>Register</button>
                            <div id="pointer-btn"></div>
                        </div>
                        <div className="card-body-login2">
					        <form id="login-form" onSubmit={LoginAccount}>
                                <input className="input-form" type="email"  name="email1" placeholder="Enter your email" onChange={e => setEmail1(e.target.value)} required={true}/><br/><br/>
                                <input className="input-form" type="password"  name="password1" placeholder="Enter your password" onChange={e => setPassword1(e.target.value)}  required={true}/><br/><br/>
                                <input className="submit-form" type="submit" value="Login"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input className="submit-form" type="button" value="Home" onClick={goHome}/><br/><br/><br/>
                                <span id="errororsuccess" style={{color:"red"}}></span>
                                { 
                                    (() => {
                                        if(verify) {
                                        return (<div><input className="input-form" type="text" name="code" placeholder="Verification Code" onChange={e => setCode(e.target.value)}/>
                                        <br/><br/>
                                        <input className="submit-form" type="button" value="VERIFY" onClick={handleCode}/>
                                        </div>);
                                        }
                                    })()
                                }  
                            </form>
                            
                            <form id="register-form" action="" role="form" onSubmit={RegisterAccount}>
                                <input className="input-form" type="name" name="name" placeholder="Enter your full name" onChange={e => setName(e.target.value)}  required={true}/><br/>
                                <input className="input-form" type="email" name="email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)}  required={true}/><br/>
                                <input className="input-form" type="contact" name="phone" placeholder="Enter your contact number" onChange={e => setPhoneNumber(e.target.value)}  required={true}/><br/>
                                <input className="input-form" type="password" name="pass" placeholder="Enter your password" onChange={e => setPassword(e.target.value)}  required={true}/><br/>
                                <input className="input-form" type="password" name="confirm" placeholder="Confirm password" onChange={e => setConfirmPass(e.target.value)}  required={true}/><br/><br/>
                                <span id="errororsuccess2" style={{color:"red"}}></span><br/><br/>
                                <input className="submit-form" type="submit" value="Register"/>
					        </form>
                        </div>
                    </div>
                    </center>
                </div>
            </div>
    );
}
export default Login;
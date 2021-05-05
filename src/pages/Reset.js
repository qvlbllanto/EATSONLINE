
import React, {useState} from 'react';
import { useHistory, Link } from "react-router-dom";
import {checkCode, updatePass, addLogs} from "./functions.js";
import {cyrb53} from "./encdec.js"
const Reset = (props) => {
    const history = useHistory();
    const [idnum, setId] = useState("");
    const [password, setPassword] = useState(null);
    const [conf, setConf] = useState(null);
    const [v, setV] = useState(null);
    React.useEffect(()=>{
        addLogs("Reset");
        props.set(false);
        let x = window.location.href.split("reset?id=")[1];
        if(x===undefined){
            history.push("/login");
        }else{
            checkCode(x).then((d)=>{
                if(d[0]){
                    setId(d[1]);
                }else{
                    history.push("/login");
                }
            })
        }

    }, []);

    const update = (e) =>{
        e.preventDefault();
        let re = /[A-Z]/;
        let re2 = /[a-z]/;
        let re3 = /[!@#$%^&*\(\)_+\}\{\":?><|~\.\-]/;
        let re4 = /[0-9]/;

        if(password.length<8){
            setV("Password should be 8 characters and higher");
            return false;
        }
        if(!re.test(password)){
            setV("Password should contain capital letters");
            return false;
        }
        if(!re2.test(password)){
            setV("Password should contain small letters");
            return false;
        }
        if(!re3.test(password)){
            setV("Password should contain special characters Ex: [!,@,#,$,...]");
            return false;
        }
        if(!re4.test(password)){
            setV("Password should contain numbers");
            return false;
        }
        if(conf===password){
            updatePass(idnum, cyrb53(password)).then((d)=>{
                setV('Password Successfully changed!');
            });
            }else{
                setV('Password and confirm pass didn\'t matched!');
            }
    }
    
    
    const goLogin = () =>{
        history.push('/login');
    }

    return(
        <div>
            <div style={{backgroundImage: "url('/assets/img/BACKGROUND IMAGE 2.png')", height: '100%', position: 'absolute', width: '100%'}}></div>
            <div className="main2">
		        <div className="card2">
			        <div className="card-title2">
                        <h3><img className="fa fa-user-circle-o" src="./assets/img/Eats Online logo.png" alt="" style = {{width:'20%'}} aria-hidden="true"/> Change <span id="action_title">Password</span></h3>
                    </div>
                    <center>
                    <div className="card-body2">
				        <div className="card-body-top2">
                            <button id="login" className="btn2" name="login" >Reset Your Password</button>
                        </div>
                        <div className="card-body-login2">
					        <form id="login-form" onSubmit={(e)=>{update(e)}}>
                                <input className="input-form" type="password"  name="newpass" placeholder="New Password" onChange={(e)=>setPassword(e.target.value)} required={true}/><br/><br/>
                                <input className="input-form" type="password"  name="conpass" placeholder="Confirm Password" onChange={(e)=>setConf(e.target.value)} required={true}/><br/><br/>
                                <span style={v==="Password Successfully changed!"?{color:'green'}:{color:'red'}}>{v}</span><br/><br/>
                                <input className="submit-form" type="submit" value="Reset"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input className="submit-form" type="button" value="Login" onClick={goLogin}/><br/><br/><br/>
                            </form>
                        </div>
                    </div>
                    </center>
                </div>
            </div>
        </div>
    );
}

export default Reset;
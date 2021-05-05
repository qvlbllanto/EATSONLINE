import React, { useState } from 'react';
import { Widget, addResponseMessage, addUserMessage, dropMessages } from 'react-chat-widget';
import {newMessage, getChat, sendChat} from "./functions.js";
import 'react-chat-widget/lib/styles.css';
import $ from 'jquery';
const Chat = (props) =>{
    const [val, setVal] = useState('');
    const [messages, setMessages] = useState([]);
    const [num, setNum] = useState(9);
    const [handleLag, setHandleLag]= useState(0);
    const [ch, setCh] = useState(false);
    React.useEffect(()=>{

        if(document.getElementById("messages23").scrollTop===0 && !ch ){
            document.getElementById("messages23").scrollTop = document.getElementById("messages23").scrollHeight;
            if(document.getElementById("messages23").scrollTop!==0){
                setCh(true);
            }
        }
        getChat(num, props.idnum, setMessages);
            setHandleLag(1);
    }, [messages, setMessages])
        
    const handleNewUserMessage = (e, newMessage) => {
      e.preventDefault();
        sendChat(props.idnum, val);
    }
    $('#messages23').on('scroll', function() {
      if($('#messages23').scrollTop() === 0) {
          const timer = setTimeout(() => {
              if(handleLag===1){
                  setNum(num+20);
                  setHandleLag(0);
              }
                    
            }, 500);
            return () => clearTimeout(timer);
         
      }
  });
    return(
      
       <div >
               {/*<Widget handleNewUserMessage={handleNewUserMessage}
            profileAvatar="./assets/img/Eats Online logo.png"
            title="Chat Eats" 
            fullScreenMode={false}
    subtitle="And my cool subtitle"/>
       */}
       <div>
            <button className="chat-btn" onClick={(e)=>{document.getElementById("pop").style.display==="none"?document.getElementById("pop").style.display="flex":document.getElementById("pop").style.display="none"}}> 
                <i className="material-icons"> comment </i>
            </button>
            <div className="chat-popup" id="pop" style={{backgroundColor: '#7c1e23', padding: '10px'}}>
            <label><img src="./assets/img/eatsonlinelogo.png" className="avatar" alt="" style={{width: '30px', height: '30px'}}/>&nbsp;&nbsp;EATS ONLINE</label>
                <div className="chat-area" id="messages23" style={{backgroundColor: 'white'}}>
                  {messages.map((d, index)=>{
                    return(d.who==='user'?<div className="out-msg" key={index}>
                    <div className="my-msg">
                        <span className="msg">{d.message}  <br/> <span className="date">{new Date(d.date).toDateString()} {new Date(d.date).toLocaleTimeString()}</span></span>
                       
                    </div>  
                    </div>:<div className="income-msg" key={index}>
                        <img src="./assets/img/Eats Online logo.png" className="avatar" alt=""/>
                        <span className="msg">{d.message} <br/> <span className="date">{new Date(d.date).toDateString()} {new Date(d.date).toLocaleTimeString()}</span></span>
                       
                    </div> )
                  })}
                </div>
                <br/>
                <form onSubmit={handleNewUserMessage}>
                <div className="input-area">
                    <button className="button" style={{color: '&#128206', width: '50px', borderRadius: '5px', fontSize: '20px'}}>&#x1F4CE;</button>  &nbsp;
                    <input type="text" className="form-control" onChange={(e)=>setVal(e.target.value)} placeholder="Type here ..."/>
                    <button className="submit" style={{color: 'black', backgroundColor: 'red'}}> <i className="material-icons"> send</i></button>
                    
                </div>
                </form>
            </div>
        </div>
       </div>
    );
}
export default Chat;
import './App.css';
import {BrowserRouter as Router,Switch, Route} from "react-router-dom";
import React from 'react';
import {encrypt, decrypt} from "./pages/encdec.js"
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Cart from "./pages/cart.js"
import Account from "./pages/account.js"
import Receipt from "./pages/Receipt.js"
import Reset from "./pages/Reset.js"
import {checkIfAcctExist} from "./pages/functions.js";
import Header from './components/Header.js';
import Menu from './pages/menu';

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      historyid: null,
      aid: null,
      idn: localStorage.getItem('userIDs')===null?'':decrypt(localStorage.getItem('userIDs'), "EATSONLINE", 1),
      idnValues: localStorage.getItem('valss')===null?null:decrypt(localStorage.getItem('valss'), "EATSONLINE", 1),
      loggedIn: localStorage.getItem('ifloggedin')===null || (localStorage.getItem('ifloggedin') !=='true' && localStorage.getItem('ifloggedin') !=='false')?false:JSON.parse(localStorage.getItem('ifloggedin')),
      legitKEYS: false,
      ifhead: false,
      page: null,
      menuid: null,
      reserve: false,
      click: false
    };
  }
  setMenuId = (id) =>{
    this.setState({
      menuid:id
    })
  }
  setPage = (p) =>{
    this.setState({
      page: p
    })
  }
  setCart = ( id) =>{
    this.setState({
      historyid: id
    });
  }
  setA = ( bo) =>{
    this.setState({
      reserve: bo
    });
  }
  setHead = (b)=>{
    this.setState({
      ifhead: b
    });
  }

  encryptvalues = (str1, str2)=>{
    return new Promise((resolve, reject)=>{
        let x = encrypt(str1, "EATSONLINE", 1);
        let y = encrypt(str2, "EATSONLINE", 1);
        resolve([x,y]);
    });
  }

  logInFunction = (checkBool, uid, values) => {
    return new Promise((resolve, reject)=>{
      if(uid !== null && values !== undefined && values !==null){
        this.encryptvalues(uid, values).then(r=>{
          localStorage.setItem( 'ifloggedin', checkBool);  
          localStorage.setItem( 'userIDs', r[0]); 
          localStorage.setItem( 'valss', r[1]);
          window.location.reload(false);
        });
        resolve(true);
      }
      resolve(false);
  });
  }
  componentDidMount(){
      if(localStorage.getItem('ifloggedin')==='false' || localStorage.getItem('ifloggedin')===null){
        localStorage.setItem( 'ifloggedin', false);  
        localStorage.setItem( 'userIDs', null); 
        localStorage.setItem( 'valss', null);
      }else{
        if(localStorage.getItem('userIDs')!==null && localStorage.getItem('ifloggedin')!==false && localStorage.getItem('ifloggedin')!==null && localStorage.getItem('valss')!==null){
          checkIfAcctExist(localStorage.getItem('userIDs')===null?'':decrypt(localStorage.getItem('userIDs'), "EATSONLINE", 1), decrypt(localStorage.getItem('valss'), "EATSONLINE", 1)).then((d)=>{
            console.log(d);
            if(d){
              this.setState({legitKEYS:true});
            }else{
              localStorage.setItem( 'ifloggedin', false);  
              localStorage.setItem( 'userIDs', null); 
              localStorage.setItem( 'valss', null);
            }
          })
        }
    }
  }
  
  render(){
    return (
      <Router>
        {this.state.ifhead? <Header hid = {this.setCart.bind(this)}p={this.state.page}idnum={this.state.idn} logedin={this.state.loggedIn} legitkey = {this.state.legitKEYS} vals={this.state.idnValues}  checkLoggedIn={this.logInFunction.bind(this)} />:null}
      
        {/*<Sidebar/>*/}
        <Switch>
        <Route path="/" exact render={(props)=>(<Home {...props} menu = {this.state.menuid}  setP = {this.setPage.bind(this)} setAID = {this.setA.bind(this)} set = {this.setHead.bind(this)} legitkey = {this.state.legitKEYS} logedin={this.state.loggedIn} vals={this.state.idnValues} idnum={this.state.idn} checkLoggedIn={this.logInFunction.bind(this)}/>)}/>
          <Route path="/menu" exact render={(props)=>(<Menu {...props} c = {this.state.click} name={this.state.idnValues} logedin={this.state.loggedIn} legitkey = {this.state.legitKEYS} menu = {this.state.menuid}  idnum={this.state.idn} setMenu = {this.setMenuId.bind(this)} setP = {this.setPage.bind(this)} set = {this.setHead.bind(this)} logedin={this.state.loggedIn}/>)}/>
        {this.state.historyid!==null?<Route path="/receipt" exact render={(props)=>(<Receipt {...props} reserve={this.state.reserve} set = {this.setHead.bind(this)}  idnum = {this.state.idn} hid={this.state.historyid}/>)} />:null}
        <Route path="/reset" exact render={(props)=>(<Reset {...props} set = {this.setHead.bind(this)} />)} />
          {this.state.legitKEYS === true && this.state.loggedIn === true && this.state.idn !== null && this.state.idnValues!==null ? <Route path="/cart" exact render={(props)=>(<Cart {...props} setAID = {this.setA.bind(this)} setP = {this.setPage.bind(this)} set = {this.setHead.bind(this)}  legitkey = {this.state.legitKEYS} vals={this.state.idnValues} cart={this.setCart.bind(this)}  idnum={this.state.idn} checkLoggedIn={this.logInFunction.bind(this)} logedin={this.state.loggedIn}/>) }/>
          : null }
          {this.state.legitKEYS === true && this.state.loggedIn === true && this.state.idn !== null && this.state.idnValues!==null ? <Route path="/account" exact render={(props)=>(<Account {...props} setAID = {this.setA.bind(this)} setP = {this.setPage.bind(this)} setAID = {this.setA.bind(this)} set = {this.setHead.bind(this)}  legitkey = {this.state.legitKEYS} idnum={this.state.idn} cart={this.setCart.bind(this)} checkLoggedIn={this.logInFunction.bind(this)} logedin={this.state.loggedIn} vals={this.state.idnValues}/>)}/> : null}
        
          { this.state.loggedIn === false?<Route path="/login" exact render={(props)=>(<Login {...props} set = {this.setHead.bind(this)}  checkLoggedIn={this.logInFunction.bind(this)}/>)}/>: null }
          <Route render={(props)=>(<Home {...props} setP = {this.setPage.bind(this)} setAID = {this.setA.bind(this)} set = {this.setHead.bind(this)} legitkey = {this.state.legitKEYS} logedin={this.state.loggedIn} vals={this.state.idnValues} idnum={this.state.idn} checkLoggedIn={this.logInFunction.bind(this)}/>)}/>
        </Switch>
      
      </Router>      
    );
  }
}

export default App;

import './App.css';
import {BrowserRouter as Router,Switch, Route} from "react-router-dom";
import React from 'react';
import {data} from "./firebase";

import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Search from "./pages/Search.js";
import Cart from "./pages/cart.js"
import Account from "./pages/account.js"

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      prods: [],
      num : [],
      idn: null,
      idnValues: {},
      loggedIn: false,
      searchvalue: ''
    };
  }

  logInFunction = (checkBool, uid, values) => {
    this.setState(
      {idn: uid,
      idnValues: values,
      loggedIn: checkBool
      }
      );
  }
  changeSearch = (val) => {
    this.setState(
      {searchvalue: val}
      );
  }
  getData = () => {
    return new Promise(function (resolve, reject) {
      data.ref("products").on("value", (snapshot) =>{
        let products = [];
        snapshot.forEach(snap=>{
          products.push(snap.val());
        });
        
        resolve(products);
      });
    });
 }
 
 waitloop = (data) =>{
  return new Promise(function (resolve, reject) {
    const l = []
    const y = data.length;
    for(var x=0; x<Math.ceil(y/8); x++){
        l.push(x+1);
    }
    resolve(l)
  });
 }

  componentDidMount(){
    this.getData().then((data) =>{
      this.setState({prods: data})
      this.waitloop(data).then((d)=>{
        this.setState({num: d});
        
      });
    });
      
  }
  
  render(){
    return (
      <Router>
        <Switch>
          {this.state.loggedIn === true? <Route path="/cart" render={(props)=>(<Cart {...props} vals={this.state.idnValues} idnum={this.state.idn} logedin={this.state.loggedIn}/>) }/>
          : null }
          <Route path="/account" render={(props)=>(<Account {...props} products={this.state.prods} num={this.state.num}/>)}/>
          <Route path="/search" render={(props)=>(<Search {...props} searchItem={this.changeSearch.bind(this)} search={this.state.searchvalue} products={this.state.prods} logedin={this.state.loggedIn} vals={this.state.idnValues} idnum={this.state.idn} checkLoggedIn={this.logInFunction.bind(this)}/>)}/>
          {this.state.loggedIn === false?<Route path="/login" render={(props)=>(<Login {...props}  checkLoggedIn={this.logInFunction.bind(this)}/>)}/>: null }

          <Route path="/" render={(props)=>(<Home {...props} searchItem={this.changeSearch.bind(this)} products={this.state.prods} num={this.state.num} logedin={this.state.loggedIn} vals={this.state.idnValues} idnum={this.state.idn} checkLoggedIn={this.logInFunction.bind(this)}/>)}/>
        </Switch>
      </Router>      
    );
  }
}

export default App;

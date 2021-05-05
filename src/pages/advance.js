import React, {useState} from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
import { useHistory, Link} from "react-router-dom";
import {addLogs, getData, waitloop, NumberFormat, checkDate, Reservation,} from "./functions.js"
import TopSide from "../components/TopSide.js";
import $ from 'jquery';
const Advance = (props) =>{
    
    const [categ, setCategory] = useState([]);
    const [valuesCh, setvaluesCh] = useState([]);
    const [valuesCh2, setValuesCh2] = useState([]);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [message, setMessage] = useState(null);
    const [products, setProducts] = useState([]);
    const [check, setCheck] = useState(false);
    const [ch, setCh] = useState(false);
    const [totalvalue, setTotalValue] = useState(0);
    const history = useHistory();
    React.useEffect(() => { 
        if(!ch){
            props.setP("Advance");
             props.set(true);
            addLogs("Advance Order");
            setCh(true);
            // document.getElementById("popup-1").classList.toggle("active");
            // document.getElementById("home_hero").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
        }
        const timer = setTimeout(() => {
            getData().then((data) =>{
                setProducts(data[0]);
                setCategory(data[1]);
            });
           }, 500);
           return () => clearTimeout(timer);
     });

     $('#selection').on('change', function()
     {					
         if(this.value==="all"){
             categ.forEach((o)=>{
                 $("#"+o).show();
             });
         }else{
         for(let o of categ){	
             if (this.value === o)
             {
                 $("#"+o).show();
             }else{
                 $("#"+o).hide();
             }
         }
     }
         });
         const advance = (e) =>{
            let o = [];
            let totalprice = 0;
            valuesCh2.forEach((d, i)=>{
                let arr = d.split("///key=");
                let value = document.getElementById(arr[1]+i).value==="" || document.getElementById(arr[1]+i).value===null?1:Number(document.getElementById(arr[1]+i).value);
                let items = {};
                
                for(let i=0; i<products.length; i++){
                    if(arr[1]===products[i][0]){
                        items = products[i][1];
                        items['itemid'] = arr[1];
                        totalprice+=Number(items.price)*value;
                        break;
                    }
                }
                items['amount'] = value;
                o.push(items);
            })
             Reservation(name, email, phone, date, time, message, o, props.idnum, Number(totalprice).toFixed(2)).then(e=>{
                togglePopup2();
                props.setAID(e);
                history.push("/receipt2");
            });
        }
    
         const count2 = () =>{
            new Promise((resolve, reject)=>{
                let totalprice = 0;
                valuesCh2.forEach((d, i)=>{
                    let arr = d.split("///key=");
                    let value = 1;
                    if(document.getElementById(arr[1]+i)===null){
                        value=1;
                    }else{
                        value = document.getElementById(arr[1]+i).value==="" || document.getElementById(arr[1]+i).value===null?1:Number(document.getElementById(arr[1]+i).value);
                    }
                    for(let i=0; i<products.length; i++){
                        if(arr[1]===products[i][0]){
                            totalprice+=Number(products[i][1].price)*value;
                            break;
                        }
                    }
                });
                resolve(Number(totalprice).toFixed(2));
            }).then((d)=>{
                setTotalValue(d);
            })
            
        }
    const sendReservation = (e) =>{
        e.preventDefault();
            if(checkDate(new Date(date))){
            let o = [];
            valuesCh.forEach((d)=>{
                o.push(d);
            })
            setValuesCh2(o);   
            togglePopup2();
        }else{
           alert("Date should start tomorrow and within 2 weeks");
        }
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
    const change=(e, v, valss)=>{
        let x = valuesCh; 

        if(!e.target.checked){
            if(x.includes(v+"///key="+e.target.id+"///key="+valss)){
                x.splice(x.indexOf(v+"///key="+e.target.id+"///key="+valss), 1);
            }
        }else{
            x.push(v+"///key="+e.target.id+"///key="+valss)
        }
        setvaluesCh(x);
    }

    return (
        <div>
            
            <TopSide right={false} first="Advance " second="Order" desc="You can store and eat them when you start craving for it!" img={["./assets/img/sliderimg/1 Extra Image.png"]}/>
        {/* <section id="home_hero" className="d-flex align-items-center">
        <div id="myCarouel" className="fullscreen carousel slide " data-ride="carousel">
                    <div className="carousel-inner" style={{width: '100%'}}>
                        <div className="item active" >
                            <img src="./assets/img/sliderimg/Slider Image 0.png"  style={{width:'100%', backgroundPosition: 'center bottom'}}/>
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

            <div className="container position-relative text-center text-lg-start" data-aos="zoom-in" data-aos-delay="100" style={{position:'absolute'}}>
           
                <div className="row">
                    <div className="col-lg-10">
                        <h1 align="right">Advance <span className="blinking">Order</span></h1>
                        <h2 align="right">You can store and eat them, when you start craving for it!</h2>
                    </div>
                </div>
                <br/>
            </div>
        </section> */}
        <section id="home_menu2" className="menu section-bg">
       
        <div className="popup" id="popup-1">
                    <div className="overlay"></div>
                    <div className="my-custom-scrollbar content1">
                    <div className="close-btn" onClick={togglePopup2}>&times;</div>
                   <span style={{color:'black', fontWeight:'bold', fontFamily:'cursive'}}> Total Price: ₱{NumberFormat(Number(totalvalue))}</span>
                   <br/>
                        <br/>
                            {valuesCh2.map((d, i)=>{
                                 count2();
                               return(<div key={i} style={{color:'black'}}><span style={{fontFamily:'cursive'}}>{d.split("///key=")[0] +" - ₱"+NumberFormat(Number(d.split("///key=")[2]))}</span><input type="number" className="form-control" id={d.split("///key=")[1]+i} placeholder="1" onChange={(e)=>count2()}/><br/></div> );
                            })}
                            <br/>
                            <button style={{color:'black', borderColor:'black'}} className="btn btn-danger my-cart-btn" data-id="1" data-name="Product 1" onClick={advance}
                                        data-summary="summary 1" data-price="100" data-quantity="1" data-image="assets/img/Eats Online logo.png">
                                Advance Order
                            </button>
                            </div>

                    <br/>
                    
                    </div>
        <div className="container" data-aos="fade-up">
                <div className="section-title">
                    
                    <p>Advance Order </p>
                </div>
                <form role="form" data-aos="fade-up" data-aos-delay="100" onSubmit={sendReservation}>
                    <div className="row">
                        <div className="clearfix visible-xs"></div>
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
                            <label className="inline">Name: </label>
                            <input type="text" name="name" className="form-control" id="name" placeholder="Type your name" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                        
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
                        <label className="inline">Phone Number: </label>
                        <input type="text" className="form-control" name="phone" id="phone" placeholder="Type your Phone" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'100%', fontSize:'20px'}}>
                            <select className="selection" id="selection" name="sub_sel" style={{width:'100%', fontSize:'16px'}} value="categories">
                                    <option value="blank">Categories</option>
                                    <option value="all">All</option>
                                    {categ.map((d, index)=>{
                                        return(<option key={index} value={d}>{d}</option>);
                                    })}
                            </select>
                        </div>
                            <fieldset className="group"> 
                            <br/> 
                            <ul className="checkbox">
                            {categ.map((d1, i)=>{
                            return(
                            <div id={d1} key={i} className="row" style={{width:'100%'}}><br/><h3 style={{color:'#2EAF7D'}}>{d1}</h3>
                                {products.map((d, index)=>{
                                    return(d[1].type===d1? <li className="col-xs-6 col-sm-3 col-md-6 " key={index}><label style={{fontFamily:'cursive', color:'#000000'}}><input type="checkbox" id={d[0]} name='test' onClick={(e)=>{change(e, d[1].title, d[1].price)}} />{d[1].title}</label>{document.getElementById(d[0])!==null?document.getElementById(d[0]).checked?<div><button style={{width: '50%', backgroundColor: 'white', color: 'black', margin: '2px'}}>+</button><button style={{width: '50%', backgroundColor: 'white', color: 'black', margin: '2px'}}>-</button></div>:null:null}</li>:null );
                                })}
                                <br/>  <br/>   
                            </div>
                                );
                            })}
                               </ul> 
                            </fieldset> 

                            
                        
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
                        <label className="inline">Date: </label>
                            <input type="date" name="date" className="form-control" id="date" placeholder="Date"  onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
                        <label className="inline">Time: </label>
                            <input type="time" className="form-control" name="time" id="time" placeholder="Time" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                       
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'100%'}}>
                        <label className="inline">Email: </label>
                            <input type="email" className="form-control" name="email" id="email" placeholder="Email" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                    </div>
                        <div className="form-group mt-3">
                            <textarea className="form-control" name="message" rows="5" placeholder="Message" onChange={valuesForReservation}></textarea>
                            <div className="validate"></div>
                        </div>
                        <div className="mb-3">
                            <div className="error-message"></div>
                            { 
                                (() => {
                                if(check){
                                    return (<div className="sent-message">Your booking request was sent. We will call back or send an Email to confirm your reservation. Thank you!</div>);
                                    }
                                })()
                            }    
                        </div>
                        <div className="text-center"><input type="submit" className="reservation-btn scrollto d-lg-flex" value="Order Now" /></div>
                </form>
        </div>
        </section>
        <footer id="footer">
            <div className="footer-top " style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{backgroundColor: '#611b14'}:{color: 'black'}}>
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
                                    <strong style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?null:{color: 'black'}}>Phone:</strong> 09157583842<br></br>
                                    <strong style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?null:{color: 'black'}}>Email: </strong> EatsOnline@gmail.com<br></br>
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
export default Advance;
                        // name={startOfList+i+"rating"} 
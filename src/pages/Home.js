import React, {useState} from 'react';
import {sendContact, addLogs, addCart , Reservation, getData, waitloop, NumberFormat, checkDate} from "./functions.js"
import { useHistory, Link} from "react-router-dom";
import TopSide from "../components/TopSide.js";
import $ from 'jquery';
const Home = (props)=>{

    const [name2, setName2] = useState(null);
    const [email2, setEmail2] = useState(null);
    const [message2, setMessage2] = useState(null);
    const [subject2, setSubject2] = useState(null);
    const [successful, setSuccessful] = useState(null);
    const [ch, setCh] = useState(false);
    React.useEffect(() => { 
        if(!ch){
            props.setP("Home");
            addLogs("Home");
            props.set(true);
            setCh(true);
            // document.getElementById("home_hero").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
        }
    
    });


    const onSubmitContactUs = (e) =>{
        e.preventDefault();
       
        sendContact(name2, subject2, email2, message2).then((d)=>{
            if(d){
                setSuccessful('Your message has been sent. Thank you!');
            }
            
        });
    }
    
    return(
        <div>
      {/*<---------------T E S T I N G -------------->*/}          
            <div className="modal fade" id="myModal1" role="dialog">
                <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Order Updates</h4>
                    </div>
                    <br/>
                    <div style={{padding:'10px'}}>
                    </div>
                        <br/>
                        <div>
                            <input type="button" className="btn btn-outline-success" id="close" value="Completed" data-dismiss="modal"/>
                            &nbsp;&nbsp;&nbsp;
                            <input type="button" className="btn btn-default" id="close" value="Close" data-dismiss="modal"/>
                        </div>
                    <br/>
                </div>
                </div>
            </div>
         
        <TopSide right={true} first="Welcome to " second="Eats Online" desc="Delivering great food for more than a year!" img={["./assets/img/0 NEW SLIDER/Slider Image 0.png","./assets/img/0 NEW SLIDER/Slider Image 1.png", "./assets/img/0 NEW SLIDER/Slider Image 2.png", "./assets/img/0 NEW SLIDER/Slider Image 3.png"]}/>
    
        <main id="main">
        <section id="home_menu" className="menu section-bg">
            <div className="container" data-aos="fade-up" >
                <div className="section-title">
                    <h1>Featured Products</h1>
                </div>
                <div className="container-all">
                    <div className="featured-container">
                        <img src="assets/img/0 NEW FEATURED (RECTANGLE)/Featured 1.png" alt=""/>
                        
                    </div>
                    <div className="featured-container">
                        <img src="assets/img/0 NEW FEATURED (RECTANGLE)/Featured 2.png" alt="" />
                        
                    </div>
                    <div className="featured-container">
                        <img src="assets/img/0 NEW FEATURED (RECTANGLE)/Featured 3.png" alt=""/>
                    </div>
                    <div className="featured-container">
                        <img src="assets/img/0 NEW FEATURED (RECTANGLE)/Featured 4.png" alt=""/>
                    </div>
                    <div className="featured-container">
                        <img src="assets/img/0 NEW FEATURED (RECTANGLE)/Featured 5.png" alt=""/>
                    </div>
                    <div className="featured-container">
                        <img src="assets/img/0 NEW FEATURED (RECTANGLE)/Featured 6.png" alt=""/>
                    </div>
                </div>
  
                {/*<div className="row" data-aos="fade-up" data-aos-delay="100"  >
                    <div className="col-lg-12 d-flex justify-content-center">
                        <ul id="menu-flters" >
                            <li data-filter="*" className={active[0]} onClick={(e)=>{setActive(["filter-active", ""]); setV(null); setValues(products); setCh2(true);}} >All</li>
                            <li data-filter=".filter-pork" onClick={(e)=>setActive(["", "filter-active"])} onClick={(e)=>setActive(["", "filter-active"])}>
                            <div id="navbar" className="navbar2"  style={{position: 'relative', right:'13px'}}> 
                                <ul >
                                    <li className={"dropdown2 "+active[2]} >{v===null?"Others":v} <i className="bi bi-chevron-down"></i>
                                        <ul>
                                            {categ.map((d, i)=>{
                                                return(<li key={i} onClick={(e)=>{setV(e.target.innerHTML); search(e.target.innerHTML);}}>{d}</li>)
                                            })}
                                            
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                          </li>
                        </ul>
                    </div>
                    <div className="container" >
                        <center>
                            <div className="row" >
                            {values.length===0?products.slice(startOfList, indexOfList).map((data, index) =>(
                                <div className="col-md-3 text-center" key={index}  >
                                    <br/>
                                    <h6 style={{color:'black'}}>{data[1].title}</h6>
                                    <a style={{cursor:'pointer'}} onClick={(e) => addtoCartPopup(data[0], data[1].title, data[1].description,  data[1].price, data[1].link, data[1].seller, data[1].type)}>
                                       {hover===index+1?<div className="menu-img" style={{boxShadow:'0 5px 10px #2EAF7D', margin:'10px', padding:'15px'} } onMouseLeave={(e)=>setHover(0)}><p style={{color: 'black'}}>{data[1].title}</p>
                                            <p style={{color: 'black'}}>{data[1].description}</p>
                                            <p style={{color: 'black'}}>{data[1].price}</p>
                                            <p style={{color: 'black'}}>{data[1].seller}</p>
                                            <p style={{color: 'black'}}>{data[1].type}</p></div>
                                    :<img alt="" style={{boxShadow:'0 5px 10px #2EAF7D', margin:'10px', padding:'15px'} } src={data[1].link} className="menu-img" onMouseOver={(e)=>setHover(index+1)} />}</a>
                                </div>
                            )):values.slice(startOfList, indexOfList).map((data, index) =>(
                                <div className="col-md-3 text-center" key={index}  >
                                    <br/>
                                    <h6 style={{color:'black'}}>{data[1].title}</h6>
                                    <a style={{cursor:'pointer'}} onClick={(e) => addtoCartPopup(data[0], data[1].title, data[1].description,  data[1].price, data[1].link, data[1].seller, data[1].type)}><img alt="" style={{boxShadow:'0 5px 10px #2EAF7D', margin:'10px', padding:'15px'} } src={data[1].link} className="menu-img"/></a>
                                </div>
                            ))}
                            </div>
                            </center>
                        </div>                     
                </div>*/}
            </div>
        </section>
   <section id="home_menu2" className="menu section-bg">
        {/*<div className="container" data-aos="fade-up">
            <div className="row" data-aos="fade-up" data-aos-delay="100"  >
            <div className="col-lg-12 d-flex justify-content-center">
                        <ul id="menu-flters">
                        { 
                            (() => {
                            if(startOfList !== 0){
                                return (<li className="filter-active"><a name="prev" onClick={prevContent}>Previous</a></li>);
                            }
                            })()
                        }
                        { 
                            (() => {
                                let o = values.length===0?products.length:values.length;
                                if( indexOfList < o) {
                                return (<li className="filter-active"><a name="next" onClick={nextornm}>Next</a></li>);
                                }
                            
                            })()
                        }  
                        { 
                            (() => {
                                let o = values.length===0?products.length:values.length;
                                if( indexOfList >= o && startOfList === 0) {
                                return (<li className="filter-active">-----</li>);
                                }
                            
                            })()
                        }    
                        </ul>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-2 text-center">
                                <ul className="pagination justify-content-center fixed-bottom mb-5" id="menu-flters">   
                                                                   
                                    {
                                        num.map((n, index)=>(
                                            <li className="page-item active" key={index}><button name="num" className="page-link rounded-circle" onClick={nextornm} style={{fontSize:'15px', backgroundColor:'#aa2b1d', padding: '12px'}}>{n}</button></li>
                                        ))
                                    }
                                
                                </ul>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>*/}
        </section>
        {/*{ 
        (() => {
            if(props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null) {
            return (<section id="home_reservation" className="reservation">
                <div className="popup" id="popup-2">
                    <div className="my-custom-scrollbar content">
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
                    <h2>Advance Order</h2>
                    <p>Advance Order </p>
                </div>
                <form role="form" data-aos="fade-up" data-aos-delay="100" onSubmit={sendReservation}>
                    <div className="row">
                        <div className="clearfix visible-xs"></div>
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
                            <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                        
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
                        <input type="text" className="form-control" name="phone" id="phone" placeholder="Your Phone" onChange={valuesForReservation} required={true}/>
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
                                    return(d[1].type===d1? <li className="col-xs-6 col-sm-3 col-md-6 " key={index}><label style={{fontFamily:'cursive'}}><input type="checkbox" id={d[0]} name='test' onClick={(e)=>{change(e, d[1].title, d[1].price)}} />{d[1].title}</label>{document.getElementById(d[0])!==null?document.getElementById(d[0]).checked?<div><button style={{width: '50%', backgroundColor: 'white', color: 'black', margin: '2px'}}>+</button><button style={{width: '50%', backgroundColor: 'white', color: 'black', margin: '2px'}}>-</button></div>:null:null}</li>:null );
                                })}
                                <br/>  <br/>   
                            </div>
                                );
                            })}
                               </ul> 
                            </fieldset> 

                            
                        
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
                            <input type="date" name="date" className="form-control" id="date" placeholder="Date"  onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
                            <input type="time" className="form-control" name="time" id="time" placeholder="Time" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                       
                        <div className="col-xs-6 col-sm-3 col-md-6 form-group mt-3" style={{width:'50%'}}>
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
                        </section>);
            }
        
        })()
        }  */}  
        
    <section id="contact" className={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?"contact section-bg":"contact section-bg"}>
      <div className="container" data-aos="fade-up">

        <div className="section-title">
          <h1>Contact Us</h1>
        </div>
      </div>

      <div className="container" data-aos="fade-up">

        <div className="row mt-5">

          <div className="col-lg-4">
            <div className="address" >
                <i className="bi bi-geo-alt"  style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black'}:{color: 'black'}}></i>
                <h4 style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black', fontSize: '20px'}:{color: 'black', fontSize: '20px'}}>Location:</h4><br/><br/>
                <p style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black', fontSize: '18px'}:{color: 'black', fontSize: '18px'}}>19, Via Milano St., Villa Firenze, Quezon City, Philippines</p>
            </div>

              <div className="open-hours">
                <i className="bi bi-clock" style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black'}:{color: 'black'}}></i>
                <h4 style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black', fontSize: '20px'}:{color: 'black', fontSize: '20px'}}>Open Hours:</h4>
                <p style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black', fontSize: '18px'}:{color: 'black', fontSize: '18px'}}>Monday-Saturday:<br/>
                9:00 AM-5:00 PM
                </p>
              </div>

              <div className="email">
                <i className="bi bi-envelope" style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black'}:{color: 'black'}}></i>
                <h4 style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black', fontSize: '20px'}:{color: 'black', fontSize: '20px'}}>Email:</h4>
                <p style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black', fontSize: '18px'}:{color: 'black', fontSize: '18px'}}>EatsOnline@gmail.com</p>
              </div>

              <div className="phone">
                <i className="bi bi-phone" style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black'}:{color: 'black'}}></i>
                <h4 style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black', fontSize: '20px'}:{color: 'black', fontSize: '20px'}}>Call:</h4>
                <p style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black', fontSize: '18px'}:{color: 'black', fontSize: '18px'}}>09157583872</p>
              </div>
          </div>

          <div className="col-lg-8 mt-5 mt-lg-0">

            <form action="" method="post" role="form" className="php-email-form" onSubmit={onSubmitContactUs}>
              <div className="row">
                <div className="col-md-6 form-group">
                <label className="controllabel"><span className="required">*</span>Name: </label>
                  <input type="text" name="name" className="form-control" id="name2" placeholder="Your Name" onChange={(e)=>setName2(e.target.value)} required style={{background: '#97191d', color:'white'}}/>
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                <label className="controllabel"><span className="required">*</span>Email: </label>
                  <input type="email" className="form-control" name="email" id="email2" placeholder="Your Email" onChange={(e)=>setEmail2(e.target.value)} required style={{background: '#97191d', color:'white'}}/>
                </div>
              </div>
              <div className="form-group mt-3">
              <label className="controllabel"><span className="required">*</span>Subject: </label>
                <input type="text" className="form-control" name="subject" id="subject2" placeholder="Subject" onChange={(e)=>setSubject2(e.target.value)} required style={{background: '#97191d', color:'white'}}/>
              </div>
              <div className="form-group mt-3">
              <label className="controllabel"><span className="required">*</span>Message: </label>
                <textarea className="form-control" name="message2" rows="8" placeholder="Message" onChange={(e)=>setMessage2(e.target.value)} required style={{background: '#97191d', color:'white'}}></textarea>
              </div>
                <span style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{color: 'black'}:{color: 'black'}}>{successful}</span>
              
                <div className="text-center">
                  <button type="submit" >Send Message</button>
                  {/* style={{borderRadius: '50px', background: '#97191d' , color: '#ffffff', fontWeight: '400', border: '2px solid #97191d', textAlign: 'center', height: '30px', width: '150px' }} */}
                </div>
            </form>
          </div>
        </div>
      </div>
    </section>
        </main>
        <footer id="footer">
            <div className="container" >

                <div className="copyright">
                <div className="social-links mt-3">
                <a href="#hero" className="facebook"><i className="bx bxl-facebook"></i></a>
                <a href="#hero" className="instagram"><i className="bx bxl-instagram"></i></a>
                <a href="#hero" className="twitter"><i className="fab fa-google-plus-g"></i></a>
            </div>
                    &copy; Copyright <strong><span style={{color: '#97171d'}}>Eats Online</span></strong>. All Rights Reserved
                </div>
            </div>
        </footer>
        
    </div>
    );

}
export default Home;
 
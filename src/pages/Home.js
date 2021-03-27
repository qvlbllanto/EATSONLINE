import React, {useState} from 'react';
import {addLogs, addCart , Reservation} from "./functions.js"
import { useHistory, Link } from "react-router-dom";
const Home = (props)=>{
    const [indexOfList, setIndexOfList] = useState(8);
    const [startOfList, setStartOfList] = useState(0);
    const [title, setTitle] = useState(null);
    const [seller, setSeller] = useState(null);
    const [type, setType] = useState(null);
    const [description, setDesc] = useState(null);
    const [price, setPrice] = useState(null);
    const [link, setLink] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [people, setPeople] = useState(null);
    const [message, setMessage] = useState(null);
    const [check, setCheck] = useState(false);
    const [active, setActive] = useState(["filter-active", "", "",""]);
    const history = useHistory();
    React.useEffect(() => { 
        const script = document.createElement("script");
        script.src = process.env.PUBLIC_URL + "/assets/js/main.js";
        script.async = true;
        document.body.appendChild(script);
        addLogs("Home");
    }, []);
    const togglePopup = () => {
        document.getElementById("menu").scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
        document.getElementById("popup-1").classList.toggle("active");
    }


    const addProdtoCart = () => {
        if(props.logedin){
            addCart(title, price, description, link, props.idnum, seller, type);
            document.getElementById("popup-1").classList.toggle("active");
        }else{
            goLogin();
        }
    }

    const sendReservation = (e) =>{
        e.preventDefault();
        Reservation(name, email, phone, date, time, people, message).then(e=>{
            setCheck(true);
        });
    }

    const addtoCartPopup = (t, d, p, l,s, ty) => {
        setTitle(t);
        setDesc(d);
        setPrice(p);
        setLink(l);
        setSeller(s);
        setType(ty);
        togglePopup();
    }

    const nextornm = (e) =>{
        document.getElementById("menu").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
        if(e.target.name === "next"){
          setIndexOfList(indexOfList+8);
          setStartOfList(startOfList+8);
        }else if(e.target.name="num"){
            const s = 8 * parseInt(e.target.innerHTML);
            setIndexOfList(s);
            setStartOfList(s-8);
        }
        
      }
      const prevContent = (e) =>{
          document.getElementById("menu").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
          if(e.target.name === "prev"){
            setIndexOfList(indexOfList-8);
            setStartOfList(startOfList-8);
          }
        
      }
      const goLogin = () =>{
        history.push('/login');
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
        }else if(e.target.name === "people"){
            setPeople(e.target.value);
        }else if(e.target.name === "message"){
            setMessage(e.target.value);
        }
      }
    const logout = () =>{
        props.checkLoggedIn(false, {}, null);
    }
    const goSearch = () =>{
        history.push('/search');
    }
    return(
        <div>
        <header id="header" className="fixed-top d-flex align-items-cente">
            <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between">
            <h1 className="logo me-auto me-lg-0"><a href="#hero"><img alt="" src="assets/img/Eats Online logo.png"/></a></h1>
            <nav id="navbar" className="navbar order-last order-lg-0">
                <ul>
                <li><Link className="nav-link scrollto active" to="#hero">Home</Link></li>
                <li><Link className="nav-link scrollto" to="#menu">Menu</Link></li>
                <li><Link className="nav-link scrollto" to="#contact">Contact</Link></li>
                { 
                    (() => {
                        if(props.logedin){
                            return (<div><li className="dropdown"><Link to="#hero"><span>{props.vals.name}</span> <i className="bi bi-chevron-down"></i></Link>
                            <ul>
                            <li><Link to="/cart">Cart List</Link></li>
                            <li><Link to="/account">Account</Link></li>
                            <li><Link to="#hero">Password Reset</Link></li>
                            <li><Link to="#" ><span onClick={logout}>Logout</span></Link></li>
                            </ul>
                        </li></div>);
                        }else{
                            return (<div><li><Link to="#" onClick={goLogin}><span >SignUp/Login</span></Link>
                        </li></div>);
                        }
                    })()
                }
                <li><Link className="nav-link scrollto" id="reserve" to="#reservation" >Reservation</Link></li>
                </ul>
                <i className="bi bi-list mobile-nav-toggle"></i>
            </nav>
            <Link to="#reservation" className="reservation-btn2 scrollto d-none d-lg-flex" id="reservebutton">Reservation</Link>
            </div>
        </header>

        <section id="hero" className="d-flex align-items-center">
        <div className="container position-relative text-center text-lg-start" data-aos="zoom-in" data-aos-delay="100">
            <div className="row">
                <div className="col-lg-10">
                    <h1>Welcome to <span>Eats Online</span></h1>
                    <h2>Delivering great food for more than a years!</h2>
                </div>
            </div>
            <br/>
             <div className="row">
                    <input type="text" className="input" placeholder="What are you looking for?" onChange={e=>props.searchItem(e.target.value)}/>
            </div>
            <div className="row">
				    <input type="button" value="search" className="close-btn" onClick={goSearch}/>
            </div>
        </div>
        </section>

        <main id="main">
        <section id="menu" className="menu section-bg">
            <div className="container" data-aos="fade-up">
                <div className="section-title">
                    <h2>Menu</h2>
                    <p>Check Our Tasty Menu</p>
                </div>
                <div className="row" data-aos="fade-up" data-aos-delay="100">
                    <div className="col-lg-12 d-flex justify-content-center">
                        <ul id="menu-flters">
                            <li data-filter="*" className={active[0]}>All</li>
                            <li data-filter=".filter-vegatable" className={active[1]}>Sale</li>
                            <li data-filter=".filter-pork" className={active[2]}>Best Seller</li>
                            <li data-filter=".filter-specialty" className={active[3]}>Others</li>
                        </ul>
                    </div>
                    <div className="container">
                        <div className="row1">
                        <div className="popup" id="popup-1">
                            <div className="overlay"></div>
                            <div className="content">
                            <div className="close-btn" onClick={togglePopup}>&times;</div>
                                <h1 id="popuptitle">{title}</h1>
                                <h5 id="popuptitle">Seller: {seller}</h5>
                                <span><strong>Php {price}</strong></span>
                                <p>{description}</p>
                                <p><strong>Type: {type}</strong></p>
                                <button className="btn btn-danger my-cart-btn" data-id="1" data-name="Product 1" onClick={addProdtoCart}
                                            data-summary="summary 1" data-price="100" data-quantity="1" data-image="assets/img/Eats Online logo.png">
                                    Add to cart
                                </button>

                            </div>
                            </div>
                            <div className="row">
                            {props.products.slice(startOfList, indexOfList).map((data, index) =>(
                                <div className="col-md-3 text-center" key={index}>
                                    <br/>
                                    <p>{data.title}</p>
                                    <button onClick={(e) => addtoCartPopup(data.title, data.description,  data.price, data.link, data.seller, data.type)}><img alt="" src={data.link} className="menu-img"/></button>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </section>
        <section id="menu" className="menu section-bg">
            <div className="container" data-aos="fade-up">
                <div className="row" data-aos="fade-up" data-aos-delay="100">
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
                                if( indexOfList < props.products.length) {
                                return (<li className="filter-active"><a name="next" onClick={nextornm}>Next</a></li>);
                                }
                            
                            })()
                        }  
                        { 
                            (() => {
                                if( indexOfList >= props.products.length && startOfList === 0) {
                                return (<li className="filter-active">---</li>);
                                }
                            
                            })()
                        }    
                        </ul>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-2 text-center">
                                <ul className="pagination justify-content-center fixed-bottom mb-5">                                          
                                    {
                                        props.num.map((n, index)=>(
                                            <li className="page-item active" key={index}><button name="num" className="page-link rounded-circle m-1" onClick={nextornm}>{n}</button></li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </section>
        <section id="reservation" className="reservation">
            <div className="container" data-aos="fade-up">
                <div className="section-title">
                    <h2>Reservation</h2>
                    <p>Book Your Order</p>
                </div>
                <form role="form" data-aos="fade-up" data-aos-delay="100" onSubmit={sendReservation}>
                    <div className="row">
                        <div className="col-lg-4 col-md-6 form-group mt-3">
                            <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" data-rule="minlen:4" data-msg="Please enter at least 4 chars" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                        <div className="col-lg-4 col-md-6 form-group mt-3">
                            <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" data-rule="email" data-msg="Please enter a valid email" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                        <div className="col-lg-4 col-md-6 form-group mt-3">
                            <input type="text" className="form-control" name="phone" id="phone" placeholder="Your Phone" data-rule="minlen:4" data-msg="Please enter at least 4 chars" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                        <div className="col-lg-4 col-md-6 form-group mt-3">
                            <input type="date" name="date" className="form-control" id="date" placeholder="Date" data-rule="minlen:4" data-msg="Please enter at least 4 chars" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                        <div className="col-lg-4 col-md-6 form-group mt-3">
                            <input type="time" className="form-control" name="time" id="time" placeholder="Time" data-rule="minlen:4" data-msg="Please enter at least 4 chars" onChange={valuesForReservation} required={true}/>
                            <div className="validate"></div>
                        </div>
                        <div className="col-lg-4 col-md-6 form-group mt-3">
                            <input type="number" className="form-control" name="people" id="people" placeholder="# of people" data-rule="minlen:1" data-msg="Please enter at least 1 chars" onChange={valuesForReservation} required={true}/>
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
                        <div className="text-center"><button type="submit" className="reservation-btn scrollto d-lg-flex" >Reserve Now!</button></div>
                </form>
        </div>
    </section>
    <section id="contact" className="contact section-bg">
      <div className="container" data-aos="fade-up">

        <div className="section-title">
          <h2>Contact</h2>
          <p>Contact Us</p>
        </div>
      </div>

      <div className="container" data-aos="fade-up">

        <div className="row mt-5">

          <div className="col-lg-4">
            
              <div className="address">
                <i className="bi bi-geo-alt"></i>
                <h4>Location:</h4>
                <p>ADDRESS PO?</p>
            

              <div className="open-hours">
                <i className="bi bi-clock"></i>
                <h4>Open Hours:</h4>
                <p>Monday-Saturday:<br/>
                  11:00 AM - 2300 PM
                </p>
              </div>

              <div className="email">
                <i className="bi bi-envelope"></i>
                <h4>Email:</h4>
                <p>EatsOnline@gmail.com</p>
              </div>

              <div className="phone">
                <i className="bi bi-phone"></i>
                <h4>Call:</h4>
                <p>09157583872</p>
              </div>

            </div>

          </div>

          <div className="col-lg-8 mt-5 mt-lg-0">

            <form action="" method="post" role="form" className="php-email-form">
              <div className="row">
                <div className="col-md-6 form-group">
                  <input type="text" name="name" className="form-control" id="name2" placeholder="Your Name" required/>
                </div>
                <div className="col-md-6 form-group mt-3 mt-md-0">
                  <input type="email" className="form-control" name="email" id="email2" placeholder="Your Email" required/>
                </div>
              </div>
              <div className="form-group mt-3">
                <input type="text" className="form-control" name="subject" id="subject2" placeholder="Subject" required/>
              </div>
              <div className="form-group mt-3">
                <textarea className="form-control" name="message" rows="8" placeholder="Message" required></textarea>
              </div>
              <div className="my-3">
                <div className="loading">Loading</div>
                <div className="error-message"></div>
                <div className="sent-message">Your message has been sent. Thank you!</div>
              </div>
              <div className="text-center"><button type="submit">Send Message</button></div>
            </form>
          </div>
        </div>
      </div>
    </section>
        </main>
        <footer id="footer">
            <div className="footer-top ">
                <div className="container">
                    
                    <div className="row">
                        <div col-lg-3="true" col-md-6="true">
                            <div className="footer-info">
                                <h3>Eats Online</h3>
                                <p>
                                    LOCATION <br></br>
                                    wala sa wishlist yung address<br></br>
                                    <strong>Phone:</strong> 09157583842<br></br>
                                    <strong>Email: </strong> EatsOnline@gmail.com<br></br>
                                </p>
                                <div className="social-links mt-3">
                                    <a href="#hero" className="twitter"><i className="bx bxl-twitter"></i></a>
                                    <a href="#hero" className="facebook"><i className="bx bxl-facebook"></i></a>
                                    <a href="#hero" className="instagram"><i className="bx bxl-instagram"></i></a>
                                    <a href="#hero" className="google-plus"><i className="bx bxl-skype"></i></a>
                                    <a href="#hero" className="linkedin"><i className="bx bxl-linkedin"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 footer-links">
                            <h4>Useful Links</h4>
                                <ul>
                                    <li><i className="bx bx-chevron-right"></i> <a href="#home">Home</a></li>
                                    <li><i className="bx bx-chevron-right"></i> <a href="#menu">Menu</a></li>
                                    <li><i className="bx bx-chevron-right"></i> <a href="#contact">Contact</a></li>
                                </ul>
                        </div>
                        <div className="col-lg-4 col-md-6 footer-newletter">
                            <h4>Feedback!</h4>
                            <p>adjsafhasjfkkashfhasfjksafsfsahfksfhasjfksj</p>
                            <form action="" method="post">
                                <input type="email" name="email"/>
                                <input type="submit" value="Subscribe"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="copyright">
                    &copy; Copyright <strong><span>Eats Online</span></strong>. All Rights Reserved
                </div>
            </div>
        </footer>
        
    </div>
    );

}
export default Home;
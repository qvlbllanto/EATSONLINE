import React, {useState} from 'react';
import { useHistory, Link } from "react-router-dom";
import {addCart, addLogs} from "./functions.js";
const Search = (props)=>{
    const [title, setTitle] = useState(null);
    const [description, setDesc] = useState(null);
    const [price, setPrice] = useState(null);
    const [seller, setSeller] = useState(null);
    const [type, setType] = useState(null);
    const [value, setValue] = useState(props.search);
    const [results, setResults] = useState([]);
    const [link, setLink] = useState(null);
    const history = useHistory();
    const togglePopup = () => {
        document.getElementById("menu").scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
        document.getElementById("popup-1").classList.toggle("active");
    }

    React.useEffect(() => { 
        const script = document.createElement("script");
        script.src = process.env.PUBLIC_URL + "/assets/js/main.js";
        script.async = true;
        document.body.appendChild(script)
        document.getElementById('menu').scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
        search();
        addLogs("Search");
    }, []);

    const addtoCartPopup = (t, d, p, l,s, ty) => {
        setTitle(t);
        setDesc(d);
        setPrice(p);
        setLink(l);
        setSeller(s);
        setType(ty);
        togglePopup();
    }
    const addProdtoCart = () => {
        if(props.logedin){
            addCart(title, price, description, link, props.idnum, seller, type);
            document.getElementById("popup-1").classList.toggle("active");
        }else{
            goLogin();
        }
    }
    const goLogin = () =>{
        history.push('/login');
      }
    const logout = () =>{
        props.checkLoggedIn(false, {}, null);
    }
    const search = () => {
        let x = props.products;
        var l = [];
        for(let i=0; i<x.length; i++){
            if((x[i].title).toUpperCase().includes(value.toUpperCase()) && !l.includes(x[i])){
                l.push(x[i]);
            }
            
        }
        setResults(l);
    }
    return(
        <div>
                   <header id="header" className="fixed-top d-flex align-items-cente">
            <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between">
            <h1 className="logo me-auto me-lg-0"><a href="#hero"><img alt="" src="assets/img/Eats Online logo.png"/></a></h1>
            <nav id="navbar" className="navbar order-last order-lg-0">
                <ul>
                <li><Link className="nav-link scrollto active" to="/">Home</Link></li>
                <li><Link className="nav-link scrollto" to="/">Menu</Link></li>
                <li><Link className="nav-link scrollto" to="/#contact">Contact</Link></li>
                { 
                    (() => {
                        if(props.logedin){
                            return (<div><li className="dropdown"><a href="#hero"><span>{props.vals.name}</span> <i className="bi bi-chevron-down"></i></a>
                            <ul>
                            <li><Link to="/cart">Cart List</Link></li>
                            <li><a href="#hero">Password Reset</a></li>
                            <li><a href="" ><span onClick={logout}>Logout</span></a></li>
                            </ul>
                        </li></div>);
                        }else{
                            return (<div><li><a href="" onClick={goLogin}><span >SignUp/Login</span></a>
                        </li></div>);
                        }
                    })()
                }
                <li><Link className="nav-link scrollto" id="reserve" to="/#reservation" >Reservation</Link></li>
                </ul>
                <i className="bi bi-list mobile-nav-toggle"></i>
            </nav>
            <Link to="/#reservation" className="reservation-btn2 scrollto d-none d-lg-flex" id="reservebutton">Reservation</Link>
            </div>
        </header>
            <section id="hero" className="d-flex align-items-center">
                <div className="container position-relative text-center text-lg-start" data-aos="zoom-in" data-aos-delay="100">
                    <div className="row">
                        <div className="col-lg-10">
                        <h1>Search</h1>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <input type="text" className="input" placeholder="What are you looking for?" onChange={(e) => setValue(e.target.value)}/>
                    </div>
                    <div className="row">
                            <input type="button" value="search" className="close-btn" onClick={search}/>
                    </div>
                </div>
            </section>
            <main id="main">
            <section id="menu" className="menu section-bg"> 
                <div className="container">
                    <div className="section-title">
                        <h2>Food Available</h2>
                        <p>Results</p>
                    </div>
                    <div className="row" data-aos="fade-up" data-aos-delay="100">
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
                            <br/>
                            </div>
                            <div className="row">
                            {results.map((data, index) =>(
                                <div className="col-md-3 text-center" key={index}>
                                    <br/>
                                    <p>{data.title}</p>
                                    <button onClick={(e) =>  addtoCartPopup(data.title, data.description,  data.price, data.link, data.seller, data.type)}><img alt="" src={data.link} className="menu-img"/></button>
                                </div>
                            ))}
                            </div>
                        </div>
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
export default Search;
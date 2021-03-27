import React, {useState} from 'react';
import { useHistory, Link } from "react-router-dom";
import {addLogs, deleteITM, getCartData, buyItems, updateAmount} from "./functions.js"
const Cart = (props)=>{
    const [title, setTitle] = useState(null);
    const [description, setDesc] = useState(null);
    const [price, setPrice] = useState(null);
    const [cart, setCart] = useState([]);
    const [seller, setSeller] = useState(null);
    const [type, setType] = useState(null);
    const [amount, setAmount] = useState(0);
    const [cartid, setCartId] = useState(null);
    const history = useHistory();
    let total_cart_amt = document.getElementById('total_cart_amt');
    let discountCode = document.getElementById('discount_code1');
    React.useEffect(()=>{
        const script = document.createElement("script");
        script.src = process.env.PUBLIC_URL + "/assets/js/main.js";
        script.async = true;
        document.body.appendChild(script)
        addLogs("Cart");
        countMoney().then(d=>{
            setAmount(d);
        });
    }, [0]);

    const countMoney = () =>{
        return new Promise((resolve, reject)=>{
            getCartData(props.idnum).then((x) =>{
                setCart(x);
                let num = 0;
                for (let i in x) {
                    num+=parseInt(x[i][1].price);
                }
                
                resolve(num);
            })
        });
    }
  
    const togglePopup = () => {
        document.getElementById("menu").scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
        document.getElementById("popup-1").classList.toggle("active");
    }
    const  discount_code = () => {
        let totalamtcurr = parseInt(total_cart_amt.innerHTML);
        let error_trw = document.getElementById('error_trw');
        if(discountCode.value === '1234'){
            let newtotalamt = totalamtcurr - 15;
            total_cart_amt.innerHTML = newtotalamt;
            error_trw.innerHTML = "Hurray! code is valid";
        }else{
            error_trw.innerHTML = "Try Again! Valid code";
        }
    }
    const deleteItem= (e, d) => {
        if(props.logedin){
            deleteITM(props.idnum, d).then(x =>{
                if(x){
                    countMoney().then(o=>{
                        setAmount(o);
                    });
                }
            });
            
        }else{
            goLogin();
        }
    }

    const del = (e, index) =>{
        cart.splice(index,1);
    }

    const goLogin = () =>{
        history.push('/login');
      }
    const logout = () =>{
        history.push("/");
        props.checkLoggedIn(false, {}, null);
    }
    const buyNow = () =>{
        if(cart.length!=0){
            buyItems(cart, amount, props.idnum).then((x)=>{
                if(x){
                    countMoney().then(d=>{
                        setAmount(d);
                    });
                }
            });
        }
    }
    
    const add = (e, index) =>{
        let i = cart;
        i[index][1].amount += 1;
        i[index][1].amount += 1;
        setCart(i);
        document.getElementById("textbox0").value=i[index][1].amount;
    }
    const minus = (e, index) =>{
        let i = cart;
        if(i[index][1].amount > 1){
            i[index][1].amount -= 1;
            setCart(i);
            document.getElementById("textbox0").value=i[index][1].amount;
        }
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
                            <li><a href="#hero">Cart List</a></li>
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
                        <h1>Your Cart</h1>
                        </div>
                        <div className="row">
                            <span type="text" className="input">{'Your Total: P '+amount} </span>
                        </div>
                        <div className="row">
                            <input type="button" value="Cash Out" onClick={buyNow} className="close-btn"/>
                        </div>
                    </div>
                </div>
        </section>
        <main id="main">
            <section id="menu" className="menu section-bg"> 
                <div className="container">
                    <div className="section-title">
                        <h2>Food List</h2>
                        <p>Your Orders</p>
                    </div>
                    <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-10 col-11 mx-auto">
                            <div class="row mt-5 gx-3">
                                <div class="col-md-12 col-lg-8 col-11 mx-auto main_cart">
                                    
                                    <div class="card p-4">
                                        <h2 class="py-4 font-weight-bold">Cart List : {props.vals.name}</h2>
                                        <div class="container">
                                        <button className="reservation-btn" >Save</button>
                                        </div>
                                        <br/>
                                        {cart.map((d, index)=>{
                                            return(
                                             <div class="row" key={index}>
                                             <div class="col-md-5 col-11 mx-auto bg-light d-flex justify-content-center align-items-center product_img">
                                                 <img src={d[1].link} class="img-fluid"/>
                                             </div>
                                             <div class="col-md-7 col-11 mx-auto px-4 mt-2">
                                                 <div class="row">
                                                         <h2 class="mb-4">{d[1].title}</h2>
                                                         <p class="mb-2">{d[1].desc}</p>
                                                         <p class="mb-2">Seller: {d[1].seller}</p>
                                                         <p class="mb-2">Type: {d[1].type}</p>
                                                         <p class="mb-3">Price: Php{d[1].price}</p>
                                                     <br/>
                                                     <ul class="pagination">
                                                             <li class="page-item">
                                                             <button class="page-link " onClick={(e)=>minus(e, index)}>
                                                             <i class="fas fa-minus"></i> </button>
                                                             </li>
                                                             <li class="page-item"><input type="text" key={index} class="page-link" value={d[1].amount} id={"textbox"+index}/>
                                                             </li>
                                                             <li class="page-item">
                                                             <button class="page-link" onClick={(e) => add(e, index)}> <i class="fas fa-plus"></i></button>
                                                             </li>
                                                         </ul>
                                                  
                             
                                                   
                                                 </div>
                                                 <div class="row">
                                                     <div class="col-8 d-flex remove_wish">
                                                         <a class="fas fa-trash-alt" href="#" name = {index} onClick={(e)=>del(e, index)}></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        
                                                     </div>
                                                     
                                                 </div>
                                                 <br/>
                                             </div>
                                         </div>);
                                        })}
                                           
                                    </div>
                                </div>
                                <div class="col-md-12 col-lg-4 col-11 mx-auto">
                                <div class="right_side p-4 shadow bg-white">
                                        <h2 class="product_name mb-5">The Total Amount Of</h2>
                                        <div class="price_indiv d-flex justify-content-between">
                                            <p>Product amount</p>
                                            <p>Php<span id="product_total_amt">{amount}</span></p>
                                        </div>
                                        <div class="price_indiv d-flex justify-content-between">
                                            <p>Shipping Fee</p>
                                            <p>Php50</p>
                                        </div>
                                        <hr />
                                        <div class="total-amt d-flex justify-content-between font-weight-bold">
                                            <p>The total amount of (including VAT)</p>
                                            <p>Php<span id="total_cart_amt">1111110.00</span></p>
                                        </div>
                                        
                                        <button className="reservation-btn scrollto d-lg-flex" >Checkout</button>
                                        
                                    </div>
                                    <div class="discount_code mt-3 shadow">
                                        <div class="card">
                                            <div class="card-body">
                                                <a class="d-flex justify-content-between" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                                Add a discount code (optional)
                                                <span><i class="fas fa-chevron-down pt-1"></i></span>
                                                </a>
                                                <div class="collapse" id="collapseExample">
                                                    <div class="mt-3">
                                                        <input type="text" name="" id="discount_code1" class="form-control font-weight-bold" placeholder="Enter the discount code"/>
                                                        <small id="error_trw" class="text-dark mt-3">code for coupon</small>
                                                    </div>
                                                <button class="btn btn-primary btn-sm mt-3" onClick={discount_code}>Apply</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>     
                                    <div class="mt-3 shadow p-3 bg-white">
                                        <div class="pt-4">
                                            <h5 class="mb-4">Expected delivery date</h5>
                                                <p>MM-DD-YYYY</p>
                                                    <p>HH-MM-SS</p>
                                        </div>
                                    </div>   
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
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
        </main>
        </div>
    );
}
export default Cart; 

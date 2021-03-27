import React, {useState} from 'react';
import { useHistory, Link } from "react-router-dom";
import {addLogs} from "./functions.js"
const Account = (props)=>{
    const history = useHistory();
    const [active, setActive] = useState(["filter-active", "", "",""]);
    const goLogin = () =>{
        history.push('/login');
      }
    React.useEffect(()=>{
        const script = document.createElement("script");
        script.src = process.env.PUBLIC_URL + "/assets/js/main.js";
        script.async = true;
        document.body.appendChild(script)
        addLogs("Accounts");
    }, []);
    const logout = () =>{
        props.checkLoggedIn(false, {}, null);
    }
    return(
        <div>
            <header id="header" className="fixed-top d-flex align-items-cente">
            <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between">
            <h1 className="logo me-auto me-lg-0"><a href="#hero"><img alt="" src="assets/img/Eats Online logo.png"/></a></h1>
            <nav id="navbar" className="navbar order-last order-lg-0">
                <ul>
                <li><a className="nav-link scrollto active" href="#hero">Home</a></li>
                <li><a className="nav-link scrollto" href="#menu">Menu</a></li>
                <li><a className="nav-link scrollto" href="#contact">Contact</a></li>
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
                <li><a className="nav-link scrollto" id="reserve" href="#reservation" >Reservation</a></li>
                </ul>
                <i className="bi bi-list mobile-nav-toggle"></i>
            </nav>
            <a href="#reservation" className="reservation-btn2 scrollto d-none d-lg-flex" id="reservebutton">Reservation</a>
            </div>
        </header>
        <section id="hero" className="d-flex align-items-center">
            <div className="container position-relative text-center text-lg-start" data-aos="zoom-in" data-aos-delay="100">
                <div className="row">
                    <div className="col-lg-10">
                        <h1>Your <span>Account</span></h1>
                        <h2>Manage your personal details</h2>
                    </div>
                    
                </div>
            </div>
            
        </section>
        <main id="main">
        <section id="menu" className="menu section-bg">
        <div className="row">   
            <center>
            <div className="row">
                    <div className="col-lg-15">
                    <h1>Account Details</h1>
                    </div>
                </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-4 text-center">               
                        <img className="menu-img" src="./assets/img/Eats Online logo.png"/><br/>
                        <input type="button" value="upload" style={{width: "63.4%"}}></input>
                    </div>
                    <div className="col-md-8 text-center"><br/>
                        <div className="row">
                            <input className="form-control"></input>
                            <input className="form-control"></input>
                            <input className="form-control"></input>
                            <input className="form-control"></input>
                        </div>
                    </div>
                </div>
            </div>
            </center>
        </div>
        </section>
        <section id="history" className="menu section-bg">
            <div className="row">   
                <center>
                <div className="row">
                    <div className="col-lg-15">
                    <h1>Purchased History</h1>
                    <h2 class="title">History Transaction : Angellica Celeste</h2> 
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div class="overflow-x">
                            <table class="table">
                                <thead class="thead-dark">
                                    <tr>
                                        <th>ID</th>
                                        <td>Product Name</td>
                                        <td>Quantity</td>
                                        <td>Price</td>
                                        <td>Status</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Product 1</td>
                                        <td>2</td>
                                        <td>PHP 100.00</td>
                                        <td><div class="flex-btn"></div>
                                            <p class="label label-warning">Pending</p></td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Product 1</td>
                                        <td>2</td>
                                        <td>PHP 100.00</td>
                                        <td><div class="flex-btn"></div>
                                            <p class="label label-success">Success</p></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                </center>
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
//hahahha wait try ko
//ayan okay na
export default Account;
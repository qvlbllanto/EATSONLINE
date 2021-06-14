import React from 'react';
import { useState } from 'react';
import { useHistory, Link } from "react-router-dom";
import {addLogs, getData, waitloop, NumberFormat, addCart, addAdvanceOrderList} from "./functions.js"
import anime from "animejs";
import MenuDetails from "./menu-details";
import TopSide from "../components/TopSide.js"
const AdvanceOrder = (props) =>{
	const [indexOfList, setIndexOfList] = useState(6);
    const [startOfList, setStartOfList] = useState(0);
	const history = useHistory();
	const [products, setProducts] = useState([]);
	const [rate, setRate] = useState([]);
	const [category, setCategory] = useState([]);
	const [val, setVal] = useState([]);
	const [num, setNum] = useState([]);
	const [ch, setCh] = useState(false);
	const [ch2, setCh2] = useState(true);
	const [suppliers, setSuppliers] = useState([]);
	const [clicked, setClicked] = useState(false);
	const [t, setT] = useState(null);
	const [s, setS] = useState(null);
    React.useEffect(()=>{
        if(!ch){
			props.setP("Advance");
            addLogs("Advance Order");
            props.set(true);
            setCh(true);
			anime
				.timeline({ loop: true })
				.add({
					targets: ".ml15 .word",
					scale: [14, 1],
					opacity: [0, 1],
					easing: "easeOutCirc",
					duration: 1500,
					delay: (el, i) => 800 * i
				})
				.add({
					targets: ".ml15",
					opacity: 0,
					duration: 1000,
					easing: "easeOutExpo",
					delay: 1000
				});
				
        }
        const timer = setTimeout(() => {
			if(ch2){
            getData().then((data) =>{
				let o = [];
				data[0].forEach((d)=>{
					try{
						let avgrating = 0;
						let co = 0;
						for(let x in d[1].comments){
							avgrating+=parseInt(d[1].comments[x].rating);
							co++;
						}
						if(avgrating!==0){
							o.push([parseInt(avgrating/co), co]);
						}
					}catch(e){
						console.log(e);
					}
				})
				setRate(o);
				
				
                setProducts(data[0]);
				setSuppliers(data[2]);
		
				
				rate.forEach((d, i)=>{
					if(i>=startOfList){
						if(document.getElementById(startOfList+i+""+d[0])!==null){
							document.getElementById(startOfList+i+""+d[0]).checked=true;
						}
					}
				});
                setCategory(data[1]);
                waitloop(data).then((d)=>{
                    setNum(d);
                });
            });}else{
				rate.forEach((d, i)=>{
					if(i>=startOfList){
						if(document.getElementById(startOfList+i+""+d[0])!==null){
							document.getElementById(startOfList+i+""+d[0]).checked=true;
						}
					}
				});
			}
           }, 500);
           return () => clearTimeout(timer);
    });


	const changeMenuD = (v, typ,sel) =>{
		props.setMenu(v);
		setT(typ);
		setS(sel);
	}

	const goDetails = (v,t,sel) =>{
        new Promise((resolve, reject)=>{
            props.setMenu(v);
            setT(t);
            setS(sel)
            resolve(true);
        }).then((x)=>{
            if(x){
            setClicked(true);}

        })
		
        //history.push('/menu-details');
		
     }


	 const setFalse1 = () =>{
		 new Promise(()=>{
			rate.forEach((d, i)=>{
				if(i>=startOfList){
					if(document.getElementById(startOfList+i+""+d[0])!==null){
						document.getElementById(startOfList+i+""+d[0]).checked=false;
					}
				}
			});
		 })	
	 }
	 const search = (value, v) => {
		 setClicked(false);
		 if(value==="All"){
			setIndexOfList(6);
			setStartOfList(0);
			setFalse1();
			 setVal([]);
			 setCh2(true);
		 }else{
			let x =products;
			var l = [];
			for(let i=0; i<x.length; i++){
				let valx = v==="prod"?x[i][1].type:v==="supp"?x[i][1].seller:x[i][1].title;
				let bool = v==="search"?valx.toUpperCase().includes(value.toUpperCase()):valx===value;
				if(bool){
					l.push(x[i]);
				}
			}
			if(l.length===0){
				l=[null];
			}
			waitloop([l]).then((d)=>{
				let o = [];
				l.forEach((d)=>{
					try{
						let avgrating = 0;
						let co = 0;
						for(let x in d[1].comments){
							avgrating+=parseInt(d[1].comments[x].rating);
							co++;
						}
						if(avgrating!==0){
							o.push([parseInt(avgrating/co), co]);
						}
					}catch(e){
						console.log(e);
					}
				})
				setRate(o);
				setCh2(false);
				setNum(d);
				setVal(l);
				setIndexOfList(6);
				setStartOfList(0);
				setFalse1();
			});
		}
    }

	 const nextornm = (e) =>{
		setFalse1();
        document.getElementById("home_menu").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
        if(e.target.name === "next"){
          setIndexOfList(indexOfList+6);
          setStartOfList(startOfList+6);
        }else if(e.target.name==="num"){
            const s = 6 * parseInt(e.target.innerHTML);
            setIndexOfList(s);
            setStartOfList(s-6);

        }
      
      }
      const prevContent = (e) =>{
		setFalse1();
          document.getElementById("home_menu").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
          if(e.target.name === "prev"){
            setIndexOfList(indexOfList-6);
            setStartOfList(startOfList-6);
          }
	
      }
	  const goLogin = () =>{
        history.push('/login');
      }
	 const addToAdvlist = (menuid, title, price, desc, link, seller, type) => {
        if(props.logedin){
            let setss = {
                "title": title,
                "price": price,
                "desc": desc,
                "link": link,
                "type": type,
                "seller": seller,
                "key":menuid
            }
            addAdvanceOrderList(props.idnum, menuid, setss);
        }else{
            goLogin();
        }
    }
    return (
		<div>        
			<TopSide right={false} first="Advance " second="Order" desc="We sell food that will satisfy your taste!" img={["./assets/img/sliderimg/0 Our Menu Image.png"]}/>
		{/* <section id="home_hero" className="d-flex align-items-center">
		
		<div id="myCarouel" className="fullscreen carousel slide " data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="item active">
                            <img src="./assets/img/sliderimg/0 Our Menu Image.png" style={{width:'100%', backgroundPosition: 'center bottom'}}/>
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
                        <h1>Our <span className="blinking">Menu</span></h1>
                        <h2>We sell food that will satisfy your taste!</h2>
                    </div>
                </div>
                <br/>
            </div>
        </section> */}
		<main id="main">
        <section id="home_menu" className="menu section-bg">
			<section>
			<h1 className="ml15"style={{textAlign: 'center'}}>
				<span className="word">Advance Order</span>
			</h1>
			<div className="container">
				<div className="breadcrumbs">
					<ol className="breadcrumb">
					<li><a onClick={()=>setClicked(false)} style={{cursor: 'pointer'}}>Menu</a></li>
					<li className={clicked?"active":''}><i className="fa fa-chevron-left" aria-hidden="true"></i></li>
					<li className={clicked?"active":''}>Menu Details</li>
					</ol>
				</div>
				<div className="row">
					<div className="col-sm-3" >
					<div className="left-sidebar">
						
						<h2>Search</h2>
						<div className="panel-group category-products" id="accordian" style={{borderColor:'transparent'}}><input type="text" onChange={(e)=>search(e.target.value, "search")} placeholder="Search products" className="form-control" style={{height: '100%'}}/>
						</div>
						</div>
						<div className="left-sidebar">
						
							<h2>Category</h2>
							<div className="panel-group category-products" id="accordian">
							<div className="panel panel-default">
									<div className="panel-heading">
										<h4 className="panel-title">
											<a style={{cursor: 'pointer'}} onClick={(e)=>search("All")}>
												All
											</a>
										</h4>
									</div>
								</div>
								{category.map((d, index)=>{
									return(
										<div className="panel panel-default" key={index}>
									<div className="panel-heading">
										<h4 className="panel-title">
											<a style={{cursor: 'pointer'}} onClick={(e)=>search(d, "prod")}>
												{d}
											</a>
										</h4>
									</div>
								</div>
									)
								})}
								</div>
						</div>
						<div className="left-sidebar">
						
							<h2>Supplier</h2>
							<div className="panel-group category-products" id="accordian">
								{suppliers.map((d, index)=>{
									return(
										<div className="panel panel-default" key={index}>
									<div className="panel-heading">
										<h4 className="panel-title">
											<a style={{cursor: 'pointer'}} onClick={(e)=>search(d[0], "supp")}>
												{d[0]} ({d[1]})
											</a>
										</h4>
									</div>
								</div>
									)
								})}
								</div>
						</div>
					</div>
					{!clicked?
					<div className="col-sm-9 padding-right">
						<div className="features_items">
							<h2 className="title text-center">Product Items</h2>
							{val.length===0?products.slice(startOfList, indexOfList).map((d, i)=>{
								return(
								<div className="col-sm-4" key={i} >
								<div className="product-image-wrapper" style={{borderWidth: '1px',  borderColor: 'black', borderRadius: '10px'}}>
									<div className="single-products">
											<div className="productinfo text-center" >
												<img src={d[1].link} alt={d[1].link} style={{width: '100%', height: '230px'}}/>
												<h2>{d[1].title}</h2>
												<p>By: {d[1].seller}</p>
												<p>Category: {d[1].type}</p>
												<p style={{fontSize: '14px'}}>Stock : {parseInt(d[1].numberofitems)!==0?d[1].numberofitems:'Out of stock!'}</p>
											</div>
											
											<div className="product-overlay">
												<div className="overlay-content">
													<h2>{d[1].description}</h2>
													<p>₱{NumberFormat(Number(d[1].price).toFixed(2))}</p>
													<a onClick={(e)=>goDetails(d[0],d[1].type, d[1].seller)} className="btn btn-default add-to-cart"  style={{borderRadius: '50px'}}><i className="fa fa-shopping-cart"></i>View</a>
												</div>
											</div>
									</div>
									<div style={{position:'absolute', bottom: 40, width:'85%'}}>
										<center>
									<div className="text-center">
											<a onClick={(e)=>parseInt(d[1].numberofitems)>0?addToAdvlist(d[0], d[1].title, d[1].price, d[1].description, d[1].link, d[1].seller, d[1].type):null} className="btn btn-default" style={{ marginBottom: '40px',  fontSize: '15px' ,position: 'relative' ,borderRadius: '50px'}} ><i className="fa fa-shopping-cart"></i>{parseInt(d[1].numberofitems)>0?'Add to List':'Out of Stock'}</a>
									</div>
									<div className="choose" >
									<h5><a href="#">Ratings: ({startOfList+i<rate.length?rate[startOfList+i][1]: 0})</a></h5>
										<ul className="nav nav-pills nav-justified">
											
											
											<div className="rating" style={{pointerEvents: 'none', width: '100%'}}>
												<input type="radio" name={startOfList+i+"rating"} value="5" id={startOfList+i+"5"} readOnly={true}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="4" id={startOfList+i+"4"} readOnly={true}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="3" id={startOfList+i+"3"} readOnly={true}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="2" id={startOfList+i+"2"} readOnly={true}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="1" id={startOfList+i+"1"} readOnly={true}/><label>☆</label>
											</div>
											
										</ul>
									</div>
									</center>
									</div>
									
								</div>
							</div>
								)
							}):val.length===1 && val[0] === null?null:val.slice(startOfList, indexOfList).map((d, i)=>{
								return(
								<div className="col-sm-4" key={i}>
								<div className="product-image-wrapper" style={{borderWidth: '1px', borderColor: 'black', borderRadius: '10px'}}>
									<div className="single-products" >
											<div className="productinfo text-center">
												<img src={d[1].link} alt="" style={{width: '100%',   height: '230px'}}/>
												<h2>{d[1].title}</h2>
												<p>By: {d[1].seller}</p>
												<p>Category: {d[1].type}</p>
												<p style={{fontSize: '14px'}}>Stock: {parseInt(d[1].numberofitems)!==0?d[1].numberofitems: 'Out of stock!'}</p>
											</div>
											<div className="product-overlay">
												<div className="overlay-content">
													<h2>{d[1].description}</h2>
													<p>Php{d[1].price}</p>
													<a onClick={(e)=>goDetails(d[0], d[1].type, d[1].seller)} className="btn btn-default add-to-cart"><i className="fa fa-shopping-cart"></i>View</a>
												</div>
											</div>
									</div>
									<div style={{position:'absolute', bottom: 40, width:'85%'}}>
										<center>
									<div className="text-center">
											<a onClick={(e)=>parseInt(d[1].numberofitems)>0?addToAdvlist(d[0], d[1].title, d[1].price, d[1].description, d[1].link, d[1].seller, d[1].type):null} className="btn btn-default" style={{borderRadius: '50px', marginBottom: '40px',  fontSize: '15px' ,position: 'relative'}}><i className="fa fa-shopping-cart"></i>{parseInt(d[1].numberofitems)>0?'Add to List':'Out of Stock'}</a>
									</div>
									<div className="choose" >
									<h5><a href="#">Ratings: ({startOfList+i<rate.length?rate[startOfList+i][1]: 0})</a></h5>
										<ul className="nav nav-pills nav-justified">
											
											
											<div className="rating" style={{pointerEvents: 'none', width: '100%'}}>
												<input type="radio" name={startOfList+i+"rating"} value="5" id={startOfList+i+"5"} readOnly={true}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="4" id={startOfList+i+"4"} readOnly={true}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="3" id={startOfList+i+"3"} readOnly={true}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="2" id={startOfList+i+"2"} readOnly={true}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="1" id={startOfList+i+"1"} readOnly={true}/><label>☆</label>
											</div>
											
										</ul>
									</div>
									</center>
									</div>
								</div>
							</div>
								)
							})}
						</div>
							<ul className="pagination">
							{startOfList!==0?<li ><a style={{cursor:'pointer', color:'black'}} name="prev" onClick={prevContent}>{'<<'}</a></li>:null}
							{num.map((d, i) =>{
								return(
									<li key={i}><a style={{cursor:'pointer' , color:'black'}} onClick={nextornm} name="num">{d}</a></li>
								)
							})}
							{val.length===0?indexOfList<products.length?<li><a style={{cursor:'pointer' , color:'black'}} name="next"  onClick={nextornm}>{'>>'}</a></li>:null:indexOfList<val.length?<li><a style={{cursor:'pointer' , color:'black'}} name="next"  onClick={nextornm}>{'>>'}</a></li>:null}
							</ul>
					</div>:<MenuDetails  toCart = {false} name={props.name} idnum={props.idnum}  logedin={props.logedin} legitkey = {props.legitkey} menu = {props.menu} set = {props.set} type = {t} seller = {s} changeM ={changeMenuD}/>}
				</div>
			</div>
		</section>
	</section></main>
	<footer id="footer">
            <div className="footer-top " style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?{backgroundColor: '#faff65'}:{backgroundColor: 'white', color: 'black'}}>
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
                                    <strong style={props.legitkey===true && props.logedin===true && props.vals!==null && props.idnum!==null?null:{color: 'black'}}>Email: </strong> eats.onlne@gmail.com<br></br>
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
    )
}

export default AdvanceOrder;

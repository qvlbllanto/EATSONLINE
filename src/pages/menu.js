
import React from 'react';
import { useState } from 'react';
import { useHistory, Link } from "react-router-dom";
import {todaydate, getDatesz, checkifincart, addLogs, getData,getData2, waitloop, NumberFormat, addCart} from "./functions.js"
import anime, { set } from "animejs";
import MenuDetails from "./menu-details";
import TopSide from "../components/TopSide.js"
const Menu = (props) =>{
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
	const [qty, setQty] = useState([]);
	const [t, setT] = useState(null);
	const [s, setS] = useState(null);
	const [once, setOnce] = useState(false);
	const [v, setv] = useState(null);
	const [ty, setTy] = useState(null);
	const [incart, setInCart] = useState(null);
	const [dates, setDates] = useState([]);
	const [chforD, setchforD] = useState([]);
    React.useEffect(()=>{
        if(!ch){
			props.setP("Menu");
            addLogs("Home");
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
			
			if(props.location.ch){
				goDetails(props.location.val.id, props.location.val.type, props.location.val.seller);
			}
        }
        const timer = setTimeout(() => {
			getDatesz().then((x)=>{
				setDates(x);
			})
			if(ch2){

            getData(qty).then(async(data) =>{
				setCategory(data[1]);
				setInCart(await checkifincart(data[0], props.idnum));
				setProducts(data[0]);
				setchforD(data[5]);
				setSuppliers(data[2]);
				setRate(data[3]);
				setQty(data[4]);
				for(let i=0; i<6;i++){
					try{
						if(document.getElementById(startOfList+i+""+rate[startOfList+i][0])!==null){
							document.getElementById(startOfList+i+""+rate[startOfList+i][0]).checked=true;
						}
					}catch(e){
						continue;
					}
				}
                waitloop(data).then((d)=>{
                    setNum(d);
                });
            });}else{
				getData2(ty,v,qty).then(async(data)=>{
					setInCart(await checkifincart(data[0], props.idnum));
					setVal(data[0]);
					setRate(data[3]);
					setQty(data[4]);
					setchforD(data[5]);
					setFalse().then(()=>{
						for(let i=0; i<6;i++){
							try{
								if(document.getElementById(startOfList+i+""+rate[startOfList+i][0])!==null){
									document.getElementById(startOfList+i+""+rate[startOfList+i][0]).checked=true;
								}
							}catch(e){
								continue;
							}
						}
					})
					
					waitloop(data).then((d)=>{
						setNum(d);
					});
				})
			}
           }, 1000);
           return () => clearTimeout(timer);
    });


	const changeMenuD = (v, typ,sel) =>{
		
		props.setMenu(v);
		setT(typ);
		setS(sel);	
	}
	const toggle = (className, displayState) => {
		let elements =document.getElementsByName(className);
		for (var i = 0; i < elements.length; i++){
			
			elements[i].checked = displayState;
		}
	}
	const setFalse =()=>{
		return new Promise((resolve, reject)=>{
			for(let i=0; i<6;i++){
				toggle(startOfList+i+"rating", false);
			}
			resolve(true);
		})
			
		
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
     }


		// const search = (value, v) => {
		// 	setOnce(false);
		// 	setClicked(false);
		// 	if(value==="All"){
		// 		setIndexOfList(6);
		// 		setStartOfList(0);
		// 		setFalse1();
		// 		setVal([]);
		// 		setCh2(true);
		// 	}else{
		// 		let x =products;
		// 		var l = [];
		// 		for(let i=0; i<x.length; i++){
		// 			let valx = v==="prod"?x[i][1].type:v==="supp"?x[i][1].seller:x[i][1].title;
		// 			let bool = v==="search"?valx.toUpperCase().includes(value.toUpperCase()):valx===value;
		// 			if(bool){
		// 				l.push(x[i]);
		// 			}
		// 		}
		// 		if(l.length===0){
		// 			l=[null];
		// 		}
		// 		waitloop([l]).then((d)=>{
		// 			let o = [];
		// 			let qt = [];
		// 			l.forEach((d)=>{
		// 				qt.push(1);
		// 				try{
		// 					let avgrating = 0;
		// 					let co = 0;
		// 					for(let x in d[1].comments){
		// 						avgrating+=parseInt(d[1].comments[x].rating);
		// 						co++;
		// 					}
		// 					if(avgrating!==0){
		// 						o.push([parseInt(avgrating/co), co]);
		// 					}
		// 				}catch(e){
		// 					console.log(e);
		// 				}
		// 			})
		// 			setOnce(true);
		// 			setQty(qt);
		// 			setRate(o);
					
		// 			setNum(d);
		// 			setVal(l);
					
		// 			setFalse1();
		// 		});
		// 	}
		// }

	 const nextornm = (e) =>{
		setFalse().then(()=>{
			document.getElementById("home_menu").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
			if(e.target.name === "next"){
			  setIndexOfList(indexOfList+6);
			  setStartOfList(startOfList+6);
			}else if(e.target.name==="num"){
				const s = 6 * parseInt(e.target.innerHTML);
				setIndexOfList(s);
				setStartOfList(s-6);
			}
		})
      
      
      }
      const prevContent = (e) =>{
		setFalse().then(()=>{
          document.getElementById("home_menu").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
          if(e.target.name === "prev"){
            setIndexOfList(indexOfList-6);
            setStartOfList(startOfList-6);
          }
		});
      }
	  const goLogin = () =>{
        history.push('/login');
      }
	 const addProdtoCart = (menuid, title, price, desc, link, seller, type, id, qty, discount, startD, endD) => {
        if(props.logedin){
           addCart(menuid, title, price, desc, link, props.idnum, seller, type, id, qty, discount, startD, endD);
				
        }else{
            goLogin();
        }
    }

	const addamt =(index)=> {
		let quant = qty.map((d, i)=>i==index?d+=1:d);
		console.log(quant);
		setQty(quant);
	}
	const reduceamt =(index)=> {
		let quant = qty.map((d, i)=>i==index?d-=1:d);
		setQty(quant);
	}
	const change = (what, val, fort) =>{
		setFalse().then(()=>{
			setQty([]);
			setVal([]);
			setchforD([]);
			setProducts([]);
			setClicked(false);
			setIndexOfList(6); 
			setStartOfList(0); 
			if(!fort){
				setTy(what);
				setv(val); 
			}
			
			setCh2(fort);
		})
	}
	const toggletoHighlight = (className, value) =>{
		let elements =document.getElementsByClassName(className);
		for (var i = 0; i < elements.length; i++){
			if(elements[i].lastChild.lastChild.innerHTML===value){
				elements[i].style.backgroundColor="#696763";
				elements[i].lastChild.style.backgroundColor="#696763"
				elements[i].lastChild.lastChild.style.color="white";
			}else{
				elements[i].style.backgroundColor="transparent";
				elements[i].lastChild.style.backgroundColor="transparent"
				elements[i].lastChild.lastChild.style.color="#696763";
			}
		}
	}
	const highlight = (e)=>{
		toggletoHighlight("panel-heading", e.target.innerHTML);
	}
    return (
		<div>
			<TopSide right={false} first="Our " second="Menu" desc="Your One-stop Shop for Regional Delicacies!" img={["./assets/img/0 NEW SLIDER/Menu.png"]}/>
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
			<h1 className="ml15"style={{textAlign: 'center'}}>
				<span className="word">Order Now</span>
			</h1>
			<div className="container">
				<div className="breadcrumbs">
					<ol className="breadcrumb">
					<li><a onClick={()=>setClicked(false)} style={{cursor: 'pointer'}}>Menu</a></li>
					<li className={clicked?"active":''}><i className="fa fa-chevron-left" aria-hidden="true" style={{color: 'black'}}></i></li>
					<li className={clicked?"active":''} style={!clicked?{visibility: 'hidden'}:null}>Menu Details</li>
					</ol>
				</div>
				<div className="row">
					<div className="col-sm-3" >
					<div className="left-sidebar">
						<h2>Search</h2>
						<div className="panel-group category-products" id="accordian" style={{borderColor:'transparent'}}>							
						<input type="text" onChange={(e)=>{change("title", e.target.value, false)}} placeholder="Search products" className="form-control" style={{height: '100%'}}/>
						</div>
					</div>
						<div className="left-sidebar">
						
							<h2>Category</h2>
							<div className="panel-group category-products" id="accordian">
							<div className="panel panel-default">
									<div className="panel-heading">
										<h4 className="panel-title">
											<a style={{cursor: 'pointer'}} onClick={(e)=>{highlight(e);change(null, null, true)}}>
												All
											</a>
										</h4>
									</div>
								</div>
								{category.map((d, index)=>{
									return(!d.toLowerCase().includes("others")?
										<div className="panel panel-default" key={index}>
									<div className="panel-heading">
										<h4 className="panel-title" >
											<a style={{cursor: 'pointer'}}  onClick={(e)=>{highlight(e);change("type", d, false)}}>
												{d}
											</a>
										</h4>
									</div>
								</div>
									:null)
								})}
								{category.map((d, index)=>{
									return(d.toLowerCase().includes("others")?
										<div className="panel panel-default" key={index}>
									<div className="panel-heading">
										<h4 className="panel-title" >
											<a style={{cursor: 'pointer'}}  onClick={(e)=>{highlight(e);change("type", d, false)}}>
												{d}
											</a>
										</h4>
									</div>
								</div>
									:null)
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
											<a style={{cursor: 'pointer'}} onClick={(e)=>{highlight(e);change("seller", d[0], false)}}>
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
								<div className="product-image-wrapper" style={{borderWidth: '4px',  borderColor: 'black', borderRadius: '10px'}}>
									<div className="single-products">
											<div className="productinfo text-center" >
												<div className="ribbon-wrapper">
												{chforD[startOfList+i]?<div className="ribbon">{d[1].discount} % Off</div>:null}
													<img src={d[1].link} alt={d[1].link} style={{width: '100%', height: '230px'}}/>
												</div>
												<h2>{d[1].title}</h2>
												<p>By: {d[1].seller}</p>
												<p>Category: {d[1].type}</p>
												
												<p style={{fontSize: '14px'}}>Stock: <span style={parseInt(d[1].numberofitems)<=0?{fontWeight: 'bold'}:null}>{parseInt(d[1].numberofitems)!==0?d[1].numberofitems:'For Advanced Order'}</span></p>
												<select className="form-control alterationTypeSelect" style={{width: '90%', height: '35px', marginLeft:'5%', marginRight:'5%'}}>
												<option selected disabled >Check for available Dates</option>
													{dates.map((d2, ib)=>
													d2[0]===d[0]?d2[1].length!==0?d2[1].map((d3, i2)=><option key={i2} disabled >{new Date(d3[1].date).toDateString()}</option>):<option key={ib} disabled>No available date for advance order</option>
													:null)}
												</select>
											</div>
											<div className="product-overlay">
												<div className="overlay-content">
													<h2>{d[1].description}</h2>
													<div className="ribbon-wrapper-over">
													{chforD[startOfList+i]?<div className="ribbon-over">{d[1].discount}% Off</div>:null}
													</div>
													{chforD[startOfList+i]?<div><p>Old Price ₱{NumberFormat(Number(d[1].price).toFixed(2))}</p><p><strong>New Price: ₱{NumberFormat(Number(d[1].price-(d[1].price*(d[1].discount/100))).toFixed(2))}</strong></p></div>:<p> ₱{NumberFormat(Number(d[1].price).toFixed(2))}</p>}
													<a onClick={(e)=>goDetails(d[0],d[1].type, d[1].seller)} className="btn btn-default add-to-cart" style={{borderRadius: '50px'}}><i className="fa fa-shopping-cart"></i>View</a>
												</div>
											</div>
									</div>
									
									<div style={{position:'absolute', bottom: 20, width:'88%', marginBottom: '10px'}}>
										<center>
									
										{!incart[startOfList+i]?
										<div className="text-center">
											<p style={{fontWeight:'bold'}}>Quantity</p>
											<ul className="pagination" style={{marginLeft:'50px'}} >
												<li className="page-item" ><span type="text" style={{ width: '40px', padding: '5px'}}>{qty[startOfList+i]}</span></li>
												<li className="page-item">
													<button className="page-link" style={{borderRadius: '30px', display: 'inline-flex', bottom: 5}} onClick={()=>addamt(startOfList+i)}><i className="fas fa-plus"></i></button>
												</li>
												<li className="page-item">
													<button className="page-link" style={{borderRadius: '30px', display: 'inline-flex', top: 12, right: 45}} onClick={()=>qty[startOfList+i]>1?reduceamt(startOfList+i):null}><i className="fas fa-minus"></i> </button>
												</li>
											</ul>
										</div>:<p style={{fontSize: '15px', fontWeight:'bold'}}>THIS PRODUCT IS ALREADY IN YOUR CART</p>}
										
									<div className="text-center" >
									{!incart[startOfList+i]?<a onClick={(e)=>addProdtoCart(d[0], d[1].title, d[1].price, d[1].description, d[1].link, d[1].seller, d[1].type, d[1].id, qty[startOfList+i], d[1].discount!==undefined?d[1].discount:null, d[1].startD!==undefined?d[1].startD:null, d[1].endD!==undefined?d[1].endD:null)} className="btn btn-default" style={{borderRadius: '50px', marginBottom: '40px',  fontSize: '15px' ,position: 'relative'}}><i className="fa fa-shopping-cart"></i>Add to Cart</a>:null}
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
									<div className="col-sm-4" key={i} >
									<div className="product-image-wrapper" style={{borderWidth: '1px',  borderColor: 'black', borderRadius: '10px'}}>
										<div className="single-products">
												<div className="productinfo text-center" >
												<div class="ribbon-wrapper">
												{chforD[startOfList+i]?<div class="ribbon">{d[1].discount} %</div>:null}
													
												</div>
												<img src={d[1].link} alt={d[1].link} style={{width: '100%', height: '230px'}}/>
												<h2>{d[1].title}</h2>
												<p>By: {d[1].seller}</p>
												<p>Category: {d[1].type}</p>
												
												<p style={{fontSize: '14px', fontWeight:'bold'}}>Stock: {parseInt(d[1].numberofitems)!==0?d[1].numberofitems:'0 Stock!'}</p>
												<select className="form-control alterationTypeSelect" style={{width: '90%', height: '35px', marginLeft:'5%', marginRight:'5%'}}>
												<option selected disabled >Check for available Dates</option>
													{dates.map((d2, ib)=>
													d2[0]===d[0]?d2[1].length!==0?d2[1].map((d3, i2)=><option key={i2} disabled>{new Date(d3[1].date).toDateString()}</option>):<option key={ib} disabled>No available date for advance order</option>
													:null)}
												</select>
												</div>
											
											<div className="product-overlay">
												<div className="overlay-content">
													<h2>{d[1].description}</h2>
													{chforD[startOfList+i]?<p>Discount: {d[1].discount}%</p>:null}
													{chforD[startOfList+i]?<div><p>Old Price ₱{NumberFormat(Number(d[1].price).toFixed(2))}</p><p><strong>New Price: ₱{NumberFormat(Number(d[1].price-(d[1].price*(d[1].discount/100))).toFixed(2))}</strong></p></div>:<p> ₱{NumberFormat(Number(d[1].price).toFixed(2))}</p>}
													<a onClick={(e)=>goDetails(d[0],d[1].type, d[1].seller)} className="btn btn-default add-to-cart" style={{borderRadius: '50px'}}><i className="fa fa-shopping-cart"></i>View</a>
													</div>
											</div>
									</div>
									<div style={{position:'absolute', bottom: 20, width:'88%', marginBottom: '10px'}}>
										<center>
										{!incart[startOfList+i]?
										<div className="text-center">
										<p style={{fontWeight:'bold'}}>Quantity</p>
										<ul className="pagination" style={{marginLeft:'50px'}} >
										
								
											<li className="page-item" ><span type="text" style={{ width: '40px', padding: '5px'}}>{qty[startOfList+i]}</span></li>
											<li className="page-item">
												<button className="page-link" style={{borderRadius: '30px', display: 'inline-flex', bottom: 5}} onClick={()=>addamt(startOfList+i)}><i className="fas fa-plus"></i></button>
											</li>
											<li className="page-item">
												<button className="page-link" style={{borderRadius: '30px', display: 'inline-flex', top: 12, right: 45}} onClick={()=>qty[startOfList+i]>1?reduceamt(startOfList+i):null}><i className="fas fa-minus"></i> </button>
											</li>
											
												</ul>
										</div>	:<p style={{fontSize: '15px', fontWeight:'bold'}}>THIS PRODUCT IS ALREADY IN YOUR CART</p>}
									<div className="text-center">
									{!incart[startOfList+i]?<a onClick={(e)=>addProdtoCart(d[0], d[1].title, d[1].price, d[1].description, d[1].link, d[1].seller, d[1].type, d[1].id,  qty[startOfList+i], d[1].discount!==undefined?d[1].discount:null, d[1].startD!==undefined?d[1].startD:null, d[1].endD!==undefined?d[1].endD:null)} className="btn btn-default" style={{borderRadius: '50px', marginBottom: '40px',  fontSize: '15px' ,position: 'relative'}}><i className="fa fa-shopping-cart"></i>Add to Cart</a>:null}
									</div>
									<div className="choose" >
									<h5><a href="#">Ratings: ({startOfList+i<rate.length?rate[startOfList+i][1]: 0})</a></h5>
										<ul className="nav nav-pills nav-justified">
											
											
											<div className="rating" style={{pointerEvents: 'none', width: '100%'}}>
												<input type="radio" name={startOfList+i+"rating"} value="5" id={startOfList+i+"5"} readOnly={true} defaultChecked={false}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="4" id={startOfList+i+"4"} readOnly={true}  defaultChecked={false}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="3" id={startOfList+i+"3"} readOnly={true}  defaultChecked={false}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="2" id={startOfList+i+"2"} readOnly={true}  defaultChecked={false}/><label>☆</label>
												<input type="radio" name={startOfList+i+"rating"} value="1" id={startOfList+i+"1"} readOnly={true}  defaultChecked={false}/><label>☆</label>
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
					</div>:<MenuDetails dates = {dates} toCart = {true} idnum={props.idnum}  logedin={props.logedin} legitkey = {props.legitkey} menu = {props.menu} set = {props.set} type = {t} seller = {s} changeM ={changeMenuD}/>}
				</div>
			</div>

	</section></main>
	<footer id="footer">
            <div className="footer-top " style={props.legitkey===true && props.logedin===true && props.idnum!==null?{backgroundColor: '#353333'}:{backgroundColor: '#353333', color: 'black'}}>
                <div className="container">
                    
                    <div className="row">
                        <div col-lg-3="true" col-md-6="true">
                            <div className="footer-info">
                                <div className="section-title">
                                <h2>Eats Online</h2>
                                </div>
                                <p style={props.legitkey===true && props.logedin===true && props.idnum!==null?null:{color: 'white'}}>
                                <strong style={props.legitkey===true && props.logedin===true && props.idnum!==null?null:{color: 'white'}}>Location:</strong> 19, Via Milano St., Villa Firenze, Quezon City, Philippines <br></br>
                                    <strong style={props.legitkey===true && props.logedin===true && props.idnum!==null?null:{color: 'white'}}>Open Hours:</strong> Monday-Saturday: 9:00 AM-5:00 PM<br></br>
                                    <strong style={props.legitkey===true && props.logedin===true && props.idnum!==null?null:{color: 'white'}}>Phone:</strong> 09157483872<br></br>
                                    <strong style={props.legitkey===true && props.logedin===true && props.idnum!==null?null:{color: 'white'}}>Email: </strong> eats.onlne@gmail.com<br></br>
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
                    &copy; Copyright <strong><span style={{color: '#eaec31', textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', letterSpacing: '3px'}}>Eats Online</span></strong>. All Rights Reserved
                </div>
            </div>
        </footer>
	</div>
    )
}

export default Menu;

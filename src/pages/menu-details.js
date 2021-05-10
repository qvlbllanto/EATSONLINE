


import React, {useState} from 'react';
import { useHistory, Link } from "react-router-dom";
import { checkIfItemisBought, checkk, getProductData, getAccountDetails, NumberFormat, addCart, addComment, getProductComments, getType, addAdvanceOrderList} from "./functions";

const MenuDetails = (props) =>{
	const [message, setMessage] = useState(null);
	const [rating, setRating] = useState(0);
	const [comments, setComments] = useState([]);
	const [startOfList, setStartOfList] = useState(0);
	const [ch, setCh] = useState(false);
	const history = useHistory();
	const [val, setVal] = useState({});
	const [recommended, setRecommended] = useState([]);
	const [accountD, setAccountD] = useState({});
	const [qty, setQty] = useState(1);
	const [c , sc] = useState(false);
	const [ifcommented, setIfCommented] = useState(false);
    React.useEffect(()=>{
		if(!ch){
			document.getElementById("main").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
			setCh(true);
		}
		const timer = setTimeout(() => {
			getType(props.type, props.seller, props.menu).then((d)=>{
				setRecommended(d);
			})
			getProductData(props.menu).then((d)=>{
				setVal(d)
			});
			checkk(props.menu, props.idnum).then((d)=>{
				sc(d);
			})
			checkIfItemisBought(props.idnum, props.menu).then((d)=>{
				setIfCommented(d);
			})
			getProductComments(props.menu).then((d)=>{
				setComments(d);
			})
			getAccountDetails(props.idnum).then((d)=>{
                setAccountD(d);
			})
           }, 500);
           return () => clearTimeout(timer);
		
    });

	const addamt =()=> {
		setQty(qty+1);
	}
	const reduceamt =()=> {
		setQty(qty-1);
		
	}

	 const goLogin = () =>{
        history.push('/login');
      }
	const addProdtoCartR = (menuid, title, price, desc, link, seller, type , id) => {
        if(props.logedin){
            addCart(menuid, title, price, desc, link, props.idnum, seller, type, id, qty);
        }else{
            goLogin();
        }
    }
    return(
		<div className="col-sm-9 padding-right" id="o">
			<div className="product-details">
				<div className="col-sm-5">
					<div className="view-product">
						<img src={val.link} alt="" />
					</div>
				</div>

				
				<div className="col-sm-7">
					<div className="product-information">
						<h2>{val.title}</h2>
						<span>
							<span>₱{NumberFormat(Number(val.price).toFixed(2))}</span>
							{!c?parseInt(val.numberofitems)!==0?<button type="button" className="btn1 btn-fefault cart"  style={{borderRadius: '50px'}} onClick={()=>addProdtoCartR(props.menu, val.title, val.price, val.description, val.link, val.seller, val.type, val.id)}>
								<i className="fa fa-shopping-cart"></i>
								{props.toCart?'Add to cart':'Add to List'}
							</button>:null:null}
						</span>

											{/* + - */}
											{!c?
											<div >
											<p style={{fontWeight:'bold'}}>Quantity</p>
											<ul className="pagination">
												<li className="page-item" ><span type="text" style={{ width: '40px', padding: '5px', bottom: 17,}}>{qty}</span></li>
												<li className="page-item">
													<button className="page-link" style={{borderRadius: '30px', display: 'inline-flex', bottom: 5}} onClick={()=>addamt()}><i className="fas fa-plus"></i></button>
												</li>
												<li className="page-item">
													<button className="page-link" style={{borderRadius: '30px', display: 'inline-flex', top: 12, right: 45}} onClick={()=>qty>1?reduceamt():null}><i className="fas fa-minus"></i> </button>
												</li>
											</ul>
											</div>:<p>This product is already in your cart</p>}
														
												<p><b>Stock: </b>{parseInt(val.numberofitems)!==0?val.numberofitems: <span style={{fontWeight: 'bold'}}>Out of Stock!</span>}</p>
												<p><b>Category:</b>{val.type}</p>
												<p><b>Supplier:</b> {val.seller}</p>
												<p>Available Dates</p>
						<select className="form-control alterationTypeSelect" style={{width: '100%', height: '35px'}}>
							{props.dates.map((d2, ib)=>
							d2[0]===props.menu?d2[1].length!==0?d2[1].map((d3, i2)=><option key={i2}>{new Date(d3[1].date).toDateString()}</option>):<option key={ib}>No available date for advance order</option>
							:null)}
						</select>
						<a href=""><img src="images/product-details/share.png" className="share img-responsive"  alt="" /></a>
					</div>

					
				</div>
			</div>
			
			<div className="category-tab shop-details-tab">
				<div className="col-sm-12">
					<ul className="nav nav-tabs">
						<li className="active"><a href="#reviews" data-toggle="tab">Reviews ({comments.length})</a></li>
					</ul>
				</div>
				<div className="tab-content">
		
					
					<div className="tab-pane fade active in" id="reviews" >
						{comments.map((d, i)=>{
							return(<div className="col-sm-12" key={i}  style={{boxShadow:'0 3px 1px #aa2b1d', marginTop:'2px', padding:'13px' }}>
							<ul>
								<li><a><i className="fa fa-user"></i>{d.user}</a></li>
								<li><a><i className="fa fa-clock-o"></i>{new Date(d.date).toLocaleTimeString()}</a></li>
								<li><a><i className="fa fa-calendar-o"></i>{new Date(d.date).toDateString()}</a></li>
							</ul>
							<p style={{textAlign: 'left'}}>Rating: {}{Array(parseInt(d.rating)).fill(null).map((o,i)=>{
								return(<label key={i} style={{ pointerEvents: 'none', color: 'red', margin: 1}}>☆</label>);
							})}</p>
							<p style={{textAlign: 'left'}}><b>{d.message}</b></p>
							
						</div>);
						})}
					
						{props.logedin && props.legitkey && ifcommented?<form onSubmit={(e)=>{e.preventDefault();addComment(props.menu, message, accountD.name, rating, accountD.email, accountD.id).then((d)=>{
										});}}>
								<textarea name="" id="textar" onChange={(e)=>setMessage(e.target.value)} placeholder="Comment here and rate below..." style={{color:'black'}}/>
								<b>Your Rating: 
								<div className="rating">
									<input type="radio" name="rating" value="5" id="5" onClick={(e)=>setRating(e.target.value)} required={true}/><label htmlFor="5">☆</label>
									<input type="radio" name="rating" value="4" id="4" onClick={(e)=>setRating(e.target.value)}  required={true}/><label htmlFor="4">☆</label>
									<input type="radio" name="rating" value="3" id="3" onClick={(e)=>setRating(e.target.value)}  required={true}/><label htmlFor="3">☆</label>
									<input type="radio" name="rating" value="2" id="2" onClick={(e)=>setRating(e.target.value)}  required={true}/><label htmlFor="2">☆</label>
									<input type="radio" name="rating" value="1" id="1" onClick={(e)=>setRating(e.target.value)}  required={true}/><label htmlFor="1">☆</label>
									</div>
								</b>
								<button type="submit" className="btn btn-default pull-right"  style={{borderRadius: '50px'}} >
									Submit
								</button>
							</form>:props.logedin && props.legitkey && !ifcommented?<div style={{textAlign:'center'}}><h4>You need to have atleast one completed transaction containing this product to comment or rate this product. Thank you!</h4></div>:null}
					</div>
					
				</div>
			</div>
			
			<div className="recommended_items">
				<h2 className="title text-center">recommended items</h2>
				
				<div id="recommended-item-carousel" className="carousel slide" data-ride="carousel">
					<div className="carousel-inner">
						<div className="item active">	
							{recommended.slice(0, 3).map((d, i)=>{
								return(
								<div className="col-sm-4" style={{height: '100%'}} key={i}>
									<div className="product-image-wrapper2">
										<div className="single-products">
											<div className="productinfo text-center">
												<img src={d[1].link} alt={d[1].link} style={{height: '120px'}}/>
											<h2>₱{NumberFormat(Number(d[1].price).toFixed(2))}</h2>
											<p>{d[1].title}</p>
											<a style={{cursor:'pointer', margin: '10px'}} className="btn btn-default" onClick={()=>{props.changeM(d[0], d[1].type, d[1].seller); document.getElementById("o").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });}}><i className="fa fa-shopping-cart"></i>View</a>
											<a style={{cursor:'pointer',margin: '10px'}} className="btn btn-default" onClick={(e)=>parseInt(d[1].numberofitems)>0?addProdtoCartR(d[0], d[1].title, d[1].price, d[1].description, d[1].link, d[1].seller, d[1].type, d[1].id):null}><i className="fa fa-shopping-cart"></i>{parseInt(d[1].numberofitems)>0?props.toCart?'Add to cart': 'Add to list':'Out of Stock'}</a>
				
											</div>
										</div>
									</div>
								</div>)
							})}
						</div>
						{recommended.length-3>0?Array(Math.ceil((recommended.length-3)/3)).fill(null).map((d,ind)=>{
							return(
								<div className="item" key={ind}>	
									{recommended.slice((ind+1)*3, ((ind+1)*3)+3).map((d, i)=>{
										return(
										<div className="col-sm-4" style={{height: '100%'}} key={i}>
										<div className="product-image-wrapper2">
											<div className="single-products">
												<div className="productinfo text-center">
													<img src={d[1].link} alt={d[1].link}  style={{height: '120px'}} />
												<h2>₱{NumberFormat(Number(d[1].price).toFixed(2))}</h2>
												<p>{d[1].title}</p>
												<a style={{cursor:'pointer', margin: '10px'}} className="btn btn-default" onClick={()=>{props.changeM(d[0], d[1].type, d[1].seller); document.getElementById("o").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });}}><i className="fa fa-shopping-cart"></i>View</a>
												<a style={{cursor:'pointer',margin: '10px'}} className="btn btn-default" onClick={(e)=>parseInt(d[1].numberofitems)>0?addProdtoCartR(d[0], d[1].title, d[1].price, d[1].description, d[1].link, d[1].seller, d[1].type, d[1].id):null}><i className="fa fa-shopping-cart"></i>{parseInt(d[1].numberofitems)>0?props.toCart?'Add to cart': 'Add to list':'Out of Stock'}</a>
												</div>
											</div>
										</div>
									</div>);
									})}
							</div>);
						}):null}
						
					</div>
						<a className="left recommended-item-control" href="#recommended-item-carousel" data-slide="prev">
						<i className="fa fa-angle-left"></i>
						</a>
						<a className="right recommended-item-control" href="#recommended-item-carousel" data-slide="next">
						<i className="fa fa-angle-right"></i>
						</a>			
				</div>
			</div>
		</div>
 	);
}

export default MenuDetails;
										
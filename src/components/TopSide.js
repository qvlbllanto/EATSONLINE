import React from 'react';
const TopSide = (props) =>{
    React.useEffect(()=>{
        document.getElementById("myCarousel").scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
    }, [])
    return(
        <div  id="myCarousel"  className="carousel slide " data-ride="carousel">
            <div  className="carousel-inner">
                {props.img.map((d, i)=>{
                    return(i===0?
                        <div className="item active" key={i}>
                            <img className="carouselsize2" src={d}></img>
                        </div>:
                        <div className="item" key={i}>
                            <img className="carouselsize2" src={d}></img>
                        </div>
                        )
                })}
            <a className="left carousel-control" href="#myCarousel" data-slide="prev" id="prev"  style={{visibility: 'hidden'}}>
                            <span className="glyphicon glyphicon-chevron-left"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="right carousel-control" href="#myCarousel"  data-slide="next" id="right" style={{visibility: 'hidden'}}>
                            <span className="glyphicon glyphicon-chevron-right"></span>
                            <span className="sr-only">Next</span>
                        </a>
        <div className="divvv" style={props.right?{position: 'absolute', left: '30%'}:{position: 'absolute', marginLeft: '35%',marginRight: '20%',alignSelf:'center'}} >
          <h1 id="h1">{props.first}<span className="blinking">{props.second}</span></h1>
            <h2  id="h21">{props.desc}</h2>
            <h2 id="h21" style={{fontWeight: 'bold', color: '#e4c359'}}>{props.third}</h2>
           <br/>
           </div>
             </div>
        </div>
    );

}

export default TopSide;
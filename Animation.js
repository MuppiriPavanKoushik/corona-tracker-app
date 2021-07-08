import React from 'react'


function Animation(props) {
    return (
        <div className="animatorbody">
        <div className="animator">
           <div className="staticanimation">{props.frontword}</div>
          <ul className="dynamicanimation">
            <li><span> {props.element1}</span></li>
            <li><span>{props.element2}</span></li>
            <li><span>Dont panic</span></li>
           </ul>
       

        </div>
       </div>
       
    )
}

export default Animation;

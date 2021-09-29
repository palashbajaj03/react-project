/* Info: This file is for Header Component */
/* Created on {3-07-19} By {Siddhant Chopra}*/
/* Modified on {8-07-19} By {Siddhant Chopra}*/

import React from 'react'
import './Header.css'

const Header = (props) => {
  if(props.pathname === '/dashboard'){
    if( localStorage.getItem('fadeuponce') === null){
      setTimeout(()=>{
     if(document.getElementsByClassName('headerTop')[0]!== undefined){
       document.getElementsByClassName('headerTop')[0].classList.add('fadeOutUp')
        localStorage.setItem('fadeuponce','fadeTrue')
     }   
      },5000)
      setTimeout(()=>{
       if( document.getElementsByClassName('car-box-row')[0] !== undefined && document.getElementsByClassName('headerTop')[0]!== undefined){
        document.getElementsByClassName('headerTop')[0].style.display = 'none'
         //document.getElementsByClassName('car-box-row')[0].classList.remove('mt50')
          document.getElementsByClassName('content-wrapper')[0].classList.add('fadeuptop')
       }   
        },6000)
    }
  }
  
  return (<React.Fragment>{
    localStorage.getItem('fadeuponce') === null ?<div className="page-title-row animated headerTop">
      <div className="page-title-box">
        <h2 className="page-title"> Welcome {props.firstname}!</h2>
        {/* <span className="page-title-text"> Here is your customised home page </span> */}
      </div>
      {/* <button className="btn btn-secondary"> <i className="icon-plus"></i> ADD WIDGET </button> */}
    </div>: ''
    }
  </React.Fragment>
    
  )
}

export default Header;
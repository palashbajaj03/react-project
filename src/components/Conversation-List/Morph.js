import React, { useState } from 'react';
import { useMorph } from 'react-morph';
import AllSearch from '../Search/AllSearch'
//import './styles.css';

function Morph() {
  const [toggle, setToggle] = useState(false);

       const morph = useMorph();
       const closeMorph = (toggle)=>{
        setToggle(toggle)
       }

  return (
    <div className="    ">
      {!toggle && <button onClick={() => setToggle(!toggle)}>Let's morph!</button>}

      {toggle && <div {...morph}><AllSearch close={(toggle) => {closeMorph(toggle)}}/></div>  }
 
      {!toggle && <div {...morph}></div>}
    </div>
  );
}

export default Morph
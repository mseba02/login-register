// imports
import React from "react";

import './header.css';

// header
const Header = (props) => {
    return (
        <header className='main-header'>
           <h5 className="main-header__logo">some logo</h5>
            {props.children}
        </header>
    )
}

// export header
export  default Header;
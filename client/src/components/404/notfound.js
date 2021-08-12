// imports
import React from "react";
import {Link} from "react-router-dom";

// not found
const NotFound = () => {
    return(
        <div>
            <h2>404!</h2>
            <Link to="/">Home</Link>
    </div>
    )
}

// export not found
export default NotFound;
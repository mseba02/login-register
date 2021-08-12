// imports
import React, {useEffect} from "react";
import {Link} from "react-router-dom";

import {useHttpClient} from "../../hooks/http-hook";
import {useAuth} from "../../hooks/auth-hook";

const ActivateAccount = () => {
    const {sendRequest} = useHttpClient();
    const {token} = useAuth();

    const userId = JSON.parse(localStorage.getItem('userid'));
    // activate account
    const activateFetch = async () => {

        try{
            await sendRequest(
                `http://localhost:5000/users//activate/${userId}`,
                'PATCH',
                {
                    'Content-Type': 'application/json'
                }
            )

        } catch (e) {}
    };

    // did mount
    useEffect(() => {
        activateFetch();
    },[]);

    // jsx
    return (
        <>
            {!token ?
            <p className="activate__p">Your account is now activated, <br />you can <Link to='/login'>log in</Link></p>
            :
            <p className="activate__p">Your account is already activated, <br />back to <Link to='/login'>dashboard</Link></p>
            }
        </>
    )
}

// export component
export default ActivateAccount;
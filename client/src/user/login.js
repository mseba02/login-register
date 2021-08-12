// imports
import React, {useState} from "react";
import {Link} from "react-router-dom";

import {useHttpClient} from "../hooks/http-hook";
import {useAuth} from "../hooks/auth-hook";

import {updateIndexVal, validateEmail, updateError} from "../utils/utils";
import {inputs} from '../utils/inputs';

// copy inputs
const updatedInputs = {...inputs};

// component
const Login = () => {
    const {token, login, logout} = useAuth();
    const {isLoading, sendRequest} = useHttpClient();

    // state
    const [error, setError] = useState('');
    const [inputsLog, setInputsLog] = useState([...updatedInputs.loginInputs]);
    const [user, setUser] = useState({});

    // update inputs on change
    const handleInputChange = (e, index) => {
        const updatedInputs = [...inputsLog];
        updateIndexVal(updatedInputs, e, index);
        setInputsLog(updatedInputs);

       updateError(updatedInputs, index, e, 6);
    };

    // handle login
    const handleLogin = async (e) => {
        e.preventDefault();

        // store all inputs value in object
        const data = inputsLog.reduce((acc, cur) => {
            acc[cur.key] = cur.value;
            return acc;
        }, {});

        const {email, password} = data;
        const validatedEmail = validateEmail(email);

        // password error
        if(!password.length > 5 || password.length === 0 ){
            setError(' Password must be at least 6 digits')
        }

        // if email adrress is not valid
        if(!validatedEmail){
            setError('Please enter a valid email')
        }

        // submit - everythings fine
        if(validatedEmail && password.length > 5){
            try{
                const responseData = await sendRequest(
                    'http://localhost:5000/users/login',
                    'POST',
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({email, password})
                )
                const response = await responseData;
                login(response.userId, response.token);
                setUser(response);

            } catch (e) {
                let error = e.toString();
                error = error.replace('Error:', '');
                setError(error);
            }
        }
    }

    // show user details
    const renderUserInfo = () => {
            if(token){
            const {lastName} = user;
            console.log(user)
            return <span>Welcome back, {lastName}</span>
        }
    }

    // jsx
    return (
        <div>
            {!token ?
                <div>
                    <div className="headers-text">
                        <h3 className="headers-text__title">Login</h3>
                    </div>

                    {/* form */}
                    <form className="inputsForm registerForm" onSubmit={handleLogin}>
                        <div className={`loader ${isLoading ? 'loader__active' : ''}`}>
                            <div className="lds-ripple">
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                        {inputsLog.map( (item ,index) => {
                            return <div key={item.id} className="position-relative d-inline-block">
                                <input type={item.type} id={item.id} onChange={e => handleInputChange(e, index, 'inputReg')} value={item.value} className="inputsForm__all"/>
                                <label htmlFor={item.id} className="inputsForm__label">{item.label}</label>
                                <div className="error">{item.error}</div>
                            </div>
                        })}

                        <button>Login</button>
                        <span className="error">{error}</span>

                        <p className="inputsForm__login">New to website? <Link to="/">Register</Link></p>
                    </form>
                </div> :
                <div>
                    <div className="headers-text">
                        <h3 className="headers-text__title">Hooray!</h3>
                        {renderUserInfo()}
                        <p className="inputsForm__login" onClick={logout}>If you want to change the account, use <a>Logout</a></p>
                    </div>
                </div>
            }
        </div>
    )
}

// export
export default Login;

